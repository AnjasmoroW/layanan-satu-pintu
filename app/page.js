'use client';

import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Home() {
  const [form, setForm] = useState({
    layanan: '',
    nama: '',
    email: '',
    instansi: '',
    keterangan: '',
    dokumen: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileURL = '';
      if (form.dokumen) {
        const fileRef = ref(storage, `dokumen/${Date.now()}-${form.dokumen.name}`);
        await uploadBytes(fileRef, form.dokumen);
        fileURL = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'permohonan'), {
        layanan: form.layanan,
        nama: form.nama,
        email: form.email,
        instansi: form.instansi,
        keterangan: form.keterangan,
        dokumenURL: fileURL,
        timestamp: Timestamp.now(),
      });

      alert('Permohonan berhasil dikirim!');
      setForm({ layanan: '', nama: '', email: '', instansi: '', keterangan: '', dokumen: null });
    } catch (error) {
      console.error('Gagal mengirim:', error);
      alert('Gagal mengirim permohonan.');
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Layanan Satu Pintu Balai Bahasa</h1>
      <p>Pusat layanan terpadu bagi seluruh elemen masyarakat</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Jenis Layanan:
          <select name="layanan" value={form.layanan} onChange={handleChange} required>
            <option value="">-- Pilih Layanan --</option>
            <option value="UKBI">UKBI</option>
            <option value="Ahli Bahasa">Permintaan Ahli Bahasa</option>
            <option value="Penyuluhan">Penyuluhan Bahasa dan Sastra</option>
            <option value="Data">Permohonan Data Bahasa dan Sastra</option>
            <option value="PPID">Permohonan Berkas (PPID)</option>
            <option value="Ruang">Peminjaman Ruangan</option>
          </select>
        </label>

        <input type="text" name="nama" placeholder="Nama Lengkap" value={form.nama} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="instansi" placeholder="Instansi (opsional)" value={form.instansi} onChange={handleChange} />
        <textarea name="keterangan" placeholder="Uraikan permohonan Anda" value={form.keterangan} onChange={handleChange} required />

        <label>
          Upload Dokumen Pendukung:
          <input type="file" name="dokumen" onChange={handleChange} />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Permohonan'}</button>
      </form>
    </main>
  );
}