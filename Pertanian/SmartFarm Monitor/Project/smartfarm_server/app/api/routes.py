# smartfarm_server/app/api/routes.py

from flask import request, jsonify, abort
from . import api_bp # Impor Blueprint dari __init__.py di direktori yang sama
from app.models.database import db
from app.models.models import Area, Sensor, SensorReading # Impor model database
from app.core import data_service, analysis_service, farm_service # Impor modul service (akan dibuat nanti)
from datetime import datetime

# === Endpoint untuk Area Pertanian ===

@api_bp.route('/areas', methods=['POST'])
def create_area():
    """Endpoint untuk membuat Area baru."""
    data = request.get_json()
    if not data or not 'name' in data:
        abort(400, description="Payload JSON tidak valid atau 'name' tidak ditemukan.") # Bad Request

    # Panggil service untuk membuat area (lebih baik daripada logic langsung di sini)
    try:
        new_area = farm_service.create_new_area(
            name=data['name'],
            plant_type=data.get('plant_type'), # .get() aman jika key tidak ada
            location_description=data.get('location_description')
        )
        return jsonify(new_area.to_dict()), 201 # 201 Created
    except Exception as e:
        # Log error e
        abort(500, description="Gagal membuat area.") # Internal Server Error

@api_bp.route('/areas', methods=['GET'])
def get_areas():
    """Endpoint untuk mendapatkan daftar semua Area."""
    try:
        areas = farm_service.get_all_areas()
        return jsonify([area.to_dict() for area in areas]), 200
    except Exception as e:
        # Log error e
        abort(500, description="Gagal mengambil daftar area.")

@api_bp.route('/areas/<int:area_id>', methods=['GET'])
def get_area_detail(area_id):
    """Endpoint untuk mendapatkan detail satu Area."""
    try:
        area = farm_service.get_area_by_id(area_id)
        if area:
            return jsonify(area.to_dict()), 200
        else:
            abort(404, description=f"Area dengan ID {area_id} tidak ditemukan.") # Not Found
    except Exception as e:
        # Log error e
        abort(500, description="Gagal mengambil detail area.")


# === Endpoint untuk Data Sensor ===

@api_bp.route('/ingest', methods=['POST'])
def ingest_data():
    """Endpoint untuk menerima data dari sensor."""
    data = request.get_json()
    if not data or not all(k in data for k in ('sensor_id', 'value')):
        abort(400, description="Payload JSON tidak valid. Membutuhkan 'sensor_id' dan 'value'.")

    sensor_id = data['sensor_id']
    value = data['value']
    # Timestamp bisa dari payload atau server time
    timestamp_str = data.get('timestamp') # ISO 8601 format string (e.g., "2025-04-06T11:50:00Z")
    timestamp = None
    if timestamp_str:
        try:
            # Coba parse timestamp dari string (pastikan formatnya konsisten)
            # Untuk Z (Zulu/UTC), Python < 3.11 perlu replace manual
            if timestamp_str.endswith('Z'):
                timestamp_str = timestamp_str[:-1] + '+00:00'
            timestamp = datetime.fromisoformat(timestamp_str)
        except ValueError:
            abort(400, description="Format timestamp tidak valid. Gunakan format ISO 8601 (YYYY-MM-DDTHH:MM:SSZ atau YYYY-MM-DDTHH:MM:SS+HH:MM).")
    else:
        # Jika tidak ada timestamp dari sensor, gunakan waktu server (UTC)
        timestamp = datetime.now(datetime.timezone.utc)

    # Panggil service untuk menyimpan data
    try:
        reading = data_service.save_sensor_reading(sensor_id, value, timestamp)
        # Respon bisa sederhana atau mengembalikan data yang disimpan
        return jsonify({"message": "Data received successfully", "reading_id": reading.reading_id}), 201
    except ValueError as ve: # Tangkap error spesifik dari service (misal sensor_id tidak ditemukan)
        abort(404, description=str(ve))
    except Exception as e:
        # Log error e
        print(f"Error ingesting data: {e}") # Sementara print, idealnya pakai logging
        abort(500, description="Gagal menyimpan data sensor.")


