import React from 'react';
import { P } from '../constants.js';

export function ColorPicker({ label, value, presets, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, alignItems: 'center' }}>
        {presets.map(color => (
          <div
            key={color}
            onClick={() => onChange(color)}
            style={{ width: 32, height: 32, borderRadius: '50%', background: color, cursor: 'pointer', border: value === color ? `3px solid ${P.ink}` : '3px solid transparent', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.14)', transition: 'border 0.15s, transform 0.1s', transform: value === color ? 'scale(1.12)' : 'scale(1)' }}
          />
        ))}
        {/* custom color input */}
        <div style={{ position: 'relative', width: 32, height: 32 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)', border: '2px solid rgba(0,0,0,0.12)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, pointerEvents: 'none' }}>+</span>
          </div>
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', borderRadius: '50%' }}
          />
        </div>
      </div>
    </div>
  );
}
