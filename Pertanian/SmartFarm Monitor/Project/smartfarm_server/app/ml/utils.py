# smartfarm_server/app/ml/utils.py

import os
import numpy as np
# Import library ML utama (misal: TensorFlow/Keras) saat benar-benar dibutuhkan
# import tensorflow as tf
from typing import Dict, List, Any

# Tentukan path ke direktori tempat model disimpan
# Menggunakan path absolut relatif terhadap file ini lebih aman
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_STORE_DIR = os.path.join(BASE_DIR, 'models_store')

# Cache sederhana untuk model yang sudah dimuat (opsional, untuk performa)
loaded_models = {}

def load_model(model_name: str) -> Any:
    """
    Memuat model ML yang sudah dilatih dari direktori models_store.
    Mendukung format .h5 (Keras) atau SavedModel (TensorFlow).
    Menggunakan cache sederhana untuk menghindari load ulang.

    Args:
        model_name (str): Nama file model (misal: 'recommendation_model.h5')
                          atau nama direktori (untuk SavedModel).

    Returns:
        Any: Objek model yang sudah dimuat (tipe tergantung library ML).

    Raises:
        FileNotFoundError: Jika file atau direktori model tidak ditemukan.
        Exception: Untuk error saat proses loading model.
    """
    # Cek cache dulu
    if model_name in loaded_models:
        print(f"Using cached model: {model_name}")
        return loaded_models[model_name]

    model_path = os.path.join(MODEL_STORE_DIR, model_name)
    print(f"Attempting to load model from: {model_path}") # Logging sementara

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file or directory not found: {model_path}")

    try:
        # --- Contoh Placeholder untuk TensorFlow/Keras ---
        # (Ganti dengan implementasi sesuai library ML Anda)
        print("Placeholder: Simulating TensorFlow/Keras model loading...")
        # Cek apakah itu direktori (SavedModel) atau file .h5
        if os.path.isdir(model_path):
            # model = tf.keras.models.load_model(model_path) # Untuk SavedModel
            print(f"Simulating load SavedModel: {model_name}")
            model = f"loaded_{model_name}_savedmodel" # Placeholder object
        elif model_name.endswith('.h5'):
            # model = tf.keras.models.load_model(model_path) # Untuk HDF5
            print(f"Simulating load H5 model: {model_name}")
            model = f"loaded_{model_name}_h5" # Placeholder object
        else:
             raise ValueError(f"Format model tidak dikenali untuk: {model_name}. Harap gunakan direktori SavedModel atau file .h5.")

        print(f"Model '{model_name}' loaded successfully (simulation).")
        loaded_models[model_name] = model # Simpan ke cache
        return model
        # --- Akhir Placeholder ---

    except Exception as e:
        print(f"Error loading model '{model_name}': {e}")
        # Sebaiknya log error detailnya
        raise Exception(f"Gagal memuat model: {model_name}")


def preprocess_input_for_recommendation(latest_readings: Dict[str, Dict[str, Any]]) -> Any:
    """
    Melakukan pra-pemrosesan data sensor terakhir ke dalam format
    yang diharapkan oleh model rekomendasi ML.

    (Implementasi Placeholder)

    Args:
        latest_readings (Dict): Data sensor terakhir dari data_service.

    Returns:
        Any: Data yang sudah diproses (misal: NumPy array, Pandas DataFrame)
             sesuai kebutuhan input model ML.
    """
    print("Preprocessing data for recommendation model (placeholder)...")
    # Contoh: Ubah dict ke array NumPy dengan urutan fitur yang benar
    # Urutan fitur harus konsisten dengan saat model dilatih!
    # feature_order = ['temperature_air', 'humidity_air', 'humidity_soil', ...]
    # input_array = []
    # for feature_name in feature_order:
    #     found = False
    #     for sensor_id, reading in latest_readings.items():
    #         if reading.get('sensor_type') == feature_name:
    #             input_array.append(reading['value'])
    #             found = True
    #             break
    #     if not found:
    #         input_array.append(np.nan) # Atau nilai default/imputasi lain

    # return np.array([input_array]) # Model biasanya expect batch dimension

    # Placeholder sederhana: kembalikan data asli
    processed_data = latest_readings
    print("Preprocessing complete (placeholder).")
    return processed_data


def preprocess_input_for_prediction(historical_data: List[Dict[str, Any]], area_info: Any) -> Any:
    """
    Melakukan pra-pemrosesan data historis dan info area ke dalam format
    yang diharapkan oleh model prediksi hasil panen ML.

    (Implementasi Placeholder)

    Args:
        historical_data (List): Riwayat data sensor dari data_service.
        area_info (Any): Objek Area atau informasi relevan lainnya.

    Returns:
        Any: Data yang sudah diproses sesuai kebutuhan input model ML.
    """
    print("Preprocessing data for prediction model (placeholder)...")
    # Contoh:
    # - Ubah list of dicts ke Pandas DataFrame
    # - Lakukan feature engineering (misal: rolling averages, time-based features)
    # - Gabungkan dengan info area (jenis tanaman, tanggal tanam)
    # - Normalisasi/Scaling fitur
    # - Jika model RNN/LSTM, bentuk data menjadi sequence

    # Placeholder sederhana: kembalikan data asli
    processed_data = {'history': historical_data, 'area': area_info}
    print("Preprocessing complete (placeholder).")
    return processed_data
