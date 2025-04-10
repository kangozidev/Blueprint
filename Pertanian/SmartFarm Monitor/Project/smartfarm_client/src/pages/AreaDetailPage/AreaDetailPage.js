// smartfarm_client/src/pages/AreaDetailPage/AreaDetailPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams untuk ambil :areaId

// Impor fungsi API service
import {
  fetchAreaById,
  fetchAreaStatus,
  fetchAreaHistory,
  fetchRecommendations,
  fetchPredictions
} from '../../services/apiService';

// Impor komponen UI (akan dibuat)
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';
import SensorDisplay from '../../components/SensorDisplay/SensorDisplay'; // Ganti nama jika perlu
import LineChart from '../../components/Chart/LineChart'; // Wrapper Chart.js
// Komponen spesifik untuk rekomendasi dan prediksi (opsional, bisa langsung render)
// import RecommendationsDisplay from '../../components/RecommendationsDisplay/RecommendationsDisplay';
// import PredictionsDisplay from '../../components/PredictionsDisplay/PredictionsDisplay';

// Impor CSS Module
import styles from './AreaDetailPage.module.css';

function AreaDetailPage() {
  // Dapatkan areaId dari parameter URL
  const { areaId } = useParams();

  // State untuk menyimpan data dari API
  const [areaDetails, setAreaDetails] = useState(null);
  const [statusData, setStatusData] = useState({}); // Map sensor_id -> reading
  const [historyData, setHistoryData] = useState([]); // Array of readings for chart
  const [recommendations, setRecommendations] = useState([]);
  const [predictions, setPredictions] = useState(null);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk parameter chart history
  const [historyParams, setHistoryParams] = useState({
    sensor_type: 'temperature_air', // Default sensor type untuk ditampilkan
    // Kita bisa pakai 'start'/'end' atau periode relatif
    // Mari gunakan periode relatif untuk contoh ini
    period: '24h' // Contoh: '1h', '24h', '7d'
  });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Fungsi untuk memuat data awal (detail, status, recs, preds)
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gunakan Promise.all untuk fetch data secara paralel
      const [details, status, recs, preds] = await Promise.all([
        fetchAreaById(areaId),
        fetchAreaStatus(areaId),
        fetchRecommendations(areaId),
        fetchPredictions(areaId)
      ]);
      setAreaDetails(details);
      setStatusData(status); // Asumsi status adalah map { sensor_id: { value, timestamp, ... } }
      setRecommendations(recs); // Asumsi recs adalah array
      setPredictions(preds); // Asumsi preds adalah objek
    } catch (err) {
      console.error("Gagal memuat data detail area:", err);
      setError(err.message || `Gagal memuat data untuk area ${areaId}.`);
    } finally {
      setIsLoading(false);
    }
  }, [areaId]); // Jalankan ulang jika areaId berubah

  // Fungsi untuk memuat data history (dipanggil terpisah saat parameter berubah)
  const loadHistoryData = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      // Bangun parameter API berdasarkan state historyParams
      const apiParams = {};
      if (historyParams.sensor_type) {
        apiParams.sensor_type = historyParams.sensor_type;
      }
      // Konversi periode ke start/end time jika API membutuhkannya
      // Atau kirim periode jika API mendukungnya (misal: ?period=24h)
      // Untuk contoh, kita asumsikan API bisa menerima 'period'
      // Jika tidak, hitung start time di sini:
      // const now = new Date();
      // let startTime;
      // if(historyParams.period === '24h') startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      // etc...
      // apiParams.start = startTime.toISOString();

      // Untuk simple demo, kita asumsikan API hanya perlu sensor_type
      // dan periode akan dihandle API atau kita fetch semua lalu filter di client (tidak ideal)
      // Mari kita asumsikan kirim sensor_type saja untuk simple chart
      const data = await fetchAreaHistory(areaId, { sensor_type: historyParams.sensor_type });
      setHistoryData(data); // Asumsi data adalah array [{ timestamp, value, ... }]
    } catch (err) {
      console.error("Gagal memuat data riwayat:", err);
      setHistoryError(err.message || 'Gagal memuat riwayat sensor.');
    } finally {
      setIsHistoryLoading(false);
    }
  }, [areaId, historyParams]); // Jalankan ulang jika areaId atau historyParams berubah

  // useEffect untuk memuat data awal saat komponen mount atau areaId berubah
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]); // Memanggil fungsi yang di-memoize oleh useCallback

  // useEffect untuk memuat data history saat komponen mount atau historyParams berubah
  useEffect(() => {
    if (areaId) { // Pastikan areaId ada sebelum fetch history
        loadHistoryData();
    }
  }, [loadHistoryData]); // Memanggil fungsi yang di-memoize oleh useCallback

  // Handler untuk mengubah tipe sensor di chart
  const handleSensorTypeChange = (event) => {
    setHistoryParams(prevParams => ({
      ...prevParams,
      sensor_type: event.target.value
    }));
  };

  // Handler untuk mengubah periode waktu di chart (jika ada kontrolnya)
  const handlePeriodChange = (newPeriod) => {
     setHistoryParams(prevParams => ({
      ...prevParams,
      period: newPeriod // Atau update start/end time
    }));
  };


  // --- Render Logic ---

  if (isLoading) {
    return <div className={styles.loadingContainer}><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className={styles.errorContainer}><ErrorMessage message={error} /></div>;
  }

  if (!areaDetails) {
    // Kasus ini seharusnya sudah ditangani oleh error, tapi sebagai fallback
    return <div className={styles.errorContainer}><ErrorMessage message={`Area dengan ID ${areaId} tidak ditemukan.`} /></div>;
  }

  // Mendapatkan daftar tipe sensor unik dari statusData untuk dropdown history
  const availableSensorTypes = [...new Set(Object.values(statusData).map(s => s.sensor_type))];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Detail Area: {areaDetails.name}</h2>
        <Link to="/dashboard" className={styles.backLink}>&larr; Kembali ke Dashboard</Link>
      </div>

      {/* Grid untuk menampilkan beberapa bagian */}
      <div className={styles.detailGrid}>

        {/* Bagian Status Terkini */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Status Sensor Terkini</h3>
          {Object.keys(statusData).length > 0 ? (
            <div className={styles.statusGrid}>
              {Object.entries(statusData).map(([sensorId, reading]) => (
                <SensorDisplay
                  key={sensorId}
                  sensorId={sensorId}
                  type={reading.sensor_type}
                  value={reading.value}
                  unit={reading.unit}
                  timestamp={reading.timestamp}
                />
              ))}
            </div>
          ) : (
            <p>Belum ada data status.</p>
          )}
        </section>

        {/* Bagian Rekomendasi */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Rekomendasi Perawatan</h3>
          {recommendations.length > 0 ? (
            <ul className={styles.recommendationList}>
              {recommendations.map((rec, index) => (
                <li key={index} className={styles.recommendationItem}>
                  <strong>{rec.type}:</strong> {rec.message} ({rec.priority})
                  <br/>
                  <small>Data Acuan: {new Date(rec.timestamp).toLocaleString('id-ID')}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada rekomendasi saat ini.</p>
          )}
        </section>

        {/* Bagian Prediksi */}
        {predictions && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Prediksi Panen</h3>
            <div className={styles.predictionDetails}>
               <p className={styles.predictionItem}>
                 <strong>Perkiraan Hasil:</strong> {predictions.predicted_yield} {predictions.yield_unit || ''}
               </p>
               <p className={styles.predictionItem}>
                 <strong>Perkiraan Tanggal Panen:</strong> {predictions.predicted_harvest_date ? new Date(predictions.predicted_harvest_date).toLocaleDateString('id-ID') : 'N/A'}
               </p>
                <p className={styles.predictionItem}>
                 <strong>Tingkat Keyakinan:</strong> {predictions.confidence || 'N/A'}
               </p>
               <small>Dihasilkan pada: {new Date(predictions.generated_at).toLocaleString('id-ID')}</small>
            </div>
          </section>
        )}
      </div>

      {/* Bagian Riwayat Sensor (Chart) */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Riwayat Sensor</h3>
        <div className={styles.historyControls}>
          <label htmlFor="sensorTypeSelect">Pilih Sensor:</label>
          <select
            id="sensorTypeSelect"
            value={historyParams.sensor_type}
            onChange={handleSensorTypeChange}
          >
            {availableSensorTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
            ))}
             {availableSensorTypes.length === 0 && <option disabled>Tidak ada data sensor</option>}
          </select>
          {/* Tambahkan kontrol periode waktu di sini jika diinginkan */}
          {/* Contoh:
          <button onClick={() => handlePeriodChange('1h')}>1 Jam</button>
          <button onClick={() => handlePeriodChange('24h')}>24 Jam</button>
          <button onClick={() => handlePeriodChange('7d')}>7 Hari</button>
          */}
        </div>
        {isHistoryLoading ? (
          <div className={styles.loadingContainer} style={{minHeight: '150px'}}><LoadingSpinner size="small"/></div>
        ) : historyError ? (
           <div className={styles.errorContainer}><ErrorMessage message={historyError} /></div>
        ) : historyData.length > 0 ? (
          <div style={{ height: '300px' }}> {/* Beri tinggi eksplisit untuk chart container */}
            <LineChart
              chartData={historyData}
              title={`Riwayat ${historyParams.sensor_type.replace('_', ' ').toUpperCase()}`}
              // Kirim props lain yg dibutuhkan LineChart (misal: unit)
            />
          </div>
        ) : (
           <p>Tidak ada data riwayat untuk sensor '{historyParams.sensor_type}'.</p>
        )}
      </section>

    </div>
  );
}

export default AreaDetailPage;
