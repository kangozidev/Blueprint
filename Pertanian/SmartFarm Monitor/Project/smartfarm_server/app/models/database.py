# smartfarm_server/app/models/database.py

from flask_sqlalchemy import SQLAlchemy

# Buat instance SQLAlchemy.
# Instance ini belum terikat ke aplikasi Flask tertentu saat ini.
# Pengikatan (inisialisasi) akan dilakukan di dalam application factory (create_app)
# menggunakan db.init_app(app).
db = SQLAlchemy()

# Anda bisa menambahkan fungsi helper terkait database di sini jika perlu,
# tetapi untuk saat ini cukup instance db saja.
