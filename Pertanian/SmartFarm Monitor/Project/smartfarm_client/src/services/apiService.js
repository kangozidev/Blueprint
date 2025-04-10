// smartfarm_client/src/services/apiService.js

import { API_BASE_URL } from '../config/apiConfig';

/**
 * Fungsi helper untuk menangani respons fetch API.
 * Memeriksa status OK dan parse JSON. Melempar error jika gagal.
 * @param {Response} response - Objek Response dari fetch
 * @returns {Promise<any>} - Promise yang resolve dengan data JSON
 * @throws {Error} - Jika respons tidak OK (status bukan 2xx)
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Coba parse error message dari body jika ada
    let errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      // Asumsi server mengirim error dalam format { message: "..." } atau { description: "..." }
      errorMessage = errorData.description || errorData.message || errorMessage;
    } catch (e) {
      // Biarkan error message default jika body bukan JSON atau kosong
    }
    // console.error('API Error:', errorMessage); // Log error
    throw new Error(errorMessage); // Lempar error agar bisa ditangkap oleh pemanggil
  }
  // Jika status 204 No Content, tidak ada body untuk di-parse
  if (response.status === 204) {
    return null;
  }
  // Jika OK dan bukan 204, parse body sebagai JSON
  return response.json();
};

// --- Fungsi untuk Endpoint Area ---

/** Mengambil daftar semua area */
export const fetchAreas = async () => {
  const response = await fetch(`${API_BASE_URL}/areas`);
  return handleResponse(response);
};

/** Membuat area baru */
export const createArea = async (areaData) => {
  // areaData = { name: 'Area Baru', plant_type: 'Tomat', location_description: 'Sebelah gudang' }
  const response = await fetch(`${API_BASE_URL}/areas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(areaData),
  });
  // Server mengembalikan 201 Created dengan data area baru
  return handleResponse(response);
};

// (Fungsi fetchAreaDetail(areaId) mungkin tidak perlu jika kita fetch per bagian)

// --- Fungsi untuk Endpoint Data & Analisis per Area ---

/** Mengambil status sensor terakhir untuk suatu area */
export const fetchAreaStatus = async (areaId) => {
  if (!areaId) throw new Error('Area ID diperlukan');
  const response = await fetch(`${API_BASE_URL}/areas/${areaId}/status`);
  return handleResponse(response);
};

/**
 * Mengambil riwayat data sensor untuk suatu area.
 * @param {number|string} areaId ID area
 * @param {object} params Parameter query opsional (sensor_type, start, end)
 * Contoh: { sensor_type: 'temperature', start: '2025-04-05T00:00:00Z' }
 */
export const fetchAreaHistory = async (areaId, params = {}) => {
  if (!areaId) throw new Error('Area ID diperlukan');
  // Bangun query string dari objek params
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/areas/${areaId}/history${queryParams ? `?${queryParams}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

/** Mengambil rekomendasi perawatan untuk suatu area */
export const fetchRecommendations = async (areaId) => {
  if (!areaId) throw new Error('Area ID diperlukan');
  const response = await fetch(`${API_BASE_URL}/areas/${areaId}/recommendations`);
  return handleResponse(response);
};

/** Mengambil prediksi panen untuk suatu area */
export const fetchPredictions = async (areaId) => {
  if (!areaId) throw new Error('Area ID diperlukan');
  const response = await fetch(`${API_BASE_URL}/areas/${areaId}/predictions`);
  return handleResponse(response);
};

// --- Fungsi untuk Endpoint Ingest (jika diperlukan klien) ---

/** Mengirim data sensor baru */
export const ingestData = async (sensorData) => {
  // sensorData = { sensor_id: 'T001', value: 28.5, timestamp: '2025-04-06T12:19:00Z' }
  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sensorData),
  });
  // Server mengembalikan 201 Created dengan { message, reading_id }
  return handleResponse(response);
};

// Jika menggunakan axios, kodenya akan sedikit berbeda:
// import axios from 'axios';
// export const fetchAreas = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/areas`);
//     return response.data; // Axios otomatis parse JSON dan melempar error untuk status >= 400
//   } catch (error) {
//     console.error("Error fetching areas:", error.response?.data || error.message);
//     throw error; // Re-throw agar komponen bisa menangani
//   }
// };
// smartfarm_client/src/services/apiService.js
// ... (fungsi fetchAreas, createArea, handleResponse, dll sudah ada) ...

/** Mengambil detail satu area berdasarkan ID */
export const fetchAreaById = async (areaId) => {
  if (!areaId) throw new Error('Area ID diperlukan');
  // Pastikan endpoint ini ada di server Anda (GET /api/v1/areas/{area_id})
  const response = await fetch(`${API_BASE_URL}/areas/${areaId}`);
  return handleResponse(response);
};

// ... (fungsi fetchAreaStatus, fetchAreaHistory, dll sudah ada) ...