@api_bp.route('/areas/<int:area_id>/status', methods=['GET'])
def get_area_status(area_id):
    """Endpoint untuk mendapatkan status sensor terakhir dari suatu Area."""
    try:
        latest_readings = data_service.get_latest_readings_for_area(area_id)
        if not latest_readings: # Cek jika area valid tapi tidak ada data
             area = farm_service.get_area_by_id(area_id)
             if not area:
                 abort(404, description=f"Area dengan ID {area_id} tidak ditemukan.")
             # Jika area ada tapi belum ada data, kembalikan array kosong atau pesan
             return jsonify({"message": "Belum ada data sensor untuk area ini.", "readings": []}), 200

        return jsonify(latest_readings), 200 # Format return dari service sebaiknya sudah dict/JSON-serializable
    except Exception as e:
        # Log error e
        abort(500, description="Gagal mengambil status area.")

@api_bp.route('/areas/<int:area_id>/history', methods=['GET'])
def get_area_history(area_id):
    """Endpoint untuk mendapatkan riwayat data sensor dari suatu Area."""
    # Ambil parameter query ?sensor_type=... &start=... &end=...
    sensor_type = request.args.get('sensor_type')
    start_time_str = request.args.get('start')
    end_time_str = request.args.get('end') # Biasanya end eksklusif

    # TODO: Validasi dan parse start_time dan end_time (string ISO 8601 ke datetime)
    # Contoh sederhana (perlu penanganan error format yang lebih baik)
    try:
        start_time = datetime.fromisoformat(start_time_str) if start_time_str else None
        end_time = datetime.fromisoformat(end_time_str) if end_time_str else None
    except ValueError:
         abort(400, description="Format start/end time tidak valid. Gunakan ISO 8601.")

    try:
        # Panggil service untuk mengambil data historis
        historical_data = data_service.get_historical_readings(area_id, sensor_type, start_time, end_time)
        # Pastikan service mengembalikan format yang sesuai (misalnya list of dicts)
        return jsonify(historical_data), 200
    except ValueError as ve: # Area tidak ditemukan?
        abort(404, description=str(ve))
    except Exception as e:
        # Log error e
        abort(500, description="Gagal mengambil riwayat data.")


# === Endpoint untuk Analisis & Rekomendasi ===

@api_bp.route('/areas/<int:area_id>/recommendations', methods=['GET'])
def get_recommendations(area_id):
    """Endpoint untuk mendapatkan rekomendasi perawatan."""
    try:
        # Panggil service analisis
        recommendations = analysis_service.generate_recommendations_for_area(area_id)
        return jsonify(recommendations), 200
    except ValueError as ve: # Area tidak ditemukan?
        abort(404, description=str(ve))
    except Exception as e:
        # Log error e
        abort(500, description="Gagal menghasilkan rekomendasi.")


@api_bp.route('/areas/<int:area_id>/predictions', methods=['GET'])
def get_predictions(area_id):
    """Endpoint untuk mendapatkan prediksi hasil panen."""
    try:
        # Panggil service analisis
        predictions = analysis_service.generate_predictions_for_area(area_id)
        return jsonify(predictions), 200
    except ValueError as ve: # Area tidak ditemukan?
        abort(404, description=str(ve))
    except Exception as e:
        # Log error e
        abort(500, description="Gagal menghasilkan prediksi.")

# Helper untuk mengubah objek model ke dictionary (bisa dipindah ke model atau utility)
# Atau gunakan library seperti Flask-Marshmallow
def model_to_dict(model_instance):
    """Helper sederhana untuk konversi model SQLAlchemy ke dict."""
    if model_instance is None:
        return None
    data = {}
    for column in model_instance.__table__.columns:
        value = getattr(model_instance, column.name)
        if isinstance(value, (datetime, datetime.date)):
            data[column.name] = value.isoformat() # Konversi datetime ke string ISO
        else:
            data[column.name] = value
    return data

# Tambahkan method to_dict ke model agar lebih rapi
Area.to_dict = model_to_dict
Sensor.to_dict = model_to_dict
SensorReading.to_dict = model_to_dict
# ...tambahkan ke model lain jika perlu
