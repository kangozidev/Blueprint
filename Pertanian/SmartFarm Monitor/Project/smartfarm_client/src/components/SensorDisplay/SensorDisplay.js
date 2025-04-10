// smartfarm_client/src/components/SensorDisplay/SensorDisplay.js

import React from 'react';
import PropTypes from 'prop-types';
import styles from './SensorDisplay.module.css';

/**
 * Komponen untuk menampilkan pembacaan satu sensor.
 * Menerima props: sensorId, type, value, unit, timestamp.
 */
function SensorDisplay({ sensorId, type, value, unit, timestamp }) {

  // Fungsi helper untuk format tipe sensor (misal: 'temperature_air' -> 'Temperature Air')
  const formatSensorType = (sensorType) => {
    if (!sensorType) return 'Unknown Sensor';
    return sensorType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Fungsi helper untuk format timestamp
  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    try {
      // Menggunakan waktu lokal Indonesia (WIB - Asia/Jakarta)
      const options = {
          // dateStyle: 'short', // Uncomment jika ingin tanggal
          timeStyle: 'medium', // Format waktu HH:MM:SS
          hour12: false, // Gunakan format 24 jam
          timeZone: 'Asia/Jakarta' // Tetapkan timezone WIB
      };
      // Tanggal bisa didapat dari timestamp jika perlu: new Date(ts).toLocaleDateString('id-ID', options)
      return new Date(ts).toLocaleTimeString('id-ID', options) + " WIB";
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return ts; // Kembalikan timestamp asli jika format gagal
    }
  };

  // Fungsi helper untuk membulatkan nilai jika perlu (opsional)
  const formatValue = (val) => {
      if (typeof val === 'number') {
          // Bulatkan ke 1 angka desimal, contoh
          return val.toFixed(1);
      }
      // Jika sudah string (dari Numeric di backend?), coba parse
      if (typeof val === 'string') {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? val : parsed.toFixed(1);
      }
      return val; // Kembalikan asli jika bukan angka/string angka
  }

  // Kelas CSS tambahan berdasarkan tipe sensor (opsional)
  // const typeClass = styles[type] || ''; // Misal: styles.temperature, styles.humidity

  return (
    // <div className={`${styles.displayBox} ${typeClass}`}>
    <div className={styles.displayBox}>
      <div className={styles.sensorType}>
        {formatSensorType(type)}
        {/* ID bisa ditampilkan jika perlu: ({sensorId}) */}
      </div>
      <div> {/* Div tambahan untuk mengelompokkan nilai dan unit */}
        <span className={styles.sensorValue}>
          {/* Format nilai sebelum ditampilkan */}
          {value !== null && value !== undefined ? formatValue(value) : '--'}
        </span>
        {unit && <span className={styles.sensorUnit}>{unit}</span>}
      </div>
      <div className={styles.timestamp}>
        Terakhir Update: {formatTimestamp(timestamp)}
      </div>
    </div>
  );
}

SensorDisplay.propTypes = {
  /** ID unik sensor (opsional untuk ditampilkan) */
  sensorId: PropTypes.string,
  /** Tipe sensor (e.g., 'temperature_air') */
  type: PropTypes.string.isRequired,
  /** Nilai pembacaan sensor */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Satuan pengukuran (e.g., '°C', '%') */
  unit: PropTypes.string,
  /** Timestamp pembacaan dalam format ISO string */
  timestamp: PropTypes.string.isRequired,
};

SensorDisplay.defaultProps = {
  unit: '',
  sensorId: '',
};

export default SensorDisplay;
