// smartfarm_client/src/pages/DashboardPage/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Untuk link ke halaman detail
import { fetchAreas } from '../../services/apiService'; // Impor fungsi API

// Impor komponen UI (akan dibuat nanti)
import AreaCard from '../../components/AreaCard/AreaCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';

// Impor CSS Module
import styles from './DashboardPage.module.css';

function DashboardPage() {
  // State untuk menyimpan daftar area
  const [areas, setAreas] = useState([]);
  // State untuk status loading
  const [isLoading, setIsLoading] = useState(true);
  // State untuk menyimpan pesan error jika fetch gagal
  const [error, setError] = useState(null);

  // useEffect untuk fetch data saat komponen pertama kali di-mount
  useEffect(() => {
    // Definisikan fungsi async di dalam useEffect
    const loadAreas = async () => {
      try {
        setError(null); // Reset error sebelum fetch baru
        setIsLoading(true); // Set loading true
        const data = await fetchAreas(); // Panggil API service
        setAreas(data); // Simpan data ke state
      } catch (err) {
        // Tangkap error yang dilempar oleh apiService
        console.error("Gagal mengambil data area:", err);
        setError(err.message || 'Gagal memuat data area.'); // Simpan pesan error
      } finally {
        // Set loading false setelah selesai (baik sukses maupun gagal)
        setIsLoading(false);
      }
    };

    loadAreas(); // Panggil fungsi async

    // Dependency array kosong [] berarti efek ini hanya berjalan sekali
    // setelah komponen pertama kali dirender (componentDidMount)
  }, []); // Dependency array kosong

  // Render logic
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <ErrorMessage message={error} />
          {/* Mungkin tambahkan tombol retry? */}
          {/* <button onClick={loadAreas}>Coba Lagi</button> */}
        </div>
      );
    }

    if (areas.length === 0) {
      return <p>Belum ada area pertanian yang terdaftar.</p>;
      // Mungkin tambahkan link ke halaman 'Kelola Area'
    }

    // Jika berhasil dan ada data, tampilkan grid kartu area
    return (
      <div className={styles.areaGrid}>
        {areas.map((area) => (
          // Bungkus AreaCard dengan Link agar bisa diklik
          <Link to={`/areas/${area.area_id}`} key={area.area_id} style={{ textDecoration: 'none', color: 'inherit' }}>
             {/* Komponen AreaCard akan menerima data area sebagai props */}
            <AreaCard
              name={area.name}
              plantType={area.plant_type}
              location={area.location_description}
              // Tambahkan props lain jika perlu
            />
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Dashboard Area Pertanian</h2>
      {/* Panggil fungsi render untuk menampilkan konten dinamis */}
      {renderContent()}
    </div>
  );
}

export default DashboardPage;
