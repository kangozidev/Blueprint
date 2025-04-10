# smartfarm_server/wsgi.py

import os
from app import create_app

# Ambil nama konfigurasi dari environment variable 'FLASK_CONFIG'
# Di lingkungan produksi, Anda HARUS mengatur FLASK_CONFIG=production
config_name = os.getenv('FLASK_CONFIG') or 'production' # Default ke production untuk WSGI

# Buat instance aplikasi menggunakan factory
# Server WSGI seperti Gunicorn secara default mencari variabel bernama 'application'
application = create_app(config_name)

# Blok if __name__ == '__main__' biasanya tidak diperlukan di sini,
# karena file ini dimaksudkan untuk diimpor oleh server WSGI, bukan dijalankan langsung.
# Namun, jika Anda ingin bisa menjalankannya langsung untuk tujuan tertentu (jarang),
# Anda bisa menambahkannya:
# if __name__ == "__main__":
#     # Opsi: jalankan server development jika file ini dijalankan langsung
#     # (Sebaiknya gunakan run.py untuk development)
#     print("Running development server via wsgi.py (use run.py instead for typical development)")
#     application.run(host='0.0.0.0', port=5000, debug=(config_name == 'development'))
