# smartfarm_server/app/models/models.py

from .database import db
from sqlalchemy import Integer, String, Float, DateTime, ForeignKey, Text, Numeric, Date, Index
from sqlalchemy.sql import func # Untuk fungsi SQL seperti NOW()
from sqlalchemy.orm import relationship
import datetime

class Area(db.Model):
    """Model untuk tabel 'areas'."""
    __tablename__ = 'areas'

    area_id = db.Column(Integer, primary_key=True) # Auto-increment default
    name = db.Column(String(100), nullable=False, unique=True)
    plant_type = db.Column(String(50), nullable=True)
    location_description = db.Column(Text, nullable=True)
    created_at = db.Column(DateTime(timezone=True), server_default=func.now())

    # Relationship: Satu Area bisa memiliki banyak Sensor
    sensors = relationship('Sensor', back_populates='area', cascade="all, delete-orphan")
    # Relationship: Satu Area bisa memiliki banyak Log Rekomendasi
    recommendation_logs = relationship('RecommendationLog', back_populates='area', lazy='dynamic')
     # Relationship: Satu Area bisa memiliki banyak Log Prediksi
    prediction_logs = relationship('PredictionLog', back_populates='area', lazy='dynamic')

    def __repr__(self):
        return f'<Area {self.area_id}: {self.name}>'

class Sensor(db.Model):
    """Model untuk tabel 'sensors'."""
    __tablename__ = 'sensors'

    sensor_id = db.Column(String(50), primary_key=True) # ID unik dari perangkat fisik
    area_id = db.Column(Integer, ForeignKey('areas.area_id', ondelete='CASCADE'), nullable=False, index=True)
    sensor_type = db.Column(String(50), nullable=False, index=True) # Misal: 'temperature', 'humidity_soil'
    unit = db.Column(String(20), nullable=True) # Misal: '°C', '%'
    installed_at = db.Column(DateTime(timezone=True), server_default=func.now())
    last_updated = db.Column(DateTime(timezone=True), onupdate=func.now()) # Catat waktu update terakhir

    # Relationship: Sensor ini milik satu Area
    area = relationship('Area', back_populates='sensors')
    # Relationship: Satu Sensor bisa menghasilkan banyak Reading
    readings = relationship('SensorReading', back_populates='sensor', cascade="all, delete-orphan", lazy='dynamic')

    def __repr__(self):
        return f'<Sensor {self.sensor_id} ({self.sensor_type}) in Area {self.area_id}>'

class SensorReading(db.Model):
    """Model untuk tabel 'sensor_readings' (Time-series data)."""
    __tablename__ = 'sensor_readings'

    reading_id = db.Column(Integer, primary_key=True) # Auto-increment
    sensor_id = db.Column(String(50), ForeignKey('sensors.sensor_id', ondelete='CASCADE'), nullable=False, index=True)
    # Menggunakan Numeric untuk presisi yang lebih baik daripada Float
    value = db.Column(Numeric(10, 2), nullable=False)
    timestamp = db.Column(DateTime(timezone=True), nullable=False, index=True, server_default=func.now())

    # Relationship: Reading ini berasal dari satu Sensor
    sensor = relationship('Sensor', back_populates='readings')

    # Membuat composite index untuk query yang sering melibatkan sensor_id dan timestamp
    __table_args__ = (
        Index('ix_sensor_readings_sensor_id_timestamp', "sensor_id", "timestamp"),
    )

    def __repr__(self):
        return f'<Reading {self.reading_id} from {self.sensor_id} at {self.timestamp}: {self.value}>'


# --- Model Opsional untuk Logging ---

class RecommendationLog(db.Model):
    """Model untuk tabel 'recommendations_log'."""
    __tablename__ = 'recommendations_log'

    log_id = db.Column(Integer, primary_key=True)
    area_id = db.Column(Integer, ForeignKey('areas.area_id'), nullable=False, index=True)
    recommendation_type = db.Column(String(50), nullable=False) # Misal: 'watering', 'fertilizing', 'pest_control'
    details = db.Column(Text, nullable=True) # Deskripsi/parameter rekomendasi
    generated_at = db.Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationship: Log ini milik satu Area
    area = relationship('Area', back_populates='recommendation_logs')

    def __repr__(self):
        return f'<RecommendationLog {self.log_id} for Area {self.area_id} at {self.generated_at}>'

class PredictionLog(db.Model):
    """Model untuk tabel 'predictions_log'."""
    __tablename__ = 'predictions_log'

    log_id = db.Column(Integer, primary_key=True)
    area_id = db.Column(Integer, ForeignKey('areas.area_id'), nullable=False, index=True)
    predicted_yield = db.Column(Numeric(10, 2), nullable=True) # Hasil panen dalam satuan tertentu
    yield_unit = db.Column(String(20), nullable=True) # Misal: 'kg', 'ton'
    predicted_harvest_date = db.Column(Date, nullable=True)
    generated_at = db.Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationship: Log ini milik satu Area
    area = relationship('Area', back_populates='prediction_logs')

    def __repr__(self):
        return f'<PredictionLog {self.log_id} for Area {self.area_id} at {self.generated_at}>'
