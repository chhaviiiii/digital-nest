import React from 'react';
import { P } from '../constants.js';
import { generateRoomCode } from '../hooks/useRoom.js';
import { isFirebaseConfigured } from '../firebase.js';

export function OnboardingScreen({ onEnter }) {
  const [mode, setMode]     = React.useState(null); // null | 'join'
  const [code, setCode]     = React.useState('');
  const [created, setCreated] = React.useState(null);
  const [error, setError]   = React.useState('');

  const handleCreate = () => {
    const newCode = generateRoomCode();
    setCreated(newCode);
  };

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (trimmed.length < 4) { setError('Enter a valid invite code'); return; }
    onEnter(trimmed);
  };

  const btn = (label, onClick, accent = false) => (
    <button onClick={onClick} style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 0.2, background: accent ? P.terra : 'rgba(255,255,255,0.82)', color: accent ? 'white' : P.ink, boxShadow: accent ? '0 4px 18px rgba(184,92,58,0.28)' : '0 2px 10px rgba(0,0,0,0.07)', transition: 'all 0.15s' }}>
      {label}
    </button>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: 'oklch(95% 0.018 58)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px' }}>

      {/* logo */}
      <div style={{ marginBottom: 8 }}>
        <svg width="72" height="72" viewBox="-40 -40 80 80">
          <path d="M-10,-30 C0,-40 22,-30 22,-8 C22,16 8,28 -10,28 C-28,28 -38,14 -38,-8 C-38,-24 -26,-36 -10,-30Z" fill="oklch(78% 0.08 20)" />
          <path d="M8,-28 C20,-36 38,-22 36,-2 C34,18 18,30 2,28 C-16,26 -24,12 -20,-6 C-14,-20 -2,-22 8,-28Z" fill="oklch(60% 0.11 42)" opacity="0.9" />
          <ellipse cx="-24" cy="6" rx="6" ry="4" fill="oklch(82% 0.09 20)" opacity="0.55" />
          <ellipse cx="14"  cy="6" rx="6" ry="4" fill="oklch(80% 0.09 45)" opacity="0.55" />
        </svg>
      </div>
      <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 42, color: P.ink, letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>nestled</div>
      <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 600, color: P.muted, marginBottom: 48, textAlign: 'center' }}>your cozy shared space</div>

      {!isFirebaseConfigured && (
        <div style={{ background: 'oklch(96% 0.04 70)', border: '1px solid oklch(88% 0.06 70)', borderRadius: 12, padding: '10px 16px', marginBottom: 24, fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 600, color: 'oklch(44% 0.07 60)', textAlign: 'center', maxWidth: 300 }}>
          Running in local mode — add Firebase credentials to enable real-time sharing
        </div>
      )}

      {/* create flow */}
      {!created && mode !== 'join' && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {btn('Create a nest ✦', handleCreate, true)}
          {btn('Join a nest →', () => { setMode('join'); setError(''); })}
        </div>
      )}

      {/* after create: show code */}
      {created && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ background: P.white, borderRadius: 20, padding: '24px', width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>your invite code</div>
            <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 44, color: P.terra, letterSpacing: 6, lineHeight: 1 }}>{created}</div>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 600, color: P.muted, marginTop: 10 }}>Share this with your partner</div>
          </div>
          {btn('Enter our nest →', () => onEnter(created), true)}
          <button onClick={() => setCreated(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: P.muted }}>← Back</button>
        </div>
      )}

      {/* join flow */}
      {mode === 'join' && !created && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: P.white, borderRadius: 18, padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>invite code</div>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="XXXXXX"
              maxLength={8}
              autoFocus
              style={{ width: '100%', fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 32, letterSpacing: 6, color: P.ink, border: 'none', outline: 'none', background: 'transparent', textAlign: 'center' }}
            />
            {error && <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, color: '#d44', marginTop: 8, textAlign: 'center' }}>{error}</div>}
          </div>
          {btn('Join nest →', handleJoin, true)}
          <button onClick={() => { setMode(null); setError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: P.muted }}>← Back</button>
        </div>
      )}
    </div>
  );
}
