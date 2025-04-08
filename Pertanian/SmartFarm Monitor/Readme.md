# Struktur Proyek

smartfarm_server/                  <-- Direktori root proyek server
│
├── app/                           <-- Paket utama aplikasi Flask
│   │
│   ├── __init__.py                # Inisialisasi aplikasi Flask (Application Factory)
│   │
│   ├── api/                       # Modul untuk API endpoints (Blueprints)
│   │   ├── __init__.py
│   │   ├── routes.py              # Definisi semua rute API (misal: /ingest, /areas/...)
│   │   └── schemas.py             # (Opsional) Skema validasi input/output (jika menggunakan Marshmallow/Pydantic)
│   │
│   ├── core/                      # Logika bisnis inti (Services)
│   │   ├── __init__.py
│   │   ├── farm_service.py        # Logika terkait manajemen area, sensor
│   │   ├── data_service.py        # Logika pemrosesan data sensor, penyimpanan
│   │   └── analysis_service.py    # Logika untuk analisis, rekomendasi, prediksi
│   │
│   ├── models/                    # Modul untuk interaksi database (DAL & ORM)
│   │   ├── __init__.py
│   │   ├── database.py            # Setup koneksi database (SQLAlchemy instance)
│   │   └── models.py              # Definisi tabel database (Kelas ORM: Area, Sensor, SensorReading, dll.)
│   │   # Bisa ditambahkan dao.py jika ingin memisahkan query logic
│   │
│   ├── ml/                        # Modul untuk fungsionalitas AI/Machine Learning
│   │   ├── __init__.py
│   │   ├── models_store/          # Direktori penyimpanan file model terlatih (.h5, .pb, dll)
│   │   │   └── .gitkeep           # Agar direktori kosong ter-commit
│   │   ├── prediction.py          # Fungsi terkait prediksi (misal: panen)
│   │   ├── recommendation.py      # Fungsi terkait rekomendasi (perawatan)
│   │   └── utils.py               # Fungsi utilitas ML (load model, preprocess)
│   │
│   └── utils/                     # Utilitas umum (helpers, validators, etc)
│       ├── __init__.py
│       ├── helpers.py
│       └── exceptions.py          # Definisi custom exceptions (jika perlu)
│
├── migrations/                    # (Jika menggunakan Alembic/Flask-Migrate) Direktori untuk skrip migrasi database
│   └── ...
│
├── tests/                         # Direktori untuk unit tests & integration tests
│   ├── __init__.py
│   ├── test_api.py                # Tes untuk endpoints API
│   ├── test_services.py           # Tes untuk business logic
│   └── test_models.py             # Tes untuk interaksi model/database
│   # ... etc
│
├── venv/                          # Direktori virtual environment (biasanya diabaikan oleh Git)
│
├── config.py                      # File konfigurasi (Database URI, Secret Key, dll.)
├── wsgi.py                        # Entry point untuk WSGI server (Gunicorn/uWSGI)
├── run.py                         # Skrip sederhana untuk menjalankan Flask development server
├── requirements.txt               # Daftar dependensi Python (Flask, SQLAlchemy, TensorFlow, Psycopg2, dll.)
├── .env_example                   # Contoh file environment variables (jangan commit .env asli)
├── .gitignore                     # File untuk mengabaikan file/direktori tertentu dari Git (venv, __pycache__, .env)
└── README.md                      # Dokumentasi proyek: deskripsi, cara setup, cara menjalankan


Penjelasan Singkat Komponen:

1. app/: Folder utama berisi kode aplikasi. 
__init__.py: Menggunakan pola Application Factory (create_app) untuk membuat instance Flask. Ini tempat mendaftarkan Blueprints, ekstensi (seperti SQLAlchemy), dan konfigurasi dasar. 
api/: Menggunakan Flask Blueprints untuk mengelompokkan routes (endpoint). routes.py berisi definisi URL dan fungsi handler-nya. schemas.py (opsional) bisa digunakan dengan library seperti Marshmallow untuk validasi data request/response. 
core/: Lapisan service yang berisi logika bisnis utama. Memisahkan logika dari route handlers membuatnya lebih bersih dan mudah diuji. 
models/: Berisi database.py untuk inisialisasi koneksi (misal, db = SQLAlchemy()) dan models.py untuk definisi kelas ORM yang merepresentasikan tabel database. 
ml/: Semua kode terkait AI/ML. models_store/ untuk menyimpan file model fisik. prediction.py dan recommendation.py berisi fungsi untuk memuat model dan melakukan inferensi. 
utils/: Fungsi bantuan yang bisa digunakan di banyak tempat. 
2. migrations/: Jika menggunakan Alembic atau Flask-Migrate untuk mengelola perubahan skema database, direktori ini akan dibuat secara otomatis. 
3. tests/: Sangat penting untuk menyimpan kode pengujian (unit/integrasi). Struktur di dalamnya bisa mencerminkan struktur app/. 
4. venv/: Direktori virtual environment Python untuk isolasi dependensi. 
5. config.py: Menyimpan konfigurasi aplikasi. Bisa memuat variabel dari environment variables (via file .env). 
6. wsgi.py: Digunakan oleh server WSGI seperti Gunicorn untuk menjalankan aplikasi di lingkungan produksi. Biasanya mengimpor application factory dari app. 
7. run.py: Skrip sederhana untuk menjalankan server pengembangan bawaan Flask (flask run). 
8. requirements.txt: File standar untuk mendefinisikan dependensi proyek (pip freeze > requirements.txt). 
9. .env_example: Contoh format file .env yang berisi variabel lingkungan (seperti DATABASE_URL, SECRET_KEY). File .env yang sebenarnya berisi credential sensitif dan tidak boleh dimasukkan ke version control. 
10. .gitignore: Menginstruksikan Git file/folder mana yang harus diabaikan (contoh: venv/, __pycache__/, *.pyc, .env). 
11. README.md: File dokumentasi utama. Harus berisi penjelasan proyek, cara menginstal dependensi (pip install -r requirements.txt), cara menyiapkan database, dan cara menjalankan server (development dan/atau production). 
