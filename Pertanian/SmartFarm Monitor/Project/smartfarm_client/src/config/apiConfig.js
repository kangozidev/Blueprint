// smartfarm_client/src/config/apiConfig.js

/**
 * URL dasar untuk API server SmartFarm Monitor.
 * Mengambil nilai dari environment variable REACT_APP_API_BASE_URL jika ada,
 * jika tidak, gunakan nilai default untuk development lokal.
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Anda bisa menambahkan konfigurasi lain di sini jika perlu
// const OTHER_CONFIG = process.env.REACT_APP_OTHER_CONFIG || 'default_value';

// Ekspor konfigurasi agar bisa diimpor di tempat lain (misal: apiService.js)
export { API_BASE_URL };

// Jika ada banyak konfigurasi, Anda bisa ekspor sebagai objek:
// export const config = {
//   API_BASE_URL: API_BASE_URL,
//   OTHER_CONFIG: OTHER_CONFIG
// };
