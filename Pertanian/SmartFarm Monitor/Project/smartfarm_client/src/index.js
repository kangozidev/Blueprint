// smartfarm_client/src/index.js

import React from 'react';
// Impor createRoot dari react-dom/client (API modern React 18+)
import { createRoot } from 'react-dom/client';

// Impor file CSS global agar gayanya diterapkan
import './index.css';

// Impor komponen aplikasi utama
import App from './App';

// Impor fungsi pelaporan performa web (opsional, bawaan CRA)
import reportWebVitals from './reportWebVitals';

// Dapatkan elemen DOM container tempat aplikasi akan dirender
const container = document.getElementById('root');

// Buat root React menggunakan API baru (React 18+)
const root = createRoot(container);

// Render komponen App di dalam root
// React.StrictMode adalah pembungkus yang membantu menemukan potensi masalah
// dalam aplikasi selama development (tidak mempengaruhi build produksi).
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Jika Anda ingin mulai mengukur performa di aplikasi Anda, teruskan fungsi
// untuk log hasilnya (contoh: reportWebVitals(console.log))
// atau kirim ke endpoint analytics. Pelajari lebih lanjut: https://bit.ly/CRA-vitals
reportWebVitals();
