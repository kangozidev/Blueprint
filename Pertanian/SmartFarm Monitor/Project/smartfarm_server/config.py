# smartfarm_server/config.py

import os
from dotenv import load_dotenv

# Muat environment variables dari file .env (jika ada)
# Berguna untuk menyimpan kredensial sensitif seperti URI database di luar kode
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    """Konfigurasi dasar aplikasi."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess-this-secret-key' # Ganti dengan kunci yang aman!

    # Konfigurasi Database (PostgreSQL)
    # Ambil dari environment variable DATABASE_URL jika ada, jika tidak gunakan default lokal
    # Format: postgresql://user:password@host:port/database_name
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:your_local_password@localhost:5432/smartfarm_db' # Ganti sesuai setup lokal Anda!

    # Nonaktifkan fitur modifikasi track SQLAlchemy karena tidak dibutuhkan dan memakan memori
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Opsi lain bisa ditambahkan di sini, contoh:
    # MAIL_SERVER = os.environ.get('MAIL_SERVER')
    # MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    # ... dll

class DevelopmentConfig(Config):
    """Konfigurasi untuk lingkungan Development."""
    DEBUG = True
    # Mungkin ada pengaturan spesifik development lainnya

class TestingConfig(Config):
    """Konfigurasi untuk lingkungan Testing."""
    TESTING = True
    # Gunakan database terpisah untuk testing jika perlu
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'postgresql://postgres:your_local_password@localhost:5432/smartfarm_test_db' # Database test
    WTF_CSRF_ENABLED = False # Nonaktifkan CSRF protection di form testing (jika pakai Flask-WTF)


class ProductionConfig(Config):
    """Konfigurasi untuk lingkungan Production."""
    DEBUG = False
    TESTING = False
    # Pastikan SECRET_KEY dan DATABASE_URL diatur melalui environment variables di production!
    # Tambahkan konfigurasi spesifik production lainnya (logging, security headers, dll.)


# Dictionary untuk memetakan nama konfigurasi ke kelasnya
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig # Default jika tidak dispesifikasikan
}

# Fungsi helper untuk mendapatkan kunci rahasia
def get_secret_key():
    config_name = os.getenv('FLASK_CONFIG') or 'default'
    return config_by_name[config_name]().SECRET_KEY
