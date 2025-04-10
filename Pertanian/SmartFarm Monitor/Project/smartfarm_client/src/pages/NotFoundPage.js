// smartfarm_client/src/pages/NotFoundPage.js

import React from 'react';
import { Link } from 'react-router-dom'; // Untuk link kembali

// Gaya bisa ditambahkan di sini secara inline atau via CSS terpisah jika perlu
const pageStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  minHeight: 'calc(100vh - 200px)', // Contoh perhitungan tinggi minimum
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const headingStyle = {
  fontSize: '3rem',
  color: '#dc3545', // Warna merah untuk penekanan error
  marginBottom: '10px'
};

const messageStyle = {
  fontSize: '1.2rem',
  color: '#6c757d', // Warna abu-abu
  marginBottom: '25px'
};

const linkStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#007bff', // Warna biru primer
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold'
};

function NotFoundPage() {
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={messageStyle}>Oops! Halaman yang Anda cari tidak ditemukan.</p>
      <Link to="/dashboard" style={linkStyle}>
        Kembali ke Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
