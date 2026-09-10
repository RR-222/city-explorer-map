import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { getDistrict } from '../utils/geocode';
import { useToast } from './Toast';

export default function AddPlaceModal({ coords, onClose, onSaved, place }) {
  const toast = useToast();
  const isEdit = !!place;
  const bucket = 'places-photos';

  const [name, setName] = useState(place?.name ?? '');
  const [description, setDescription] = useState(place?.description ?? '');
  const [tags, setTags] = useState(place?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [timeStartDate, setTimeStartDate] = useState(place?.time_start ? place.time_start.slice(0, 10) : '');
  const [timeStartHour, setTimeStartHour] = useState(place?.time_start ? Number(place.time_start.slice(11, 13)) : '');
  const [timeEndDate, setTimeEndDate] = useState(place?.time_end ? place.time_end.slice(0, 10) : '');
  const [timeEndHour, setTimeEndHour] = useState(place?.time_end ? Number(place.time_end.slice(11, 13)) : '');
  const [cost, setCost] = useState(place?.cost ?? '');
  const [visibility, setVisibility] = useState(place?.visibility ?? 'private');
  const [photos, setPhotos] = useState(place?.photos ?? []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const lat = isEdit ? place.lat : coords?.lat;
  const lng = isEdit ? place.lng : coords?.lng;

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const uploadNewPhoto = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const ext = f.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase
        .storage
        .from(bucket)
        .upload(filename, f, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data: publicData } = await supabase.storage.from(bucket).getPublicUrl(filename);
      let publicUrl = publicData?.publicUrl ?? publicData?.publicURL ?? '';
      if (!publicUrl) {
        const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(filename, 60 * 60);
        publicUrl = signedData?.signedUrl ?? signedData?.signedURL ?? '';
      }
      if (!publicUrl) throw new Error('无法获取图片访问 URL');
      setPhotos((prev) => [...prev, publicUrl]);
    } catch (err) {
      toast.error('图片上传失败: ' + (err.message || ''));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = async (url) => {
    const m = url.match(/places-photos\/(.+?)(\?|$)/);
    const path = m ? m[1] : null;
    if (path) {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) console.warn('remove photo error', error);
    }
    setPhotos((prev) => prev.filter((u) => u !== url));
  };

  const handleSave = async () => {
    if (!name) {
      toast.warning('请填写名称');
      return;
    }
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) console.warn('getUser error', userError);
      const userId = user?.id ?? null;
      if (!userId) throw new Error('未登录，无法保存');

      const padHour = (h) => (h === '' || h == null ? '00' : String(h).padStart(2, '0'));
      const buildTs = (date, hour) => (date ? `${date}T${padHour(hour)}:00:00` : null);

      // 逆地理编码获取所在区（用于区域成就），失败不阻断保存
      const district = await getDistrict(lat, lng);

      const payload = {
        name,
        description,
        lat,
        lng,
        tags,
        time_start: buildTs(timeStartDate, timeStartHour),
        time_end: buildTs(timeEndDate, timeEndHour),
        cost: cost === '' ? null : Number(cost),
        visibility,
        photos,
        district,
        user_id: userId,
      };

      let data, error;
      if (isEdit) {
        const { user_id, ...updatePayload } = payload;
        ({ data, error } = await supabase
          .from('places')
          .update(updatePayload)
          .eq('id', place.id)
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from('places')
          .insert(payload)
          .select()
          .single());
      }

      if (error) throw error;

      onSaved && onSaved(data);
      onClose && onClose();
    } catch (err) {
      console.error('保存失败', err);
      toast.error('保存失败: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{isEdit ? '编辑地点' : '添加地点'}</h3>
        <div className="modal-coords">
          坐标: {lat?.toFixed(5)}, {lng?.toFixed(5)}
        </div>

        <div className="form-field">
          <label>名称（必填）</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div className="form-field">
          <label>描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div className="form-field">
          <label>标签（回车添加）</label>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            style={{ width: '100%' }}
            placeholder="输入标签后按回车"
          />
          <div style={{ marginTop: 4 }}>
            {tags.map((t) => (
              <span key={t} className="tag-chip">
                {t}
                <button onClick={() => removeTag(t)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label>开始时间</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="date" value={timeStartDate} onChange={(e) => setTimeStartDate(e.target.value)} style={{ flex: 1 }} />
            <select value={timeStartHour} onChange={(e) => setTimeStartHour(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: 80 }}>
              <option value="">时</option>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}时</option>)}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label>结束时间</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="date" value={timeEndDate} onChange={(e) => setTimeEndDate(e.target.value)} style={{ flex: 1 }} />
            <select value={timeEndHour} onChange={(e) => setTimeEndHour(e.target.value === '' ? '' : Number(e.target.value))} style={{ width: 80 }}>
              <option value="">时</option>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}时</option>)}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label>花费</label>
          <input type="text" inputMode="decimal" pattern="[0-9.]*" value={cost} onChange={(e) => setCost(e.target.value)} style={{ width: '100%' }} placeholder="请输入花费金额" />
        </div>

        <div className="form-field">
          <label>可见性</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{ width: '100%' }}>
            <option value="private">私有</option>
            <option value="public">公开</option>
          </select>
        </div>

        <div className="form-field">
          <label>图片</label>
          <input type="file" accept="image/*" onChange={uploadNewPhoto} disabled={uploading} />
          {uploading && <span className="text-muted text-small"> 上传中...</span>}
          {photos.length > 0 && (
            <div className="photo-thumbs">
              {photos.map((url) => (
                <div key={url} className="photo-thumb">
                  <img src={url} alt="" />
                  <button onClick={() => removePhoto(url)} title="删除">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading} className="ghost">取消</button>
          <button onClick={handleSave} disabled={loading || uploading} className="primary">
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
