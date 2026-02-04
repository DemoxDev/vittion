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

@app.route('/api/images', methods=['POST'])
def create_image():
    data = request.json
    new_img = Image(
        name=data.get('name'),
        url=data.get('url'),
        category=data.get('category'),
        resolution=data.get('resolution')
    )
    db.session.add(new_img)
    db.session.commit()
    return jsonify(serialize(new_img)), 201

@app.route('/api/images/<int:id>', methods=['PUT'])
def update_image(id):
    image = Image.query.get_or_404(id)
    data = request.json
    image.name = data.get('name', image.name)
    image.url = data.get('url', image.url)
    image.category = data.get('category', image.category)
    image.resolution = data.get('resolution', image.resolution)
    db.session.commit()
    return jsonify(serialize(image))

@app.route('/api/images/<int:id>', methods=['DELETE'])
def delete_image(id):
    image = Image.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({"success": True})

# --- Entities: Design, Treatment, Material ---

def get_entity_model(model_type):
    if model_type == 'Design': return Design
    if model_type == 'Traitement': return Treatment
    if model_type == 'Matière': return Material
    return None

@app.route('/api/designs', methods=['GET'])
def get_designs():
    return jsonify([serialize(d) for d in Design.query.all()])

@app.route('/api/designs', methods=['POST'])
def create_design():
    data = request.json
    new_ent = Design(
        code=data.get('code'),
        name=data.get('name'),
        description=data.get('description'),
        image_id=data.get('image_id')
    )
    db.session.add(new_ent)
    db.session.commit()
    return jsonify(serialize(new_ent)), 201

@app.route('/api/designs/<int:id>', methods=['PUT'])
def update_design(id):
    ent = Design.query.get_or_404(id)
    data = request.json
    ent.code = data.get('code', ent.code)
    ent.name = data.get('name', ent.name)
    ent.description = data.get('description', ent.description)
    ent.image_id = data.get('image_id', ent.image_id)
    db.session.commit()
    return jsonify(serialize(ent))

@app.route('/api/designs/<int:id>', methods=['DELETE'])
def delete_design(id):
    ent = Design.query.get_or_404(id)
    db.session.delete(ent)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/treatments', methods=['GET'])
def get_treatments():
    return jsonify([serialize(t) for t in Treatment.query.all()])

@app.route('/api/treatments', methods=['POST'])
def create_treatment():
    data = request.json
    new_ent = Treatment(
        code=data.get('code'),
        name=data.get('name'),
        description=data.get('description'),
        image_id=data.get('image_id')
    )
    db.session.add(new_ent)
    db.session.commit()
    return jsonify(serialize(new_ent)), 201

@app.route('/api/treatments/<int:id>', methods=['PUT'])
def update_treatment(id):
    ent = Treatment.query.get_or_404(id)
    data = request.json
    ent.code = data.get('code', ent.code)
    ent.name = data.get('name', ent.name)
    ent.description = data.get('description', ent.description)
    ent.image_id = data.get('image_id', ent.image_id)
    db.session.commit()
    return jsonify(serialize(ent))

@app.route('/api/treatments/<int:id>', methods=['DELETE'])
def delete_treatment(id):
    ent = Treatment.query.get_or_404(id)
    db.session.delete(ent)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/materials', methods=['GET'])
def get_materials():
    return jsonify([serialize(m) for m in Material.query.all()])

@app.route('/api/materials', methods=['POST'])
def create_material():
    data = request.json
    new_ent = Material(
        code=data.get('code'),
        name=data.get('name'),
        description=data.get('description'),
        image_id=data.get('image_id')
    )
    db.session.add(new_ent)
    db.session.commit()
    return jsonify(serialize(new_ent)), 201

@app.route('/api/materials/<int:id>', methods=['PUT'])
def update_material(id):
    ent = Material.query.get_or_404(id)
    data = request.json
    ent.code = data.get('code', ent.code)
    ent.name = data.get('name', ent.name)
    ent.description = data.get('description', ent.description)
    ent.image_id = data.get('image_id', ent.image_id)
    db.session.commit()
    return jsonify(serialize(ent))

@app.route('/api/materials/<int:id>', methods=['DELETE'])
def delete_material(id):
    ent = Material.query.get_or_404(id)
    db.session.delete(ent)
    db.session.commit()
    return jsonify({"success": True})

# --- Relationship Management ---

@app.route('/api/link', methods=['POST'])
def link_image():
    data = request.json
    entity_type = data.get('type')
    entity_id = data.get('id')
    image_id = data.get('image_id')

    model = get_entity_model(entity_type)
    if not model:
        return jsonify({"error": "Invalid type"}), 400

    entity = model.query.get(entity_id)
    if not entity:
        return jsonify({"error": "Entity not found"}), 404

    entity.image_id = image_id
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/unlink', methods=['POST'])
def unlink_image():
    data = request.json
    entity_type = data.get('type')
    entity_id = data.get('id')

    model = get_entity_model(entity_type)
    if not model:
        return jsonify({"error": "Invalid type"}), 400

    entity = model.query.get(entity_id)
    if not entity:
        return jsonify({"error": "Entity not found"}), 404

    entity.image_id = None
    db.session.commit()
    return jsonify({"success": True})

# Create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
