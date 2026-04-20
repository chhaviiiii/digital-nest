import React from 'react';
import { P } from '../constants.js';
import { BlobAvatar } from '../components/RoomScene2D.jsx';

async function resizeImage(file, maxDim = 400) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.src = url;
  });
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Blob identity picker ──────────────────────────────────────
function BlobPicker({ avatarA, avatarB, onPick }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 32 }}>
      <div>
        <div style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 26, color: P.ink, textAlign: 'center', marginBottom: 8 }}>
          which one are you?
        </div>
        <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 13, color: P.muted, textAlign: 'center', fontWeight: 600 }}>
          pick your blob so notes show your name
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { blob: 'a', avatar: avatarA, fallback: 'Blob A' },
          { blob: 'b', avatar: avatarB, fallback: 'Blob B' },
        ].map(({ blob, avatar, fallback }) => (
          <div key={blob} onClick={() => onPick(blob)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, background: P.white, borderRadius: 22, padding: '22px 26px', boxShadow: '0 4px 18px rgba(0,0,0,0.09)', cursor: 'pointer', transition: 'transform 0.14s, box-shadow 0.14s', userSelect: 'none' }}
            onPointerEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.14)'; }}
            onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.09)'; }}>
            <BlobAvatar
              bodyColor={avatar?.bodyColor} blushColor={avatar?.blushColor}
              size={72} accessory={avatar?.accessory} />
            <span style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 15, color: P.ink }}>
              {avatar?.name || fallback}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Single history note card ──────────────────────────────────
function NoteCard({ note, avatarA, avatarB }) {
  const av     = note.authorBlob === 'a' ? avatarA : avatarB;
  const isLeft = note.authorBlob === 'a';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: isLeft ? 'flex-start' : 'flex-end' }}>
      {/* author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isLeft ? 'row' : 'row-reverse' }}>
        <BlobAvatar bodyColor={av?.bodyColor} blushColor={av?.blushColor} size={26} accessory={av?.accessory} />
        <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 11, fontWeight: 700, color: P.muted }}>
          {note.authorName || av?.name || 'you'} · {timeAgo(note.ts)}
        </span>
      </div>
      {/* note bubble */}
      {note.text && (
        <div style={{
          background: isLeft ? 'oklch(95% 0.09 86)' : 'oklch(94% 0.06 320)',
          borderRadius: isLeft ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          padding: '10px 14px', maxWidth: '82%',
          fontFamily: '"Nunito",sans-serif', fontSize: 13, fontWeight: 600,
          color: 'oklch(30% 0.05 50)', lineHeight: 1.55,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        }}>
          {note.text}
        </div>
      )}
      {/* photo */}
      {note.photo && (
        <div style={{ maxWidth: '82%', borderRadius: 14, overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}>
          <img src={note.photo} alt="" style={{ width: '100%', display: 'block', maxHeight: 220, objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────
export function NoteScreen({ notes = [], myBlob, avatarA, avatarB, onSave, onSetMyBlob }) {
  const myAvatar  = myBlob === 'a' ? avatarA : avatarB;
  const myName    = myAvatar?.name || (myBlob === 'a' ? 'you' : 'them');

  const [text,      setText]      = React.useState('');
  const [photo,     setPhoto]     = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef(null);

  // Blob identity not chosen yet → show picker
  if (!myBlob) {
    return <BlobPicker avatarA={avatarA} avatarB={avatarB} onPick={onSetMyBlob} />;
  }

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !photo) return;
    onSave({ text: trimmed, photo, authorBlob: myBlob, authorName: myName });
    setText('');
    setPhoto(null);
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try   { setPhoto(await resizeImage(file)); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const canSend = text.trim().length > 0 || photo !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: P.bg }}>

      {/* ── Identity bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px 10px', background: P.white, borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
        <BlobAvatar bodyColor={myAvatar?.bodyColor} blushColor={myAvatar?.blushColor} size={26} accessory={myAvatar?.accessory} />
        <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 12, fontWeight: 700, color: P.ink, flex: 1 }}>
          you're <span style={{ color: P.terra }}>{myName}</span>
        </span>
        <span onClick={() => onSetMyBlob(null)}
          style={{ fontFamily: '"Nunito",sans-serif', fontSize: 11, color: P.muted, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>
          change
        </span>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', flexDirection: 'column', gap: 18, padding: '18px 18px 32px' }}>

        {/* Compose card */}
        <div style={{ background: 'oklch(97% 0.09 86)', borderRadius: 18, boxShadow: '0 3px 14px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
          {/* text area */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`write something to your partner…`}
            style={{ width: '100%', minHeight: 90, background: 'transparent', border: 'none', outline: 'none', padding: '16px 16px 8px', fontFamily: '"Nunito",sans-serif', fontSize: 14, fontWeight: 600, color: 'oklch(30% 0.05 50)', lineHeight: 1.6, resize: 'none', boxSizing: 'border-box' }}
          />

          {/* photo preview or add button */}
          {photo ? (
            <div style={{ position: 'relative', margin: '0 12px 12px' }}>
              <img src={photo} alt="" style={{ width: '100%', borderRadius: 12, display: 'block', maxHeight: 180, objectFit: 'cover' }} />
              <button onClick={() => setPhoto(null)}
                style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()}
              style={{ margin: '0 12px 12px', height: 40, borderRadius: 12, border: '1.5px dashed oklch(80% 0.07 75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: 'rgba(255,255,255,0.5)' }}>
              {uploading
                ? <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 12, color: P.muted }}>uploading…</span>
                : <><span style={{ fontSize: 15 }}>📷</span><span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 12, fontWeight: 700, color: P.muted }}>add photo</span></>}
            </div>
          )}

          {/* from + send row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px 14px' }}>
            <div style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 12, color: 'oklch(50% 0.07 65)' }}>
              from {myName} 🌙
            </div>
            <button onClick={handleSend} disabled={!canSend}
              style={{ background: canSend ? 'oklch(58% 0.11 42)' : 'oklch(82% 0.04 50)', color: canSend ? 'white' : 'oklch(65% 0.04 50)', border: 'none', borderRadius: 20, padding: '7px 18px', fontFamily: '"Nunito",sans-serif', fontSize: 13, fontWeight: 800, cursor: canSend ? 'pointer' : 'default', transition: 'background 0.15s' }}>
              send 💌
            </button>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

        {/* ── History ── */}
        {notes.length > 0 && (
          <>
            <div style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 15, color: 'oklch(52% 0.07 52)', paddingLeft: 2 }}>
              past notes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {notes.map(note => (
                <NoteCard key={note.id} note={note} avatarA={avatarA} avatarB={avatarB} />
              ))}
            </div>
          </>
        )}

        {notes.length === 0 && (
          <div style={{ textAlign: 'center', fontFamily: '"Nunito",sans-serif', fontSize: 13, color: 'oklch(68% 0.04 50)', fontStyle: 'italic', paddingTop: 8 }}>
            no notes yet — send the first one 🌸
          </div>
        )}
      </div>
    </div>
  );
}
