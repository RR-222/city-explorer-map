import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddPlaceModal({ coords, onClose, onSaved }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const bucket = 'places-photos';

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!name) {
      alert('请填写名称');
      return;
    }
    setLoading(true);
    try {
      let photos = [];

      if (file) {
        // 生成不带前导斜杠的路径（必须）
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = filename; // 或 `places/${filename}` (不要以 '/' 开头)

        // 上传（注意检查返回的 error）
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from(bucket)
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        // 如果 bucket 是 public，getPublicUrl 返回 publicUrl
        const { data: publicData, error: publicError } = await supabase
          .storage
          .from(bucket)
          .getPublicUrl(path);

        if (publicError) {
          // 不终止：我们在这里记录并尝试使用 signed URL（见下）
          console.warn('getPublicUrl error', publicError);
        }

        let publicUrl = publicData?.publicUrl ?? publicData?.publicURL ?? '';

        // 如果没有 publicUrl（bucket 为 private），尝试生成 signed URL（需要后端 service_role 权限有时）
        if (!publicUrl) {
          const { data: signedData, error: signedErr } = await supabase
            .storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60); // 1 hour

          if (signedErr) {
            console.warn('createSignedUrl error', signedErr);
          } else {
            publicUrl = signedData?.signedUrl ?? signedData?.signedURL ?? '';
          }
        }

        if (!publicUrl) {
          throw new Error('无法获取图片访问 URL，请检查 bucket 权限或 storage policy');
        }

        photos.push(publicUrl);
      }

      // 获取当前登录用户并把 owner 设置为 user.id（避免 RLS 拒绝）
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.warn('getUser error', userError);
      }

      const owner = user?.id ?? null;

      // 插入 places 表（包含 owner 字段以满足 RLS 策略）
      const toInsert = {
        name,
        description,
        lat: coords.lat,
        lng: coords.lng,
        photos,
        owner,
        user_id: owner,
      };

      const { data: insertData, error: insertError } = await supabase
        .from('places')
        .insert(toInsert)
        .select()
        .single();

      if (insertError) throw insertError;

      onSaved && onSaved(insertData);
      onClose && onClose();
    } catch (err) {
      console.error('保存失败', err);
      alert('保存失败: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position:'fixed', left:0, right:0, top:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)', zIndex:9999 }}>
      <div style={{ width:400, background:'#fff', padding:16, borderRadius:8 }}>
        <h3>添加地点</h3>
        <div>坐标: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
        <div style={{ marginTop:8 }}>
          <label>名称（必填）</label><br />
          <input value={name} onChange={(e)=>setName(e.target.value)} style={{ width:'100%' }} />
        </div>
        <div style={{ marginTop:8 }}>
          <label>描述</label><br />
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{ width:'100%' }} />
        </div>
        <div style={{ marginTop:8 }}>
          <label>图片（可选）</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <img src={preview} alt="preview" style={{ width:'100%', marginTop:8 }} />}
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
          <button onClick={onClose} disabled={loading}>取消</button>
          <button onClick={handleSave} disabled={loading}>{loading ? '保存中...' : '保存'}</button>
        </div>
      </div>
    </div>
  );
}
