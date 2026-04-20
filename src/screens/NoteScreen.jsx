import React from 'react';
import { P } from '../constants.js';
import { BlobAvatar } from '../components/RoomScene2D.jsx';

async function resizeImage(file, maxDim = 320) {
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

export function NoteScreen({ note, notePhoto, onSave, avatarA, avatarB }) {
  const [editing,  setEditing]  = React.useState(false);
  const [draft,    setDraft]    = React.useState(note);
  const [uploading,setUploading]= React.useState(false);
  const fileRef = React.useRef(null);

  React.useEffect(() => { setDraft(note); }, [note]);

  const commit = () => { onSave({ note: draft, notePhoto }); setEditing(false); };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const b64 = await resizeImage(file);
      onSave({ note, notePhoto: b64 });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = () => onSave({ note, notePhoto: null });

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px 40px', background: P.bg, gap: 20 }}>
      <div style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 26, color: P.ink, textAlign: 'center' }}>sticky note</div>

      {/* Note card */}
      <div style={{ width: '100%', maxWidth: 320, background: 'oklch(95% 0.09 86)', borderRadius: 6, boxShadow: '3px 5px 18px rgba(0,0,0,0.13)', padding: '24px 20px 40px', position: 'relative', transform: 'rotate(-1.5deg)', minHeight: 180 }}>
        {/* fold corner */}
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 38, height: 38, background: 'oklch(88% 0.09 82)', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
        {/* ruled lines */}
        {[0,1,2,3,4].map(i => <div key={i} style={{ position: 'absolute', left: 20, right: 20, top: 58 + i * 28, height: 1, background: 'oklch(88% 0.06 82)', opacity: 0.6 }} />)}

        {editing ? (
          <textarea value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} autoFocus
            style={{ position: 'relative', zIndex: 1, width: '100%', minHeight: 100, background: 'transparent', border: 'none', outline: 'none', fontFamily: '"Nunito",sans-serif', fontSize: 15, fontWeight: 600, color: 'oklch(33% 0.07 65)', lineHeight: '28px', resize: 'none', letterSpacing: 0.2 }} />
        ) : (
          <div onClick={() => setEditing(true)} style={{ position: 'relative', zIndex: 1, fontFamily: '"Nunito",sans-serif', fontSize: 15, fontWeight: 600, color: 'oklch(33% 0.07 65)', lineHeight: '28px', cursor: 'text', minHeight: 100, whiteSpace: 'pre-wrap' }}>
            {note || <span style={{ color: 'oklch(60% 0.05 65)', fontStyle: 'italic' }}>tap to write a note…</span>}
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 14, left: 20, fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 12, color: 'oklch(50% 0.07 65)' }}>
          from {avatarA?.name || 'you'} 🌙
        </div>
      </div>

      {/* Photo strip */}
      {notePhoto ? (
        <div style={{ width: '100%', maxWidth: 320, position: 'relative', borderRadius: 14, overflow: 'hidden', boxShadow: '0 3px 14px rgba(0,0,0,0.14)', transform: 'rotate(1deg)' }}>
          <img src={notePhoto} alt="shared photo" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 200 }} />
          <button onClick={removePhoto}
            style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
            ✕
          </button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()}
          style={{ width: '100%', maxWidth: 320, height: 72, borderRadius: 14, border: '1.5px dashed oklch(78% 0.06 60)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.6)', transition: 'background 0.15s' }}
          onPointerEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
          onPointerLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}>
          {uploading ? (
            <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 13, color: P.muted }}>uploading…</span>
          ) : (
            <>
              <span style={{ fontSize: 22 }}>📷</span>
              <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 13, fontWeight: 700, color: P.muted }}>Add a photo</span>
            </>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

      {/* avatars */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.55 }}>
          <BlobAvatar bodyColor={avatarA?.bodyColor} blushColor={avatarA?.blushColor} size={44} accessory={avatarA?.accessory} />
          <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, color: P.muted }}>{avatarA?.name || 'you'}</span>
        </div>
        <span style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 18, color: 'oklch(75% 0.04 55)' }}>✦</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.55 }}>
          <BlobAvatar bodyColor={avatarB?.bodyColor} blushColor={avatarB?.blushColor} size={44} accessory={avatarB?.accessory} />
          <span style={{ fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, color: P.muted }}>{avatarB?.name || 'them'}</span>
        </div>
      </div>
    </div>
  );
}
