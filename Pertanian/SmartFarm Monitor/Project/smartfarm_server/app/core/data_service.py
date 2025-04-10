# smartfarm_server/app/core/data_service.py

from app.models.database import db
from app.models.models import Area, Sensor, SensorReading
from sqlalchemy.sql import func
from sqlalchemy import desc, and_ # Import 'and_' untuk kondisi query gabungan
from datetime import datetime, timezone # Pastikan timezone diimpor
from typing import List, Dict, Any, Optional # Untuk type hinting

def save_sensor_reading(sensor_id: str, value: Any, timestamp: datetime) -> SensorReading:
    """
    Menyimpan pembacaan sensor baru ke database setelah validasi.

    Args:
        sensor_id (str): ID unik sensor yang mengirim data.
        value (Any): Nilai yang dibaca oleh sensor (akan dikonversi ke Numeric).
        timestamp (datetime): Waktu pembacaan data (sebaiknya timezone-aware).

    Raises:
        ValueError: Jika sensor_id tidak ditemukan di database.
        TypeError: Jika tipe data value tidak sesuai.
        Exception: Untuk error database lainnya.

    Returns:
        SensorReading: Objek SensorReading yang baru disimpan.
    """
    # 1. Validasi Sensor ID
    sensor = db.session.get(Sensor, sensor_id)
    if not sensor:
        raise ValueError(f"Sensor dengan ID '{sensor_id}' tidak ditemukan.")

    # 2. Validasi & Konversi Value (contoh sederhana)
    try:
        # Model kita menggunakan Numeric(10, 2), coba konversi
        numeric_value = float(value) # Coba konversi ke float dulu
    except (ValueError, TypeError):
        raise TypeError(f"Nilai '{value}' tidak dapat dikonversi menjadi angka.")

    # 3. Pastikan timestamp adalah timezone-aware (idealnya UTC)
    if timestamp.tzinfo is None:
        # Jika tidak ada timezone, anggap UTC (atau timezone default server Anda)
        # Ini asumsi, lebih baik jika data masuk sudah TZ-aware
        print(f"Warning: Timestamp untuk sensor {sensor_id} tidak memiliki timezone, diasumsikan UTC.")
        timestamp = timestamp.replace(tzinfo=timezone.utc)

    # 4. Buat objek SensorReading
    new_reading = SensorReading(
        sensor_id=sensor_id,
        value=numeric_value, # Simpan sebagai Numeric (SQLAlchemy handle konversi)
        timestamp=timestamp
    )

    # 5. Simpan ke Database
    try:
        db.session.add(new_reading)
        db.session.commit()
        print(f"Data disimpan: Sensor {sensor_id}, Value {numeric_value}, Time {timestamp}") # Logging sementara
        return new_reading
    except Exception as e:
        db.session.rollback()
        print(f"Error saat menyimpan reading untuk sensor {sensor_id}: {e}")
        raise Exception("Gagal menyimpan data sensor.")


def get_latest_readings_for_area(area_id: int) -> Dict[str, Dict[str, Any]]:
    """
    Mengambil pembacaan sensor TERAKHIR untuk setiap sensor dalam suatu area.

    Args:
        area_id (int): ID area yang ingin diperiksa statusnya.

    Raises:
        ValueError: Jika area_id tidak ditemukan.
        Exception: Untuk error database lainnya.

    Returns:
        Dict[str, Dict[str, Any]]: Dictionary di mana key adalah sensor_id dan
                                    value adalah dictionary berisi 'value' dan 'timestamp'
                                    pembacaan terakhir. Contoh:
                                    {
                                        'T001': {'value': 25.5, 'timestamp': '2025-04-06T11:50:00Z'},
                                        'H001': {'value': 60.1, 'timestamp': '2025-04-06T11:49:55Z'}
                                    }
                                    Mengembalikan dict kosong jika area tidak punya sensor/reading.
    """
    area = db.session.get(Area, area_id)
    if not area:
        raise ValueError(f"Area dengan ID {area_id} tidak ditemukan.")

    latest_readings_map = {}
    try:
        # Ambil semua sensor yang terkait dengan area ini
        # Kita bisa pakai area.sensors jika relasi didefinisikan dengan benar
        # Tapi query eksplisit kadang lebih jelas
        sensors_in_area = db.session.query(Sensor).filter(Sensor.area_id == area_id).all()

        if not sensors_in_area:
            return {} # Area valid tapi tidak punya sensor

        # Untuk setiap sensor, cari reading terakhirnya
        # PERHATIAN: Ini bisa jadi tidak efisien (N+1 query) jika sensor sangat banyak.
        # Pertimbangkan optimasi dengan window function atau subquery jika perlu.
        for sensor in sensors_in_area:
            latest_reading = db.session.query(SensorReading)\
                .filter(SensorReading.sensor_id == sensor.sensor_id)\
                .order_by(SensorReading.timestamp.desc())\
                .first()

            if latest_reading:
                latest_readings_map[sensor.sensor_id] = {
                    'sensor_type': sensor.sensor_type, # Tambahkan tipe sensor
                    'unit': sensor.unit,             # Tambahkan unit
                    'value': float(latest_reading.value), # Konversi Numeric ke float untuk JSON
                    'timestamp': latest_reading.timestamp.isoformat() # Format ISO string
                }

        return latest_readings_map

    except Exception as e:
        print(f"Error saat mengambil status terakhir area {area_id}: {e}")
        raise Exception("Gagal mengambil status area.")


