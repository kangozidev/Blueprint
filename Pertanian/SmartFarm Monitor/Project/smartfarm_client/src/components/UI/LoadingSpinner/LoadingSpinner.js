// smartfarm_client/src/components/UI/LoadingSpinner/LoadingSpinner.js

import React from 'react';
import styles from './LoadingSpinner.module.css'; // Impor CSS Module

/**
 * Komponen untuk menampilkan indikator loading (spinner).
 * Menerima prop 'size' opsional ('small', 'medium', 'large').
 * Default size adalah 'medium'.
 */
function LoadingSpinner({ size = 'medium' }) {
  // Tentukan kelas CSS berdasarkan prop size
  const spinnerSizeClass = styles[size] || styles.medium; // Fallback ke medium jika size tidak valid

  return (
    <div
      className={`${styles.spinner} ${spinnerSizeClass}`}
      role="status" // Untuk aksesibilitas
      aria-live="polite" // Untuk aksesibilitas
    >
      {/* Teks untuk pembaca layar */}
      <span style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
         }}>
        Memuat...
      </span>
    </div>
  );
}

export default LoadingSpinner;
