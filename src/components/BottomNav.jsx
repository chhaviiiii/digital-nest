import React from 'react';

const ACTIVE_COLOR   = '#b85c3a';
const INACTIVE_COLOR = '#999088';

const RoomIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const TaskIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShopIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 2L3 7v13a2 2 0 002 2h14a2 2 0 002-2V7l-3-5H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2" />
    <path d="M16 11a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const NoteIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="9"  x2="16" y2="9"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const EditIco = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M9.5 15.5l1-4 7-7 3 3-7 7-4 1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M14.5 6.5l3 3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const TABS = [
  { id: 'room',      Icon: RoomIco, label: 'Home'      },
  { id: 'tasks',     Icon: TaskIco, label: 'Tasks'     },
  { id: 'shop',      Icon: ShopIco, label: 'Shop'      },
  { id: 'note',      Icon: NoteIco, label: 'Note'      },
  { id: 'customize', Icon: EditIco, label: 'Customize' },
];

export function BottomNav({ active, onChange }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 82, background: 'rgba(255,252,248,0.96)', backdropFilter: 'blur(16px)', borderTop: '0.5px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 18, zIndex: 10 }}>
      {TABS.map(({ id, Icon, label }) => {
        const on = active === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px', outline: 'none' }}>
            <div style={{ color: on ? ACTIVE_COLOR : INACTIVE_COLOR, transition: 'color 0.18s' }}>
              <Icon />
            </div>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 9, fontWeight: on ? 800 : 600, color: on ? ACTIVE_COLOR : INACTIVE_COLOR, transition: 'color 0.18s' }}>
              {label}
            </span>
            <div style={{ width: on ? 4 : 0, height: 4, borderRadius: '50%', background: ACTIVE_COLOR, marginTop: 1, transition: 'width 0.2s' }} />
          </button>
        );
      })}
    </div>
  );
}