def get_historical_readings(area_id: int, sensor_type: Optional[str] = None,
                            start_time: Optional[datetime] = None,
                            end_time: Optional[datetime] = None) -> List[Dict[str, Any]]:
    """
    Mengambil riwayat pembacaan sensor untuk suatu area dalam rentang waktu tertentu,
    dengan filter opsional berdasarkan tipe sensor.

    Args:
        area_id (int): ID area yang ingin diperiksa riwayatnya.
        sensor_type (Optional[str], optional): Filter berdasarkan tipe sensor. Defaults to None.
        start_time (Optional[datetime], optional): Waktu mulai (inklusif). Defaults to None (tidak dibatasi awal).
        end_time (Optional[datetime], optional): Waktu akhir (eksklusif). Defaults to None (tidak dibatasi akhir).

    Raises:
        ValueError: Jika area_id tidak ditemukan.
        Exception: Untuk error database lainnya.

    Returns:
        List[Dict[str, Any]]: Daftar pembacaan sensor, di mana setiap item adalah dictionary
                               berisi 'sensor_id', 'sensor_type', 'value', 'unit', 'timestamp'.
                               Daftar diurutkan berdasarkan timestamp ascending.
    """
    area = db.session.get(Area, area_id)
    if not area:
        raise ValueError(f"Area dengan ID {area_id} tidak ditemukan.")

    try:
        query = db.session.query(
                    SensorReading.sensor_id,
                    Sensor.sensor_type, # Ambil tipe dari tabel Sensor
                    Sensor.unit,       # Ambil unit dari tabel Sensor
                    SensorReading.value,
                    SensorReading.timestamp
                )\
                .join(Sensor, SensorReading.sensor_id == Sensor.sensor_id)\
                .filter(Sensor.area_id == area_id) # Filter berdasarkan area_id

        # Tambahkan filter berdasarkan tipe sensor jika ada
        if sensor_type:
            query = query.filter(Sensor.sensor_type == sensor_type)

        # Tambahkan filter berdasarkan rentang waktu
        time_filters = []
        if start_time:
            if start_time.tzinfo is None: # Pastikan TZ-aware
                start_time = start_time.replace(tzinfo=timezone.utc)
            time_filters.append(SensorReading.timestamp >= start_time)
        if end_time:
             if end_time.tzinfo is None: # Pastikan TZ-aware
                end_time = end_time.replace(tzinfo=timezone.utc)
             time_filters.append(SensorReading.timestamp < end_time)

        if time_filters:
            query = query.filter(and_(*time_filters)) # Gunakan and_() untuk menggabungkan filter

        # Urutkan berdasarkan waktu
        query = query.order_by(SensorReading.timestamp.asc())

        # Eksekusi query
        results = query.all()

        # Konversi hasil (list of tuples/Row objects) ke list of dictionaries
        historical_data = [
            {
                'sensor_id': r.sensor_id,
                'sensor_type': r.sensor_type,
                'unit': r.unit,
                'value': float(r.value), # Konversi Numeric ke float
                'timestamp': r.timestamp.isoformat() # Konversi datetime ke string ISO
            } for r in results
        ]

        return historical_data

    except Exception as e:
        print(f"Error saat mengambil riwayat area {area_id}: {e}")
        raise Exception("Gagal mengambil riwayat data sensor.")
