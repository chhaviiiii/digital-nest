import React from 'react';
import { P } from '../constants.js';
import { BlobAvatar } from '../components/RoomScene2D.jsx';

export function NoteScreen({ note, onSave, avatarA, avatarB }) {
  const [editing, setEditing] = React.useState(false);
  const [draft,   setDraft]   = React.useState(note);

  React.useEffect(() => { setDraft(note); }, [note]);

  const commit = () => { onSave(draft); setEditing(false); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', background: P.bg }}>
      <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 26, color: P.ink, marginBottom: 28, textAlign: 'center' }}>sticky note</div>

      <div style={{ width: '100%', maxWidth: 310, aspectRatio: '1', background: 'oklch(95% 0.09 86)', borderRadius: 6, boxShadow: '3px 5px 18px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.07)', padding: '28px 22px 44px', position: 'relative', transform: 'rotate(-1.5deg)' }}>
        {/* fold corner */}
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, background: 'oklch(88% 0.09 82)', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
        {/* ruled lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ position: 'absolute', left: 22, right: 22, top: 64 + i * 28, height: 1, background: 'oklch(88% 0.06 82)', opacity: 0.6 }} />
        ))}

        {editing ? (
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            autoFocus
            style={{ position: 'relative', zIndex: 1, width: '100%', height: '80%', background: 'transparent', border: 'none', outline: 'none', fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 600, color: 'oklch(33% 0.07 65)', lineHeight: '28px', resize: 'none', letterSpacing: 0.2 }}
          />
        ) : (
          <div onClick={() => setEditing(true)}
            style={{ position: 'relative', zIndex: 1, fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 600, color: 'oklch(33% 0.07 65)', lineHeight: '28px', cursor: 'text', minHeight: 100, whiteSpace: 'pre-wrap' }}>
            {note || <span style={{ color: 'oklch(60% 0.05 65)', fontStyle: 'italic' }}>tap to write a note…</span>}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 14, left: 22, fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 13, color: 'oklch(50% 0.07 65)' }}>
          from {avatarA?.name || 'you'} 🌙
        </div>
      </div>

      {/* avatars */}
      <div style={{ display: 'flex', gap: 28, marginTop: 36, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.55 }}>
          <BlobAvatar bodyColor={avatarA?.bodyColor} blushColor={avatarA?.blushColor} size={44} />
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted }}>{avatarA?.name || 'you'}</span>
        </div>
        <span style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 18, color: 'oklch(75% 0.04 55)' }}>✦</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.55 }}>
          <BlobAvatar bodyColor={avatarB?.bodyColor} blushColor={avatarB?.blushColor} size={44} />
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: P.muted }}>{avatarB?.name || 'them'}</span>
        </div>
      </div>
    </div>
  );
}
