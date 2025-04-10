// smartfarm_client/src/components/AreaCard/AreaCard.js

import React from 'react';
import PropTypes from 'prop-types'; // Impor PropTypes untuk validasi tipe prop
import styles from './AreaCard.module.css'; // Impor CSS Module

/**
 * Komponen Card untuk menampilkan ringkasan satu area pertanian.
 * Menerima props: name, plantType, location.
 */
function AreaCard({ name, plantType, location }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{name || 'Nama Area Tidak Diketahui'}</h3>

      <div className={styles.cardInfo}>
        <p>
          <strong>Tanaman:</strong>{' '}
          {plantType ? plantType : <span className={styles.noInfo}>Belum ditentukan</span>}
        </p>
        <p>
          <strong>Lokasi/Deskripsi:</strong>{' '}
          {location ? location : <span className={styles.noInfo}>Tidak ada deskripsi</span>}
        </p>
        {/* Tambahkan info ringkasan lain di sini jika perlu */}
        {/* Contoh: <p><strong>Suhu Terkini:</strong> 28°C</p> */}
      </div>

      {/* Bisa tambahkan tombol aksi di sini jika perlu */}
      {/* <div className={styles.cardActions}>
        <button>Lihat Detail</button>
      </div> */}
    </div>
  );
}

// Definisi tipe properti (PropTypes) untuk validasi dan dokumentasi
AreaCard.propTypes = {
  /** Nama area pertanian (wajib ada) */
  name: PropTypes.string.isRequired,
  /** Jenis tanaman di area tersebut (opsional) */
  plantType: PropTypes.string,
  /** Deskripsi lokasi area (opsional) */
  location: PropTypes.string,
};

// Nilai default untuk props (jika tidak diberikan)
AreaCard.defaultProps = {
  plantType: '',
  location: '',
};


export default AreaCard;
