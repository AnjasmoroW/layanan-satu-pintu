'use client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [layananFilter, setLayananFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'permohonan'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      let docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // filter jika layanan dipilih
      if (layananFilter) {
        docs = docs.filter(doc => doc.layanan === layananFilter);
      }

      setData(docs);
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
    setLoading(false);
  };

  const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.text('Daftar Permohonan Layanan', 14, 10);

  const tableData = data.map((d, i) => [
    i + 1,
    d.layanan,
    d.nama,
    d.email,
    d.instansi,
    d.keterangan,
    d.dokumenURL || '-',
    d.id,
  ]);

  autoTable(doc, {
    head: [['No', 'Layanan', 'Nama', 'Email', 'Instansi', 'Keterangan', 'Dokumen', 'ID']],
    body: tableData,
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 102, 204] },
  });

  doc.save('permohonan.pdf');
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus permohonan ini?");
    if (!konfirmasi) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'permohonan', id));
      alert("Data berhasil dihapus.");
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      alert("Terjadi kesalahan saat menghapus.");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📋 Dashboard Permohonan</h1>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Filter Layanan:{' '}
          <select value={layananFilter} onChange={(e) => setLayananFilter(e.target.value)}>
            <option value="">Semua</option>
            <option value="UKBI">UKBI</option>
            <option value="Ahli Bahasa">Ahli Bahasa</option>
            <option value="Penyuluhan">Penyuluhan</option>
            <option value="Data">Permohonan Data</option>
            <option value="PPID">Permohonan Berkas (PPID)</option>
            <option value="Ruang">Peminjaman Ruangan</option>
          </select>
        </label>
        <button style={{ marginLeft: '1rem' }} onClick={fetchData}>Terapkan</button>
        <button style={{ marginLeft: '1rem' }} onClick={handleExportPDF}>Ekspor PDF</button>
      </div>

      {data.length === 0 ? (
        <p>Memuat data...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem', borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Layanan</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Instansi</th>
              <th>Keterangan</th>
              <th>Dokumen</th>
              <th>ID</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={d.id}>
                <td>{i + 1}</td>
                <td>{d.layanan}</td>
                <td>{d.nama}</td>
                <td>{d.email}</td>
                <td>{d.instansi}</td>
                <td>{d.keterangan}</td>
                <td>
                  {d.dokumenURL ? (
                    <a href={d.dokumenURL} target="_blank" rel="noopener noreferrer">Lihat</a>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ fontSize: '0.75rem' }}>{d.id}</td>
                <td>
                  <button onClick={() => handleDelete(d.id)} disabled={loading}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
