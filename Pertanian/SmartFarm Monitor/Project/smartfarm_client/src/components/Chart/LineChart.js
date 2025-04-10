// smartfarm_client/src/components/Chart/LineChart.js

import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // Untuk sumbu X (kategorikal/label)
  LinearScale,   // Untuk sumbu Y (numerik)
  PointElement,  // Untuk titik data pada garis
  LineElement,   // Untuk garis itu sendiri
  Title,         // Untuk judul chart
  Tooltip,       // Untuk info saat hover
  Legend,        // Untuk legenda dataset
  TimeScale,     // Opsional: Untuk sumbu X berbasis waktu (perlu adapter)
} from 'chart.js';
// Opsional: Jika menggunakan TimeScale, perlu adapter tanggal
// import 'chartjs-adapter-date-fns'; // Contoh: menggunakan date-fns
// import { id } from 'date-fns/locale'; // Locale Indonesia untuk date-fns

// Daftarkan komponen Chart.js yang akan digunakan
// Cukup dilakukan sekali di aplikasi Anda
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  // TimeScale // Daftarkan TimeScale jika Anda menggunakannya
);

/**
 * Komponen untuk menampilkan Line Chart menggunakan Chart.js.
 * Menerima props: chartData, title, label, yAxisLabel.
 */
function LineChart({ chartData = [], title = 'Chart Riwayat', label = 'Value', yAxisLabel = 'Nilai' }) {

  // Format data dari API [{ timestamp, value }, ...] ke format Chart.js
  const labels = chartData.map(item => {
    try {
        // Format timestamp ke string waktu lokal yang lebih pendek untuk label sumbu X
        // Sesuaikan format sesuai kebutuhan
        const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
        return new Date(item.timestamp).toLocaleTimeString('id-ID', options);
    } catch {
        return item.timestamp; // Fallback jika format gagal
    }
  });
  const dataPoints = chartData.map(item => item.value);

  // Opsi konfigurasi untuk Chart.js
  const options = {
    responsive: true, // Membuat chart responsif terhadap ukuran container
    maintainAspectRatio: false, // Penting jika container punya tinggi tetap
    plugins: {
      legend: {
        position: 'top', // Posisi legenda ('top', 'bottom', 'left', 'right')
      },
      title: {
        display: true, // Tampilkan judul
        text: title,   // Judul chart dari props
        font: {
            size: 16
        }
      },
      tooltip: {
        mode: 'index', // Tampilkan tooltip untuk semua dataset di index yg sama
        intersect: false,
      },
    },
    scales: {
      x: {
        // Sumbu X: menggunakan label waktu yang sudah diformat
        title: {
          display: true,
          text: 'Waktu (WIB)', // Label sumbu X
        },
      },
      y: {
        // Sumbu Y: skala linear standar
        title: {
          display: true,
          text: yAxisLabel, // Label sumbu Y dari props
        },
        // Anda bisa menambahkan min/max jika perlu
        // suggestedMin: 0,
        // suggestedMax: 100,
      },
    },
    // Optimasi (opsional): nonaktifkan animasi jika data sangat banyak
    // animation: false,
    // parsing: false, // Jika data sudah dalam format {x, y}
  };

  // Struktur data untuk Chart.js
  const data = {
    labels: labels, // Label untuk sumbu X
    datasets: [
      {
        label: label, // Nama dataset (muncul di legenda & tooltip) dari props
        data: dataPoints, // Data nilai untuk sumbu Y
        borderColor: 'rgb(75, 192, 192)', // Warna garis (biru-hijau)
        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Warna area di bawah garis (opsional)
        tension: 0.1 // Membuat garis sedikit melengkung (0 = lurus)
      },
      // Anda bisa menambahkan dataset lain di sini jika ingin plot beberapa garis
      // {
      //   label: 'Dataset 2',
      //   data: [ ... ],
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
      // }
    ],
  };

  // Jangan render chart jika tidak ada data untuk mencegah error
  if (!chartData || chartData.length === 0) {
    return <p>Tidak ada data untuk ditampilkan pada grafik.</p>;
  }

  // Render komponen Line dari react-chartjs-2
  return <Line options={options} data={data} />;
}

LineChart.propTypes = {
  /** Array data, format: [{ timestamp: string (ISO), value: number/string }, ...] */
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  /** Judul yang ditampilkan di atas chart */
  title: PropTypes.string,
  /** Label untuk dataset utama (muncul di legenda/tooltip) */
  label: PropTypes.string,
  /** Label untuk sumbu Y */
  yAxisLabel: PropTypes.string,
};

export default LineChart;
