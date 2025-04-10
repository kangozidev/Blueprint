# smartfarm_server/app/core/analysis_service.py

from app.models.database import db
from app.models.models import Area, RecommendationLog, PredictionLog # Impor model log jika ingin menyimpan hasil
from . import data_service # Impor service lain untuk mendapatkan data
from . import farm_service
# Impor fungsi ML (nanti jika sudah ada)
# from app.ml import recommendation as ml_recommendation
# from app.ml import prediction as ml_prediction
from typing import Dict, List, Any
from datetime import datetime, date, timedelta

# === Rekomendasi Perawatan ===

def generate_recommendations_for_area(area_id: int) -> List[Dict[str, Any]]:
    """
    Menghasilkan rekomendasi perawatan (misal: penyiraman, pemupukan)
    berdasarkan data sensor terakhir di suatu area.

    (Implementasi Awal: Rule-based sederhana)

    Args:
        area_id (int): ID area yang ingin dianalisis.

    Raises:
        ValueError: Jika area_id tidak ditemukan.
        Exception: Untuk error lainnya saat pemrosesan.

    Returns:
        List[Dict[str, Any]]: Daftar rekomendasi, contoh:
            [
                {'type': 'watering', 'message': 'Kelembapan tanah rendah (35%), siram segera.', 'priority': 'high'},
                {'type': 'fertilizing', 'message': 'Nutrisi NPK di bawah ambang batas.', 'priority': 'medium'}
            ]
            Mengembalikan list kosong jika tidak ada rekomendasi.
    """
    print(f"Generating recommendations for Area ID: {area_id}") # Logging sementara

    # 1. Dapatkan status sensor terakhir
    try:
        latest_status = data_service.get_latest_readings_for_area(area_id)
        # get_latest_readings_for_area sudah raise ValueError jika area tidak ditemukan
    except ValueError as ve:
        raise ve # Re-raise error area tidak ditemukan
    except Exception as e:
        print(f"Error getting latest status for recommendations: {e}")
        raise Exception("Gagal mendapatkan data sensor terbaru untuk rekomendasi.")

    if not latest_status:
        print(f"Tidak ada data sensor untuk area {area_id}, tidak ada rekomendasi.")
        return [] # Tidak bisa membuat rekomendasi tanpa data

    recommendations = []

    # 2. Terapkan Aturan Sederhana (Contoh Placeholder)
    # Aturan ini sangat bergantung pada jenis tanaman, sensor yang tersedia, dll.
    # Anda perlu menyesuaikan ambang batas ini.

    # Cari data kelembapan tanah
    soil_humidity_reading = None
    for sensor_id, reading_data in latest_status.items():
        if reading_data.get('sensor_type') == 'humidity_soil':
            soil_humidity_reading = reading_data
            break # Asumsi hanya ada satu sensor kelembapan tanah per area

    if soil_humidity_reading:
        current_humidity = soil_humidity_reading['value']
        humidity_threshold_low = 40.0 # Contoh ambang batas (%)
        humidity_threshold_high = 85.0 # Contoh ambang batas (%)

        if current_humidity < humidity_threshold_low:
            recommendations.append({
                'type': 'watering',
                'message': f"Kelembapan tanah rendah ({current_humidity}%), pertimbangkan penyiraman.",
                'priority': 'high',
                'timestamp': soil_humidity_reading['timestamp'] # Waktu data yg jadi acuan
            })
        elif current_humidity > humidity_threshold_high:
             recommendations.append({
                'type': 'drainage_check', # Rekomendasi lain
                'message': f"Kelembapan tanah sangat tinggi ({current_humidity}%), periksa drainase.",
                'priority': 'medium',
                'timestamp': soil_humidity_reading['timestamp']
            })


    # Cari data suhu udara (contoh lain)
    air_temp_reading = None
    for sensor_id, reading_data in latest_status.items():
         if reading_data.get('sensor_type') == 'temperature_air':
             air_temp_reading = reading_data
             break

    if air_temp_reading:
        current_temp = air_temp_reading['value']
        temp_threshold_high = 35.0 # Contoh Celcius
        temp_threshold_low = 10.0  # Contoh Celcius

        if current_temp > temp_threshold_high:
             recommendations.append({
                'type': 'cooling_shading',
                'message': f"Suhu udara tinggi ({current_temp}°C), pertimbangkan peneduh/pendinginan.",
                'priority': 'medium',
                'timestamp': air_temp_reading['timestamp']
            })
        elif current_temp < temp_threshold_low:
             recommendations.append({
                'type': 'heating_protection',
                'message': f"Suhu udara rendah ({current_temp}°C), pertimbangkan perlindungan/pemanasan.",
                'priority': 'high',
                'timestamp': air_temp_reading['timestamp']
            })


    # --- Placeholder untuk Integrasi ML ---
    # try:
    #     ml_recs = ml_recommendation.get_ml_recommendation(latest_status)
    #     recommendations.extend(ml_recs) # Gabungkan hasil ML
    # except Exception as e:
    #     print(f"Error getting ML recommendations: {e}")
    # --- Akhir Placeholder ML ---

    # 3. (Opsional) Simpan rekomendasi ke log
    # if recommendations:
    #     try:
    #         for rec in recommendations:
    #             log_entry = RecommendationLog(
    #                 area_id=area_id,
    #                 recommendation_type=rec['type'],
    #                 details=rec['message'],
    #                 # Tambahkan field lain jika perlu
    #             )
    #             db.session.add(log_entry)
    #         db.session.commit()
    #     except Exception as e:
    #         db.session.rollback()
    #         print(f"Error saving recommendation log for area {area_id}: {e}")
            # Jangan gagalkan proses hanya karena gagal logging (mungkin)

    print(f"Generated {len(recommendations)} recommendations for Area ID: {area_id}")
    return recommendations


