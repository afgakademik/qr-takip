"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function OgrenciSayfasi() {
  const [no, setNo] = useState('');
  const [islem, setIslem] = useState('teslim_etme');
  const [mesaj, setMesaj] = useState('');

  const islemYap = async (e) => {
    e.preventDefault();
    setMesaj('İşlem yapılıyor...');

    // 1. Önce öğrenci var mı kontrol et
    const { data: ogrenci, error: ogrenciHata } = await supabase
      .from('ogrenciler')
      .select('ad_soyad')
      .eq('numara', no)
      .single();

    if (ogrenciHata || !ogrenci) {
      setMesaj('Öğrenci bulunamadı! Lütfen numarayı kontrol edin.');
      return;
    }

    // 2. İşlemi kaydet
    const { error: kayitHata } = await supabase
      .from('telefon_kayitlari')
      .insert([{ ogrenci_no: no, islem_turu: islem }]);

    if (kayitHata) {
      setMesaj('Bir hata oluştu: ' + kayitHata.message);
    } else {
      setMesaj(`Teşekkürler ${ogrenci.ad_soyad}. İşlem başarıyla kaydedildi.`);
      setNo('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Telefon Teslim Sistemi</h1>
        <form onSubmit={islemYap} className="space-y-4">
          <input 
            type="number" placeholder="Öğrenci No" 
            className="w-full p-3 border rounded"
            value={no} onChange={(e) => setNo(e.target.value)} required
          />
          <select 
            className="w-full p-3 border rounded"
            value={islem} onChange={(e) => setIslem(e.target.value)}
          >
            <option value="teslim_etme">Telefonu Teslim Ediyorum</option>
            <option value="teslim_alma">Telefonu Teslim Alıyorum</option>
          </select>
          <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
            İşlemi Tamamla
          </button>
        </form>
        {mesaj && <p className="mt-4 text-center font-semibold text-blue-600">{mesaj}</p>}
      </div>
    </div>
  );
}
