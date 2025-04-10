// smartfarm_client/src/App.js

import React from 'react';
// Impor komponen routing dari react-router-dom v6+
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';

// Impor komponen halaman
import DashboardPage from './pages/DashboardPage/DashboardPage';
import AreaDetailPage from './pages/AreaDetailPage/AreaDetailPage';
import ManageAreasPage from './pages/ManageAreasPage/ManageAreasPage';
import NotFoundPage from './pages/NotFoundPage'; // Halaman 404

// Impor CSS untuk komponen App
import './App.css';
// Impor aset (opsional, jika logo diletakkan di src/assets)
// import logo from './assets/images/farm-logo.png';

function App() {
  return (
    // Router harus membungkus seluruh aplikasi yang menggunakan routing
    <Router>
      <div className="App">
        {/* Header / Navigasi Aplikasi */}
        <header className="App-header">
          {/* Judul/Logo Aplikasi */}
          <h1>
            {/* <img src={logo} alt="Logo SmartFarm" style={{height: '30px', marginRight: '10px'}} /> */}
            SmartFarm Monitor
          </h1>

          {/* Navigasi Utama */}
          <nav className="App-nav">
            <ul>
              <li>
                {/* NavLink menambahkan class 'active' secara otomatis */}
                <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/manage-areas" className={({isActive}) => isActive ? 'active' : ''}>
                  Kelola Area
                </NavLink>
              </li>
              {/* Tambahkan link lain jika perlu */}
            </ul>
          </nav>
        </header>

        {/* Konten Utama - Tempat halaman akan dirender oleh Router */}
        <main className="App-content">
          {/* Routes mendefinisikan area di mana Route akan dicocokkan */}
          <Routes>
            {/* Route untuk halaman Dashboard (juga sebagai halaman default) */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Route untuk halaman Detail Area dengan parameter :areaId */}
            <Route path="/areas/:areaId" element={<AreaDetailPage />} />

            {/* Route untuk halaman Kelola Area */}
            <Route path="/manage-areas" element={<ManageAreasPage />} />

            {/* Route 'catch-all' untuk halaman yang tidak ditemukan (404) */}
            {/* Harus diletakkan paling akhir */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer (Opsional) */}
        {/* <footer className="App-footer">
          <p>© {new Date().getFullYear()} SmartFarm Monitor</p>
        </footer> */}
      </div>
    </Router>
  );
}

export default App;
