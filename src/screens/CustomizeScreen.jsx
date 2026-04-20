import React from 'react';
import { P, MOODS, WALL_PRESETS, FLOOR_PRESETS, ACCENT_PRESETS, BODY_COLORS, BLUSH_COLORS } from '../constants.js';
import { ColorPicker } from '../components/ColorPicker.jsx';
import { BlobAvatar } from '../components/RoomScene2D.jsx';

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 22, color: P.ink, letterSpacing: -0.3, marginBottom: 16, marginTop: 4 }}>
      {children}
    </div>
  );
}

function Swatch({ color, selected, onClick }) {
  return (
    <div onClick={onClick}
      style={{ width: 30, height: 30, borderRadius: '50%', background: color, border: selected ? `3px solid ${P.ink}` : '3px solid transparent', cursor: 'pointer', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(0,0,0,0.14)', transition: 'border 0.15s, transform 0.1s', transform: selected ? 'scale(1.12)' : 'scale(1)' }} />
  );
}

function PartnerCard({ which, avatar, onSave }) {
  const [bc,    setBc]    = React.useState(avatar?.bodyColor  || BODY_COLORS[0]);
  const [blush, setBlush] = React.useState(avatar?.blushColor || BLUSH_COLORS[0]);
  const [name,  setName]  = React.useState(avatar?.name || '');
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => { setBc(avatar?.bodyColor || BODY_COLORS[0]); setBlush(avatar?.blushColor || BLUSH_COLORS[0]); setName(avatar?.name || ''); setDirty(false); }, [avatar]);

  const change = (fn) => { fn(); setDirty(true); };

  return (
    <div style={{ background: P.white, borderRadius: 20, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <BlobAvatar bodyColor={bc} blushColor={blush} size={62} name={name || (which === 'a' ? 'Partner 1' : 'Partner 2')} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Name</div>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setDirty(true); }}
            placeholder={which === 'a' ? 'Partner 1' : 'Partner 2'}
            style={{ width: '100%', fontFamily: '"Nunito", sans-serif', fontSize: 14, padding: '8px 12px', background: 'oklch(95% 0.018 55)', border: 'none', borderRadius: 10, outline: 'none', color: P.ink, marginBottom: 12 }}
          />
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>Color</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
            {BODY_COLORS.map(c => <Swatch key={c} color={c} selected={bc === c} onClick={() => change(() => setBc(c))} />)}
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 7 }}>Cheeks</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {BLUSH_COLORS.map(c => <Swatch key={c} color={c} selected={blush === c} onClick={() => change(() => setBlush(c))} />)}
          </div>
        </div>
      </div>
      {dirty && (
        <button
          onClick={() => { onSave(which, { bodyColor: bc, blushColor: blush, name }); setDirty(false); }}
          style={{ marginTop: 14, width: '100%', background: P.terra, color: 'white', border: 'none', borderRadius: 14, padding: '12px', fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          Save {which === 'a' ? 'Partner 1' : 'Partner 2'}
        </button>
      )}
    </div>
  );
}

export function CustomizeScreen({ room, onUpdate, onLeaveRoom, roomCode, connStatus }) {
  const statusColors = { local: '#b8a090', connecting: '#e0a84a', connected: '#5aaa72', error: '#d05050' };
  const statusLabels = { local: 'Local only', connecting: 'Connecting…', connected: 'Synced live', error: 'Offline' };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 32 }}>
      <div style={{ padding: '68px 22px 16px', background: P.white, borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 30, color: P.ink, letterSpacing: -0.5, lineHeight: 1 }}>customize</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColors[connStatus] }} />
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: statusColors[connStatus] }}>{statusLabels[connStatus]}</span>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Room code chip */}
        {roomCode && (
          <div style={{ background: P.white, borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>room code</div>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 22, color: P.terra, letterSpacing: 4 }}>{roomCode}</div>
            </div>
            <span style={{ fontSize: 20 }}>🏠</span>
          </div>
        )}

        {/* Weather */}
        <SectionTitle>Weather</SectionTitle>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {Object.entries(MOODS).map(([k, m]) => (
            <div key={k} onClick={() => onUpdate({ mood: k })}
              style={{ flex: 1, padding: '10px 4px', borderRadius: 14, background: room.mood === k ? P.terra : P.white, cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 18 }}>{m.label}</div>
              <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: room.mood === k ? 'white' : P.muted, marginTop: 3 }}>{m.name}</div>
            </div>
          ))}
        </div>

        {/* Room colors */}
        <SectionTitle>Room Colors</SectionTitle>
        <div style={{ background: P.white, borderRadius: 20, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <ColorPicker label="Wall" value={room.wallColor}   presets={WALL_PRESETS}   onChange={v => onUpdate({ wallColor: v })} />
          <ColorPicker label="Floor" value={room.floorColor} presets={FLOOR_PRESETS}  onChange={v => onUpdate({ floorColor: v })} />
          <ColorPicker label="Accent" value={room.accentColor} presets={ACCENT_PRESETS} onChange={v => onUpdate({ accentColor: v })} />
        </div>

        {/* Blob customization */}
        <SectionTitle>Partners</SectionTitle>
        <PartnerCard which="a" avatar={room.avatarA} onSave={(w, data) => onUpdate({ avatarA: data })} />
        <PartnerCard which="b" avatar={room.avatarB} onSave={(w, data) => onUpdate({ avatarB: data })} />

        {/* Leave room */}
        <div style={{ marginTop: 12, padding: '20px 0 8px' }}>
          <button
            onClick={onLeaveRoom}
            style={{ width: '100%', background: 'transparent', color: 'oklch(50% 0.06 15)', border: '1.5px solid oklch(82% 0.04 15)', borderRadius: 16, padding: '14px', fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.2 }}>
            Leave room
          </button>
        </div>
      </div>
    </div>
  );
}
