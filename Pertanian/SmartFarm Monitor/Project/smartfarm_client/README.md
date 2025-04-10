
# SmartFarm Monitor Client (React)

Aplikasi antarmuka pengguna (UI) berbasis web untuk sistem SmartFarm Monitor. Dibangun menggunakan React, aplikasi ini berinteraksi dengan [SmartFarm Monitor Server](link_ke_repo_server_jika_ada) untuk menampilkan data pertanian dan memberikan kontrol kepada pengguna.

## Fitur Utama

* **Dashboard:** Menampilkan ringkasan semua area pertanian yang terdaftar.
* **Halaman Detail Area:** Menampilkan informasi lengkap untuk satu area, termasuk:
    * Status sensor terkini.
    * Grafik data sensor historis dengan opsi pemilihan sensor dan waktu.
    * Rekomendasi perawatan tanaman.
    * Prediksi hasil panen.
* **Manajemen Area:** Form untuk menambahkan area pertanian baru.
* **Navigasi:** Routing sisi klien untuk pengalaman pengguna yang mulus.

## Teknologi Stack

* **Library/Framework:** React.js (v18+)
* **Routing:** React Router DOM (v6+)
* **Manajemen State:** React Hooks (useState, useEffect, useContext - jika digunakan)
* **HTTP Client:** Fetch API (bawaan) / Axios (opsional)
* **Visualisasi Data:** Chart.js dengan `react-chartjs-2`
* **Styling:** CSS Modules / CSS Global
* **Build Tool:** React Scripts (Create React App) / Vite (sesuaikan jika menggunakan Vite)

## Struktur Proyek

Sip, ini adalah file terakhir untuk kerangka proyek klien kita: README.md.

File 19: smartfarm_client/README.md

File Markdown ini memberikan panduan untuk developer lain (atau Anda di masa depan) tentang cara menyiapkan dan menjalankan proyek aplikasi klien React SmartFarm Monitor.

Markdown

# SmartFarm Monitor Client (React)

Aplikasi antarmuka pengguna (UI) berbasis web untuk sistem SmartFarm Monitor. Dibangun menggunakan React, aplikasi ini berinteraksi dengan [SmartFarm Monitor Server](link_ke_repo_server_jika_ada) untuk menampilkan data pertanian dan memberikan kontrol kepada pengguna.

## Fitur Utama

* **Dashboard:** Menampilkan ringkasan semua area pertanian yang terdaftar.
* **Halaman Detail Area:** Menampilkan informasi lengkap untuk satu area, termasuk:
    * Status sensor terkini.
    * Grafik data sensor historis dengan opsi pemilihan sensor dan waktu.
    * Rekomendasi perawatan tanaman.
    * Prediksi hasil panen.
* **Manajemen Area:** Form untuk menambahkan area pertanian baru.
* **Navigasi:** Routing sisi klien untuk pengalaman pengguna yang mulus.

## Teknologi Stack

* **Library/Framework:** React.js (v18+)
* **Routing:** React Router DOM (v6+)
* **Manajemen State:** React Hooks (useState, useEffect, useContext - jika digunakan)
* **HTTP Client:** Fetch API (bawaan) / Axios (opsional)
* **Visualisasi Data:** Chart.js dengan `react-chartjs-2`
* **Styling:** CSS Modules / CSS Global
* **Build Tool:** React Scripts (Create React App) / Vite (sesuaikan jika menggunakan Vite)

## Struktur Proyek

smartfarm_client/
├── public/            # Aset statis & index.html
├── src/               # Source code aplikasi React
│   ├── assets/        # Gambar, font, dll.
│   ├── components/    # Komponen UI reusable (Kartu, Tombol, Chart, ...)
│   ├── pages/         # Komponen Halaman/View (Dashboard, Detail, ...)
│   ├── services/      # Logika interaksi API backend
│   ├── contexts/      # State management (React Context)
│   ├── hooks/         # Custom React Hooks
│   ├── routes/        # Konfigurasi routing (jika dipisah)
│   └── config/        # Konfigurasi klien (misal: URL API)
├── .env.example       # Contoh environment variables
├── .gitignore         # File/folder yg diabaikan Git
├── package.json       # Metadata & dependensi proyek
└── README.md          # Dokumentasi ini


## Instruksi Setup

**Prasyarat:**

* Node.js (versi LTS direkomendasikan, misal v18 atau lebih baru).
* npm (biasanya terinstal bersama Node.js) atau yarn.
* Server backend SmartFarm Monitor harus sudah berjalan dan dapat diakses.

**Langkah-langkah:**

1.  **Clone Repository:**
    ```bash
    git clone <url_repository_anda>
    cd smartfarm_client
    ```

2.  **Install Dependensi:**
    ```bash
    npm install
    # atau jika menggunakan yarn:
    # yarn install
    ```

3.  **Konfigurasi Environment Variable:**
    * Salin file `.env.example` menjadi `.env` atau `.env.local` (lebih direkomendasikan jika menggunakan CRA/Vite):
        ```bash
        cp .env.example .env.local
        ```
    * **Edit file `.env.local`**: Atur nilai `REACT_APP_API_BASE_URL` agar menunjuk ke alamat dan port tempat **server backend** Anda berjalan. Contoh jika server berjalan di `localhost:5000` dengan prefix API `/api/v1`:
        ```dotenv
        REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
        ```

## Menjalankan Aplikasi

**PENTING:** Pastikan server backend SmartFarm Monitor **sudah berjalan** sebelum menjalankan klien!

**1. Server Development:**

* Jalankan perintah:
    ```bash
    npm start
    # atau jika menggunakan yarn:
    # yarn start
    ```
* Perintah ini akan membuka aplikasi di browser Anda secara otomatis (biasanya di `http://localhost:3000`). Server development mendukung *hot-reloading*, perubahan kode akan langsung terlihat di browser.

**2. Membuat Build Produksi:**

* Jalankan perintah:
    ```bash
    npm run build
    # atau jika menggunakan yarn:
    # yarn build
    ```
* Perintah ini akan membuat versi teroptimasi dari aplikasi Anda di dalam direktori `build/` (atau `dist/`). File-file statis di dalam direktori ini siap untuk di-deploy ke web server (seperti Nginx, Apache, Netlify, Vercel, dll.).

## Koneksi ke Server & CORS

* Aplikasi klien ini perlu berkomunikasi dengan server backend pada URL yang ditentukan di `REACT_APP_API_BASE_URL`.
* Saat menjalankan secara lokal (development), klien (misal: `localhost:3000`) dan server (misal: `localhost:5000`) berjalan di *origin* yang berbeda. Browser menerapkan kebijakan *Same-Origin Policy* yang akan memblokir request API kecuali server backend secara eksplisit mengizinkannya melalui header CORS (*Cross-Origin Resource Sharing*).
* Pastikan server backend Flask Anda sudah dikonfigurasi untuk mengizinkan request dari origin klien Anda (misal: `http://localhost:3000`). Ini biasanya dilakukan menggunakan ekstensi **Flask-CORS**.

## Menjalankan Tests (TODO)

*(Instruksi untuk menjalankan tes akan ditambahkan di sini setelah tes dibuat.)*
```bash
npm test
# atau
# yarn test
