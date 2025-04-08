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
