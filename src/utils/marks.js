// 想去 / 去过标记工具
// 依赖 Supabase 表 marks（supabase/marks-schema.sql），
// 用户未建表时返回 __error，页面据此降级提示。
import { supabase } from '../supabaseClient';

const keyOf = (type, targetKey) => `${type}:${targetKey}`;

/** 拉取当前用户全部标记：{ 'flower:梅花': 'wish', 'spot:古猗园': 'visited', ... } */
export async function fetchMarks(userId) {
  if (!userId) return {};
  const { data, error } = await supabase
    .from('marks')
    .select('target_type, target_key, status')
    .eq('user_id', userId);
  if (error) {
    console.error('fetchMarks error:', error?.message);
    return { __error: error };
  }
  const map = {};
  (data || []).forEach((m) => {
    map[keyOf(m.target_type, m.target_key)] = m.status;
  });
  return map;
}

/**
 * 设置 / 取消标记。
 * @param {string} userId
 * @param {'flower'|'spot'|'building'} type
 * @param {string} targetKey
 * @param {'wish'|'visited'|null} status 传 null 表示取消标记
 */
export async function setMark(userId, type, targetKey, status) {
  if (!userId) return { error: { message: '请先登录后再标记' } };
  if (!status) {
    const { error } = await supabase
      .from('marks')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', type)
      .eq('target_key', targetKey);
    return { error };
  }
  const { error } = await supabase.from('marks').upsert(
    {
      user_id: userId,
      target_type: type,
      target_key: targetKey,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,target_type,target_key' }
  );
  return { error };
}

export { keyOf };
