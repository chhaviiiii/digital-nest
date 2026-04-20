import React from 'react';
import { P, MOODS, WALL_OPTS, FLOOR_OPTS } from '../constants.js';

function Label({ children }) {
  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>
      {children}
    </div>
  );
}

function Dot({ color, selected, onClick }) {
  return (
    <div onClick={onClick} title={color}
      style={{ width: 26, height: 26, borderRadius: '50%', background: color, border: selected ? `3px solid ${P.ink}` : '3px solid transparent', cursor: 'pointer', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.12)', transition: 'border 0.15s' }} />
  );
}

export function TweaksPanel({ tweaks, onChange, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, background: 'white', borderRadius: 18, boxShadow: '0 8px 40px rgba(0,0,0,0.14)', padding: '20px 20px 22px', width: 236, fontFamily: '"Nunito", sans-serif' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: P.ink, marginBottom: 16 }}>Tweaks</div>

      <Label>Mood</Label>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {Object.entries(MOODS).map(([k, m]) => (
          <div key={k} onClick={() => onChange('mood', k)}
            style={{ flex: 1, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: tweaks.mood === k ? P.terra : 'oklch(94% 0.02 55)', cursor: 'pointer', fontSize: 16, transition: 'all 0.15s' }}>
            {m.label}
          </div>
        ))}
      </div>

      <Label>Wall Color</Label>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        {WALL_OPTS.map(o => <Dot key={o.v} color={o.v} selected={tweaks.wallColor === o.v} onClick={() => onChange('wallColor', o.v)} />)}
      </div>

      <Label>Floor</Label>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {FLOOR_OPTS.map(o => <Dot key={o.v} color={o.v} selected={tweaks.floorColor === o.v} onClick={() => onChange('floorColor', o.v)} />)}
      </div>
    </div>
  );
}
