
# SmartFarm Monitor Server

Aplikasi server backend untuk SmartFarm Monitor, sebuah sistem pemantauan pertanian cerdas berbasis AI dan IoT. Server ini bertanggung jawab untuk menerima data sensor, menyimpannya, menganalisisnya, dan menyediakan API untuk aplikasi klien (web/mobile).

## Fitur Utama (Termasuk yang Direncanakan)

* **Manajemen Area Tanam:** Membuat, melihat daftar, dan melihat detail area pertanian.
* **Ingesti Data Sensor:** Menerima dan menyimpan data pembacaan dari berbagai sensor (suhu, kelembapan, nutrisi, dll.).
* **Pemantauan Status Real-time:** Menyediakan data sensor terakhir untuk setiap area.
* **Riwayat Data:** Mengambil data sensor historis dalam rentang waktu tertentu.
* **Rekomendasi Perawatan:** Menghasilkan saran tindakan (penyiraman, pemupukan) berdasarkan data (saat ini rule-based/placeholder).
* **Prediksi Panen:** Memperkirakan hasil dan waktu panen (saat ini placeholder).

## Teknologi Stack

* **Bahasa:** Python 3.x
* **Framework:** Flask
* **Database:** PostgreSQL
* **ORM:** Flask-SQLAlchemy
* **AI/ML:** TensorFlow/Keras (placeholder)
* **Konfigurasi:** Python-dotenv

## Struktur Proyek
