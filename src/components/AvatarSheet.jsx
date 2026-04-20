import React from 'react';
import { P, BODY_COLORS, BLUSH_COLORS } from '../constants.js';
import { BlobAvatar } from './RoomScene.jsx';

function Label({ children }) {
  return (
    <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>
      {children}
    </div>
  );
}

function Swatch({ color, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ width: 30, height: 30, borderRadius: '50%', background: color, border: selected ? `3px solid ${P.ink}` : '3px solid transparent', cursor: 'pointer', boxSizing: 'border-box', transition: 'border 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
  );
}

export function AvatarSheet({ which, avatar, onSave, onClose }) {
  const [bc,    setBc]    = React.useState(avatar?.bodyColor  || BODY_COLORS[0]);
  const [blush, setBlush] = React.useState(avatar?.blushColor || BLUSH_COLORS[0]);
  const [name,  setName]  = React.useState(avatar?.name || '');

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: P.white, borderRadius: '24px 24px 0 0', padding: '22px 20px 38px', animation: 'slideUp 0.28s ease-out' }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'oklch(83% 0.03 50)', margin: '0 auto 22px' }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
          {/* live preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <BlobAvatar bodyColor={bc} blushColor={blush} size={72} name={name || 'you'} />
          </div>

          {/* controls */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 14 }}>
              <Label>Name</Label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name…"
                style={{ width: '100%', fontFamily: '"Nunito", sans-serif', fontSize: 15, padding: '9px 13px', background: 'oklch(95% 0.018 55)', border: 'none', borderRadius: 12, outline: 'none', color: P.ink }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Label>Color</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BODY_COLORS.map(c => <Swatch key={c} color={c} selected={bc === c} onClick={() => setBc(c)} />)}
              </div>
            </div>
            <div>
              <Label>Cheeks</Label>
              <div style={{ display: 'flex', gap: 8 }}>
                {BLUSH_COLORS.map(c => <Swatch key={c} color={c} selected={blush === c} onClick={() => setBlush(c)} />)}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { onSave(which, { bodyColor: bc, blushColor: blush, name }); onClose(); }}
          style={{ width: '100%', background: P.terra, color: 'white', border: 'none', borderRadius: 16, padding: '15px', fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.2 }}>
          Save
        </button>
      </div>
    </div>
  );
}
