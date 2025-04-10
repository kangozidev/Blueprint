// smartfarm_client/src/pages/ManageAreasPage/ManageAreasPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { createArea, fetchAreas } from '../../services/apiService'; // Impor fungsi API
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';

import styles from './ManageAreasPage.module.css';

function ManageAreasPage() {
  // State untuk form input (controlled components)
  const [name, setName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [locationDescription, setLocationDescription] = useState('');

  // State untuk proses submit form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State untuk daftar area (opsional, tapi bagus untuk konfirmasi)
  const [areas, setAreas] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState(null);

  // Fungsi untuk memuat daftar area
  const loadAreas = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const data = await fetchAreas();
      setAreas(data);
    } catch (err) {
      console.error("Gagal mengambil daftar area:", err);
      setListError(err.message || 'Gagal memuat daftar area.');
    } finally {
      setIsLoadingList(false);
    }
  }, []); // useCallback agar fungsi tidak dibuat ulang terus menerus

  // Load daftar area saat komponen mount
  useEffect(() => {
    loadAreas();
  }, [loadAreas]); // Panggil loadAreas saat mount

  // Handler untuk perubahan input form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    else if (name === 'plantType') setPlantType(value);
    else if (name === 'locationDescription') setLocationDescription(value);
  };

  // Handler untuk submit form
  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah reload halaman standar form HTML

    if (!name.trim()) {
      setFormError('Nama area tidak boleh kosong.');
      return; // Hentikan submit jika nama kosong
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    const areaData = {
      name: name.trim(),
      plant_type: plantType.trim() || null, // Kirim null jika kosong
      location_description: locationDescription.trim() || null,
    };

    try {
      const newArea = await createArea(areaData); // Panggil API
      setSuccessMessage(`Area "${newArea.name}" berhasil ditambahkan!`);
      // Kosongkan form setelah sukses
      setName('');
      setPlantType('');
      setLocationDescription('');
      // Muat ulang daftar area untuk menampilkan yang baru
      loadAreas();
    } catch (err) {
      console.error("Gagal menambahkan area:", err);
      setFormError(err.message || 'Gagal menambahkan area. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Kelola Area Pertanian</h2>

      {/* Bagian Form Tambah Area */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Tambah Area Baru</h3>
        <form onSubmit={handleSubmit} className={styles.areaForm}>
          <div>
            <label htmlFor="name">Nama Area:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleInputChange}
              required // Validasi HTML5 sederhana
              placeholder="Contoh: Kebun Belakang Blok A"
            />
          </div>
          <div>
            <label htmlFor="plantType">Jenis Tanaman (Opsional):</label>
            <input
              type="text"
              id="plantType"
              name="plantType"
              value={plantType}
              onChange={handleInputChange}
              placeholder="Contoh: Cabai Rawit"
            />
          </div>
          <div>
            <label htmlFor="locationDescription">Deskripsi Lokasi (Opsional):</label>
            <textarea
              id="locationDescription"
              name="locationDescription"
              value={locationDescription}
              onChange={handleInputChange}
              placeholder="Contoh: Dekat sumber air, sinar matahari penuh"
            />
          </div>

          {/* Tombol Submit dengan status loading */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Area'}
          </button>

          {/* Tampilkan pesan sukses atau error */}
          {successMessage && (
            <p className={`${styles.formMessage} ${styles.success}`}>{successMessage}</p>
          )}
          {formError && (
            <p className={`${styles.formMessage} ${styles.error}`}>{formError}</p>
          )}
        </form>
      </section>

      {/* Bagian Daftar Area yang Sudah Ada */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Daftar Area Terdaftar</h3>
        {isLoadingList ? (
          <div className={styles.loadingContainer}><LoadingSpinner size="small"/></div>
        ) : listError ? (
          <div className={styles.errorContainer}><ErrorMessage message={listError} /></div>
        ) : areas.length > 0 ? (
          <ul className={styles.areaList}>
            {areas.map(area => (
              <li key={area.area_id}>
                <strong>{area.name}</strong>
                {area.plant_type && ` - Tanaman: ${area.plant_type}`}
                {area.location_description && <><br/><small>Lokasi: {area.location_description}</small></>}
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada area yang ditambahkan.</p>
        )}
      </section>
    </div>
  );
}

export default ManageAreasPage;
