export const HIDDEN_SPOT_NAMES = ['西岸美术馆大道', '武康大楼', '田子坊', '田子坊弄堂', '外滩源'];

export function filterVisibleSpots(spots) {
  return (spots || []).filter((s) => !HIDDEN_SPOT_NAMES.includes(s.name));
}
