# smartfarm_server/app/__init__.py

from flask import Flask
from config import config_by_name
from .models.database import db # Impor instance SQLAlchemy
# Import ekstensi lain jika ada (misal: Migrate, Marshmallow, dll.)
# from flask_migrate import Migrate
# from flask_marshmallow import Marshmallow

# Inisialisasi ekstensi di luar factory agar bisa diimpor di modul lain
# db = SQLAlchemy() # Pindahkan inisialisasi ke models/database.py
# migrate = Migrate()
# ma = Marshmallow()

def create_app(config_name: str) -> Flask:
    """
    Application Factory: Membuat dan mengonfigurasi instance aplikasi Flask.

    Args:
        config_name (str): Nama konfigurasi (misal: 'development', 'production').

    Returns:
        Flask: Instance aplikasi Flask yang telah dikonfigurasi.
    """
    app = Flask(__name__)

    # Muat konfigurasi dari objek berdasarkan nama
    try:
        app.config.from_object(config_by_name[config_name])
        print(f" * Loading configuration: {config_name}") # Info log sederhana
    except KeyError:
        print(f" * ERROR: Invalid configuration name: {config_name}")
        print(f" * Using default configuration: default (development)")
        app.config.from_object(config_by_name['default'])

    # Inisialisasi ekstensi Flask dengan aplikasi
    db.init_app(app)
    # migrate.init_app(app, db) # Jika menggunakan Flask-Migrate
    # ma.init_app(app) # Jika menggunakan Flask-Marshmallow

    # Daftarkan Blueprint (grup rute API)
    from .api.routes import api_bp # Impor Blueprint dari modul rute
    app.register_blueprint(api_bp, url_prefix='/api/v1') # Daftarkan dengan prefix URL

    # Tambahkan route sederhana untuk pengujian awal (opsional)
    @app.route('/health')
    def health_check():
        """Endpoint sederhana untuk memeriksa apakah server berjalan."""
        return "OK", 200

    # Pastikan konteks aplikasi dibuat sebelum mengakses db (jika diperlukan di sini)
    # dengan app.app_context():
        # Perintah yang butuh konteks aplikasi
        # db.create_all() # Hati-hati, jangan jalankan create_all() di production secara otomatis

    print(f" * Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI')}") # Info log

    return app
