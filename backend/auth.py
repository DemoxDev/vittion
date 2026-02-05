"""
GitHub OAuth Authentication Module using Authlib and JWT tokens.

Provides:
- GitHub OAuth login flow
- JWT access + refresh token generation
- @require_auth decorator for protecting routes
"""

from flask import Blueprint, request, jsonify, redirect, current_app, url_for
from authlib.integrations.requests_client import OAuth2Session
from functools import wraps
import jwt
import os
from datetime import datetime, timedelta, timezone

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# In-memory storage for refresh tokens (use Redis/DB in production)
# Format: {refresh_token: {"user_id": str, "expires_at": datetime}}
refresh_tokens = {}


def get_oauth_client():
    """Create OAuth2 session for GitHub."""
    return OAuth2Session(
        client_id=os.getenv('GITHUB_CLIENT_ID'),
        client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
        authorization_endpoint='https://github.com/login/oauth/authorize',
        token_endpoint='https://github.com/login/oauth/access_token',
        redirect_uri=os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:5000/api/auth/callback')
    )


def generate_tokens(user_data: dict) -> dict:
    """Generate access and refresh tokens for a user."""
    secret = os.getenv('JWT_SECRET_KEY', 'dev-secret-change-me')
    access_expires = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 900))  # 15 minutes
    refresh_expires = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7 days
    
    now = datetime.now(timezone.utc)
    
    # Access token (short-lived)
    access_payload = {
        'sub': str(user_data['id']),
        'username': user_data['login'],
        'avatar_url': user_data.get('avatar_url'),
        'name': user_data.get('name'),
        'iat': now,
        'exp': now + timedelta(seconds=access_expires),
        'type': 'access'
    }
    access_token = jwt.encode(access_payload, secret, algorithm='HS256')
    
    # Refresh token (long-lived)
    refresh_payload = {
        'sub': str(user_data['id']),
        'iat': now,
        'exp': now + timedelta(seconds=refresh_expires),
        'type': 'refresh'
    }
    refresh_token = jwt.encode(refresh_payload, secret, algorithm='HS256')
    
    # Store refresh token
    refresh_tokens[refresh_token] = {
        'user_id': str(user_data['id']),
        'user_data': user_data,
        'expires_at': now + timedelta(seconds=refresh_expires)
    }
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': access_expires
    }


def decode_token(token: str, token_type: str = 'access') -> dict | None:
    """Decode and validate a JWT token."""
    secret = os.getenv('JWT_SECRET_KEY', 'dev-secret-change-me')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        if payload.get('type') != token_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """Decorator to protect routes requiring authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header[7:]  # Remove 'Bearer ' prefix
        payload = decode_token(token, 'access')
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Attach user info to request
        request.current_user = {
            'id': payload['sub'],
            'username': payload.get('username'),
            'avatar_url': payload.get('avatar_url'),
            'name': payload.get('name')
        }
        
        return f(*args, **kwargs)
    return decorated


@auth_bp.route('/login')
def login():
    """Initiate GitHub OAuth login flow."""
    client = get_oauth_client()
    uri, state = client.create_authorization_url(
        'https://github.com/login/oauth/authorize',
        scope='read:user'
    )
    # Store state in session/cookie for validation (simplified for demo)
    response = redirect(uri)
    response.set_cookie('oauth_state', state, httponly=True, samesite='Lax', max_age=600)
    return response


@auth_bp.route('/callback')
def callback():
    """Handle GitHub OAuth callback."""
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Missing authorization code'}), 400
    
    client = get_oauth_client()
    
    try:
        # Exchange code for token
        token = client.fetch_token(
            'https://github.com/login/oauth/access_token',
            authorization_response=request.url,
            grant_type='authorization_code'
        )
        
        # Fetch user info from GitHub
        client.token = token
        resp = client.get('https://api.github.com/user')
        user_data = resp.json()
        
        # Generate our own JWT tokens
        tokens = generate_tokens(user_data)
        
        # Redirect to frontend with tokens in URL fragment (more secure than query params)
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        redirect_url = (
            f"{frontend_url}/login/callback"
            f"#access_token={tokens['access_token']}"
            f"&refresh_token={tokens['refresh_token']}"
            f"&expires_in={tokens['expires_in']}"
        )
        
        return redirect(redirect_url)
        
    except Exception as e:
        current_app.logger.error(f"OAuth callback error: {e}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?error=oauth_failed")


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token."""
    data = request.get_json() or {}
    refresh_token = data.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'error': 'Missing refresh token'}), 400
    
    # Validate refresh token
    payload = decode_token(refresh_token, 'refresh')
    if not payload:
        return jsonify({'error': 'Invalid or expired refresh token'}), 401
    
    # Check if refresh token is in our store and not revoked
    token_data = refresh_tokens.get(refresh_token)
    if not token_data:
        return jsonify({'error': 'Refresh token not found or revoked'}), 401
    
    # Check expiry
    if datetime.now(timezone.utc) > token_data['expires_at']:
        del refresh_tokens[refresh_token]
        return jsonify({'error': 'Refresh token expired'}), 401
    
    # Generate new tokens
    new_tokens = generate_tokens(token_data['user_data'])
    
    # Revoke old refresh token
    del refresh_tokens[refresh_token]
    
    return jsonify(new_tokens)


@auth_bp.route('/me')
@require_auth
def me():
    """Get current user info."""
    return jsonify(request.current_user)


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout and revoke refresh token."""
    data = request.get_json() or {}
    refresh_token = data.get('refresh_token')
    
    if refresh_token and refresh_token in refresh_tokens:
        del refresh_tokens[refresh_token]
    
    return jsonify({'success': True})


def cleanup_expired_tokens():
    """Remove expired refresh tokens from storage."""
    now = datetime.now(timezone.utc)
    expired = [k for k, v in refresh_tokens.items() if v['expires_at'] < now]
    for token in expired:
        del refresh_tokens[token]
