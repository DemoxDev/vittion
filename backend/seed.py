import json
import os
from app import app
from models import db, Image, Design, Treatment, Material

# Define paths relative to the project root (mounted in Docker)
DATA_PATH = './src/lib/data'

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Seed Images
        with open(os.path.join(DATA_PATH, 'images.json'), 'r') as f:
            images_data = json.load(f)
            for img in images_data:
                image = Image(
                    id=img['id'],
                    name=img['name'],
                    url=img['url'],
                    category=img['category'],
                    resolution=img['resolution']
                )
                db.session.add(image)

        # Seed Designs
        with open(os.path.join(DATA_PATH, 'designs.json'), 'r') as f:
            designs_data = json.load(f)
            for d in designs_data:
                design = Design(
                    id=d['id'],
                    code=d['code'],
                    name=d['name'],
                    description=d['description'],
                    image_id=d.get('image_id')
                )
                db.session.add(design)

        # Seed Treatments
        with open(os.path.join(DATA_PATH, 'treatments.json'), 'r') as f:
            treatments_data = json.load(f)
            for t in treatments_data:
                treatment = Treatment(
                    id=t['id'],
                    code=t['code'],
                    name=t['name'],
                    description=t['description'],
                    image_id=t.get('image_id')
                )
                db.session.add(treatment)

        # Seed Materials
        with open(os.path.join(DATA_PATH, 'materials.json'), 'r') as f:
            materials_data = json.load(f)
            for m in materials_data:
                material = Material(
                    id=m['id'],
                    code=m['code'],
                    name=m['name'],
                    description=m['description'],
                    image_id=m.get('image_id')
                )
                db.session.add(material)

        db.session.commit()
        
        # Synchronize sequences for Postgres after manual ID inserts
        for table in ['images', 'designs', 'treatments', 'materials']:
            db.session.execute(db.text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM {table};"))
        
        db.session.commit()
        print("Database seeded and sequences synchronized successfully!")

if __name__ == '__main__':
    seed_data()
