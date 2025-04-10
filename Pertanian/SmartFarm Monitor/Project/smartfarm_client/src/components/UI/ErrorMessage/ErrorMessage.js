// smartfarm_client/src/components/UI/ErrorMessage/ErrorMessage.js

import React from 'react';
import styles from './ErrorMessage.module.css'; // Impor CSS Module

/**
 * Komponen untuk menampilkan pesan error.
 * Menerima prop 'message' (string) untuk pesan yang ditampilkan.
 * Menerima prop 'onRetry' (function, opsional) untuk menampilkan tombol Coba Lagi.
 */
function ErrorMessage({ message, onRetry }) {
  // Jika tidak ada pesan, tampilkan pesan default atau tidak sama sekali
  if (!message) {
    // Atau return null jika tidak ingin menampilkan apa pun
    message = "Terjadi kesalahan yang tidak diketahui.";
  }

  return (
    <div className={styles.errorBox} role="alert"> {/* role="alert" untuk aksesibilitas */}
      <p className={styles.errorMessage}>{message}</p>
      {/* Tampilkan tombol Coba Lagi hanya jika fungsi onRetry diberikan */}
      {onRetry && typeof onRetry === 'function' && (
        <button onClick={onRetry} className={styles.retryButton}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
