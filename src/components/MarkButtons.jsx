import React from 'react';
import { keyOf } from '../utils/marks';

/**
 * 想去 / 去过 标记按钮。
 * @param {object} props
 * @param {'flower'|'spot'|'building'} props.type
 * @param {string} props.targetKey
 * @param {object} props.marks fetchMarks 返回的标记映射
 * @param {(key: string, status: 'wish'|'visited'|null) => void} props.onChange
 * @param {() => void} props.onRequireLogin 未登录时触发
 */
export default function MarkButtons({ type, targetKey, marks, onChange, onRequireLogin }) {
  const status = marks ? marks[keyOf(type, targetKey)] : undefined;

  const handleClick = (next) => {
    if (!onRequireLogin || !onChange) return;
    onChange(keyOf(type, targetKey), status === next ? null : next);
  };

  return (
    <div className="mark-buttons">
      <button
        type="button"
        className={`mark-btn wish ${status === 'wish' ? 'active' : ''}`}
        onClick={() => handleClick('wish')}
      >
        {status === 'wish' ? '✓ 已想去' : '☆ 想去'}
      </button>
      <button
        type="button"
        className={`mark-btn visited ${status === 'visited' ? 'active' : ''}`}
        onClick={() => handleClick('visited')}
      >
        {status === 'visited' ? '✓ 已去过' : '✓ 去过'}
      </button>
    </div>
  );
}