# === Prediksi Hasil Panen ===

def generate_predictions_for_area(area_id: int) -> Dict[str, Any]:
    """
    Menghasilkan prediksi hasil panen untuk suatu area.

    (Implementasi Awal: Placeholder/Dummy)

    Args:
        area_id (int): ID area yang ingin diprediksi.

    Raises:
        ValueError: Jika area_id tidak ditemukan.
        Exception: Untuk error lainnya saat pemrosesan.

    Returns:
        Dict[str, Any]: Dictionary berisi detail prediksi, contoh:
            {
                'predicted_yield': 120.5,
                'yield_unit': 'kg',
                'predicted_harvest_date': '2025-08-20',
                'confidence': 'medium',
                'generated_at': '2025-04-06T12:00:00Z'
            }
    """
    print(f"Generating predictions for Area ID: {area_id}") # Logging sementara

    # 1. Validasi Area
    area = farm_service.get_area_by_id(area_id)
    if not area:
        raise ValueError(f"Area dengan ID {area_id} tidak ditemukan.")

    # 2. Dapatkan data yang relevan (jika diperlukan oleh model/logika)
    # Contoh: data historis, tanggal tanam, jenis tanaman
    # historical_data = data_service.get_historical_readings(area_id, ...)
    # planting_date = area.created_at # Atau field spesifik 'planting_date' jika ada
    # plant_type = area.plant_type

    # 3. Logika Prediksi (Placeholder/Dummy)
    # Gantikan ini dengan logika nyata atau pemanggilan model ML
    predicted_yield = 100 + (area_id * 5) # Contoh dummy yield
    yield_unit = 'kg'
    # Contoh dummy tanggal panen (misal 4 bulan dari sekarang)
    predicted_harvest_date = (datetime.now(timezone.utc) + timedelta(days=120)).date()
    confidence = 'low' # Karena ini dummy
    generated_at = datetime.now(timezone.utc)

    prediction_result = {
        'predicted_yield': predicted_yield,
        'yield_unit': yield_unit,
        'predicted_harvest_date': predicted_harvest_date.isoformat(),
        'confidence': confidence,
        'generated_at': generated_at.isoformat()
    }

    # --- Placeholder untuk Integrasi ML ---
    # try:
    #     # Siapkan input untuk model ML
    #     model_input = prepare_data_for_prediction(historical_data, area)
    #     ml_pred = ml_prediction.predict_yield(model_input)
    #     prediction_result.update(ml_pred) # Update dict dengan hasil ML
    # except Exception as e:
    #     print(f"Error getting ML predictions: {e}")
    # --- Akhir Placeholder ML ---


    # 4. (Opsional) Simpan prediksi ke log
    # try:
    #     log_entry = PredictionLog(
    #         area_id=area_id,
    #         predicted_yield=prediction_result['predicted_yield'],
    #         yield_unit=prediction_result['yield_unit'],
    #         predicted_harvest_date=date.fromisoformat(prediction_result['predicted_harvest_date']),
    #         # Tambahkan field lain jika perlu (misal confidence)
    #         generated_at=generated_at
    #     )
    #     db.session.add(log_entry)
    #     db.session.commit()
    # except Exception as e:
    #     db.session.rollback()
    #     print(f"Error saving prediction log for area {area_id}: {e}")

    print(f"Generated prediction for Area ID: {area_id}")
    return prediction_result
