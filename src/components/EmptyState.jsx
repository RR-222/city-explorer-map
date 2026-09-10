import React from 'react';

export default function EmptyState({ title, description, children }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 4.25 5.5 11.5 7 13.5 1.5-2 7-9.25 7-13.5 0-3.87-3.13-7-7-7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 21l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="empty-title">{title}</p>
      {description && <p className="empty-desc">{description}</p>}
      {children && <div className="empty-action">{children}</div>}
    </div>
  );
}
