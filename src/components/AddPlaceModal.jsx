import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function AddPlaceModal({ coords, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [cost, setCost] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const bucket = import.meta.env.VITE_SUPABASE_BUCKET || 'places-photos';

  function handleFilesChange(e) {
    const chosen = Array.from(e.target.files || []);
    setFiles(chosen);
    const p = chosen.map((f) => URL.createObjectURL(f));
    setPreviews(p);
  }

  async function uploadFiles(placeId) {
    if (!files.length) return [];

    const uploadedUrls = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const path = `${placeId}/${Date.now()}_${uuidv4()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Supabase upload error', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
      }

      const { data: publicData } = await supabase.storage.from(bucket).getPublicUrl(path);
      if (publicData?.publicUrl) {
        uploadedUrls.push(publicData.publicUrl);
      } else {
        const { data: signedData, error: signedErr } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 3600);
        if (signedErr) {
          console.error('createSignedUrl error', signedErr);
          throw new Error(signedErr.message || 'Signed URL failed');
        }
        uploadedUrls.push(signedData.signedUrl);
      }
    }
    return uploadedUrls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const placeId = uuidv4();

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      const photoUrls = await uploadFiles(placeId);

      const payload = {
        id: placeId,
        user_id: userId,
        name: name || 'Untitled',
        description: note || '',
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        photos: photoUrls,
        cost: cost ? Number(cost) : null,
        time_start: new Date().toISOString(),
        visibility: 'private'
      };

      const { data, error } = await supabase.from('places').insert([payload]);

      if (error) {
        console.error('insert place error', error);
        setErrorMsg(error.message || 'Failed to save place');
      } else {
        onSaved && onSaved(data?.[0] ?? payload);
        onClose && onClose();
      }
    } catch (err) {
      console.error('AddPlaceModal unexpected error', err);
      setErrorMsg(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded p-4 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">添加地点</h2>
        <p className="text-sm text-gray-600 mb-2">坐标: {coords?.lat?.toFixed?.(6) ?? '-'}, {coords?.lng?.toFixed?.(6) ?? '-'}</p>

        <label className="block mb-2">
          <div className="text-sm">名称</div>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">备注 / 感想</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border p-2" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">花销（可选）</div>
          <input value={cost} onChange={(e) => setCost(e.target.value)} className="w-full border p-2" />
        </label>

        <label className="block mb-2">
          <div className="text-sm">照片（可选）</div>
          <input type="file" multiple accept="image/*" onChange={handleFilesChange} />
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} className="w-full h-20 object-cover rounded" />
            ))}
          </div>
        )}

        {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded" disabled={loading}>取消</button>
          <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
