'use client';

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Lacak() {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setNotFound(false);
    setData(null);

    try {
      const docRef = doc(db, 'permohonan', id.trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error mencari dokumen:', error);
      setNotFound(true);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Lacak Permohonan</h1>
      <form onSubmit={handleSearch} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Masukkan kode referensi"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Cari
        </button>
      </form>

      {data && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📄 Data Permohonan:</h3>
          <p><strong>Layanan:</strong> {data.layanan}</p>
          <p><strong>Nama:</strong> {data.nama}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Instansi:</strong> {data.instansi}</p>
          <p><strong>Keterangan:</strong> {data.keterangan}</p>
          {data.dokumenURL && (
            <p><strong>Dokumen:</strong> <a href={data.dokumenURL} target="_blank" rel="noopener noreferrer">Lihat Dokumen</a></p>
          )}
        </div>
      )}

      {notFound && (
        <p style={{ marginTop: '2rem', color: 'red' }}>
          ❌ Data tidak ditemukan. Pastikan kode referensi benar.
        </p>
      )}
    </main>
  );
}
