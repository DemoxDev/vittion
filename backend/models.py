from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    url = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    resolution = db.Column(db.String(50))
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    designs = db.relationship('Design', backref='image', lazy=True)
    treatments = db.relationship('Treatment', backref='image', lazy=True)
    materials = db.relationship('Material', backref='image', lazy=True)

class Design(db.Model):
    __tablename__ = 'designs'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=True)
    lenses = db.relationship('Lens', backref='design', lazy=True)

class Treatment(db.Model):
    __tablename__ = 'treatments'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=True)
    lenses = db.relationship('Lens', backref='treatment', lazy=True)

class Material(db.Model):
    __tablename__ = 'materials'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    image_id = db.Column(db.Integer, db.ForeignKey('images.id'), nullable=True)
    lenses = db.relationship('Lens', backref='material', lazy=True)

class Lens(db.Model):
    __tablename__ = 'lenses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    edi_code = db.Column(db.String(50), unique=True)
    
    # Relationships
    design_id = db.Column(db.Integer, db.ForeignKey('designs.id'), nullable=True)
    material_id = db.Column(db.Integer, db.ForeignKey('materials.id'), nullable=True)
    treatment_id = db.Column(db.Integer, db.ForeignKey('treatments.id'), nullable=True)
