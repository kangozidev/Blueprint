# smartfarm_server/run.py

import os
from app import create_app # Impor application factory dari paket 'app'
from config import config_by_name # Impor dictionary konfigurasi

# Tentukan nama konfigurasi yang akan digunakan
# Coba ambil dari environment variable 'FLASK_CONFIG', jika tidak ada gunakan 'default' (yaitu 'development')
config_name = os.getenv('FLASK_CONFIG') or 'default'

# Buat instance aplikasi Flask menggunakan factory dan konfigurasi yang dipilih
app = create_app(config_name)

if __name__ == '__main__':
    # Dapatkan objek konfigurasi aktual untuk memeriksa mode DEBUG
    config_object = config_by_name[config_name]

    # Jalankan server development Flask
    # host='0.0.0.0' membuat server bisa diakses dari luar container/mesin lokal (hati-hati di jaringan terbuka)
    # Gunakan debug=True hanya untuk development
    app.run(host='0.0.0.0', port=5000, debug=config_object.DEBUG)
