from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Image, Design, Treatment, Material
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://nextvision:nextvision@db:5432/nextvision')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Helper to serialize models
def serialize(obj):
    if obj is None:
        return None
    data = {}
    for column in obj.__table__.columns:
        val = getattr(obj, column.name)
        if isinstance(val, datetime):
            val = val.isoformat()
        data[column.name] = val
    return data

@app.route('/api/images', methods=['GET'])
def get_images():
    images = Image.query.all()
    return jsonify([serialize(img) for img in images])

@app.route('/api/images/<int:id>', methods=['GET'])
def get_image(id):
    image = Image.query.get_or_404(id)
    return jsonify(serialize(image))

@app.route('/api/designs', methods=['GET'])
def get_designs():
    designs = Design.query.all()
    return jsonify([serialize(d) for d in designs])

@app.route('/api/treatments', methods=['GET'])
def get_treatments():
    treatments = Treatment.query.all()
    return jsonify([serialize(t) for t in treatments])

@app.route('/api/materials', methods=['GET'])
def get_materials():
    materials = Material.query.all()
    return jsonify([serialize(m) for m in materials])

@app.route('/api/unlink', methods=['POST'])
def unlink_image():
    data = request.json
    entity_type = data.get('type')
    entity_id = data.get('id')

    if entity_type == 'Design':
        entity = Design.query.get(entity_id)
    elif entity_type == 'Traitement':
        entity = Treatment.query.get(entity_id)
    elif entity_type == 'Matière':
        entity = Material.query.get(entity_id)
    else:
        return jsonify({"error": "Invalid type"}), 400

    if entity:
        entity.image_id = None
        db.session.commit()
        return jsonify({"success": True})
    
    return jsonify({"error": "Entity not found"}), 404

# Create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
