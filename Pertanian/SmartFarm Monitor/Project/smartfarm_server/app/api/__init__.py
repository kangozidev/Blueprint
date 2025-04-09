
# smartfarm_server/app/api/__init__.py

from flask import Blueprint

# Membuat instance Blueprint.
# Argumen pertama 'api' adalah nama Blueprint ini.
# Argumen kedua __name__ membantu Flask menemukan lokasi Blueprint.
# url_prefix akan diatur saat Blueprint didaftarkan di create_app (app/__init__.py)
api_bp = Blueprint('api', __name__)

# Impor modul yang berisi definisi rute-rute di dalam Blueprint ini.
# Penting untuk mengimpor SETELAH instance Blueprint dibuat untuk menghindari circular import.
from . import routes # noqa: F401 E402

# Anda bisa menambahkan error handlers spesifik untuk Blueprint ini di sini jika perlu
# @api_bp.app_errorhandler(404)
# def handle_404_error(error):
#     return jsonify(message="Resource not found"), 404
