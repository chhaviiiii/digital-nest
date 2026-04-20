import React from 'react';
import { MOODS } from '../constants.js';

export function BlobAvatar({ bodyColor = 'oklch(60% 0.11 42)', blushColor = 'oklch(82% 0.09 20)', size = 72, name = '', flip = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <svg width={size} height={size} viewBox="-40 -40 80 80" style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible' }}>
        <path d="M0,-36 C22,-36 38,-18 38,2 C38,24 22,38 0,38 C-22,38 -38,24 -38,2 C-38,-18 -22,-36 0,-36Z" fill={bodyColor} />
        <ellipse cx="-19" cy="9" rx="8" ry="5.5" fill={blushColor} opacity="0.55" />
        <ellipse cx="19"  cy="9" rx="8" ry="5.5" fill={blushColor} opacity="0.55" />
        <circle cx="-12" cy="-4" r="7" fill="white" />
        <circle cx="12"  cy="-4" r="7" fill="white" />
        <circle cx="-11" cy="-3" r="4" fill="oklch(18% 0.03 40)" />
        <circle cx="13"  cy="-3" r="4" fill="oklch(18% 0.03 40)" />
        <circle cx="-9"  cy="-5" r="1.8" fill="white" />
        <circle cx="15"  cy="-5" r="1.8" fill="white" />
        <path d="M-9,14 Q0,20 9,14" stroke="oklch(30% 0.04 40)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35" />
      </svg>
      {name && (
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700, color: 'oklch(40% 0.06 50)', letterSpacing: 0.3 }}>
          {name}
        </div>
      )}
    </div>
  );
}

function SkyView({ mood, width, height }) {
  const m = MOODS[mood] || MOODS.golden;
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: `linear-gradient(to bottom, ${m.skyA}, ${m.skyB})` }}>
      {mood === 'golden' && <>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, oklch(80% 0.15 72), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '22%', right: '20%', width: 28, height: 28, borderRadius: '50%', background: 'oklch(91% 0.16 82)', boxShadow: '0 0 18px 6px oklch(86% 0.18 78)' }} />
        <div style={{ position: 'absolute', top: '16%', left: '6%' }}>
          <div style={{ width: 50, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.72)' }} />
          <div style={{ width: 30, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.72)', marginTop: -10, marginLeft: 10 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: '6%' }}>
          <div style={{ width: 6, height: 26, background: 'oklch(27% 0.09 118)', margin: '0 auto' }} />
          <div style={{ width: 30, height: 36, borderRadius: '50% 50% 36% 36%', background: 'oklch(31% 0.11 130)', marginTop: -18, marginLeft: -12 }} />
        </div>
      </>}
      {mood === 'rainy' && <>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${8 + i * 17}%`, left: `${i * 30 - 4}%`, width: 75, height: 22, borderRadius: 11, background: 'rgba(168,184,212,0.88)' }} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', top: 0, left: `${(i * 7.3) % 100}%`, width: 1, height: 10, background: 'rgba(180,208,240,0.7)', animation: `rainDrop ${0.54 + (i % 3) * 0.18}s linear ${i * 0.09}s infinite` }} />
        ))}
      </>}
      {mood === 'night' && <>
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(i * 43 + 11) % 88 + 4}%`, top: `${(i * 23 + 9) % 65 + 4}%`, width: 1 + (i % 3) * 0.6, height: 1 + (i % 3) * 0.6, borderRadius: '50%', background: 'white', opacity: 0.35 + (i % 3) * 0.25 }} />
        ))}
        <div style={{ position: 'absolute', top: '12%', right: '16%', width: 26, height: 26, borderRadius: '50%', background: 'oklch(93% 0.04 75)', boxShadow: '0 0 10px 3px oklch(88% 0.07 78)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: 22, height: 22, borderRadius: '50%', background: MOODS.night.skyA }} />
      </>}
    </div>
  );
}

function RoomWindow({ mood, x, y, w = 210, h = 185 }) {
  const frame = 'oklch(56% 0.07 56)';
  const frameLight = 'oklch(64% 0.08 60)';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 8, border: `10px solid ${frame}`, boxShadow: `inset 0 0 0 3px ${frameLight}, 0 6px 20px rgba(0,0,0,0.16)`, overflow: 'hidden', zIndex: 2 }}>
      <SkyView mood={mood} width={w - 20} height={h - 20} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 4, background: frame, transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '44%', height: 4, background: frame }} />
      </div>
    </div>
  );
}

function PlantDecor({ x, bottom }) {
  return (
    <div style={{ position: 'absolute', left: x, bottom, pointerEvents: 'none' }}>
      <svg width="52" height="76" viewBox="0 0 52 76">
        <path d="M16,54 L13,76 L39,76 L36,54Z" fill="oklch(54% 0.10 44)" />
        <rect x="12" y="50" width="28" height="7" rx="3.5" fill="oklch(60% 0.11 46)" />
        <ellipse cx="26" cy="50" rx="12" ry="4" fill="oklch(33% 0.06 42)" />
        <path d="M26,50 C26,36 26,20 26,10" stroke="oklch(42% 0.11 135)" strokeWidth="2.5" fill="none" />
        <path d="M26,40 C16,30 6,34 10,22 C18,30 22,36 26,40" fill="oklch(55% 0.13 145)" />
        <path d="M26,32 C36,22 46,26 42,14 C34,22 30,28 26,32" fill="oklch(60% 0.14 140)" />
        <path d="M26,23 C18,15 16,5 24,3 C24,12 24,18 26,23" fill="oklch(57% 0.12 148)" />
        <path d="M26,23 C34,15 36,5 28,3 C28,12 28,18 26,23" fill="oklch(53% 0.13 143)" />
      </svg>
    </div>
  );
}

function LampDecor({ right, bottom, glowing = false }) {
  return (
    <div style={{ position: 'absolute', right, bottom, pointerEvents: 'none' }}>
      {glowing && <div style={{ position: 'absolute', top: 10, left: -22, width: 68, height: 68, borderRadius: '50%', background: 'oklch(95% 0.14 78)', filter: 'blur(18px)', opacity: 0.55 }} />}
      <svg width="44" height="112" viewBox="0 0 44 112">
        <path d="M7,28 L37,28 L30,5 L14,5Z" fill="oklch(74% 0.09 58)" />
        <path d="M7,28 L37,28 L34,25 L10,25Z" fill="oklch(64% 0.08 53)" />
        {glowing && <ellipse cx="22" cy="30" rx="18" ry="7" fill="oklch(96% 0.14 80)" opacity="0.5" />}
        <circle cx="22" cy="22" r="5" fill={glowing ? 'oklch(96% 0.18 80)' : 'oklch(74% 0.06 70)'} />
        <rect x="20" y="28" width="4" height="72" rx="2" fill="oklch(43% 0.04 52)" />
        <ellipse cx="22" cy="102" rx="14" ry="5" fill="oklch(37% 0.04 50)" />
        <ellipse cx="22" cy="100" rx="14" ry="5" fill="oklch(45% 0.05 52)" />
      </svg>
    </div>
  );
}

function CatDecor({ left, bottom }) {
  const c = 'oklch(64% 0.08 56)';
  return (
    <div style={{ position: 'absolute', left, bottom, pointerEvents: 'none' }}>
      <svg width="50" height="42" viewBox="0 0 50 42">
        <ellipse cx="25" cy="30" rx="21" ry="13" fill={c} />
        <ellipse cx="25" cy="18" rx="14" ry="13" fill={c} />
        <polygon points="13,11 9,2 18,9" fill={c} />
        <polygon points="37,11 41,2 32,9" fill={c} />
        <polygon points="14,10 11,3 18,9" fill="oklch(83% 0.07 22)" />
        <polygon points="36,10 39,3 32,9" fill="oklch(83% 0.07 22)" />
        <ellipse cx="20" cy="18" rx="3.8" ry="4.2" fill="oklch(13% 0.03 40)" />
        <ellipse cx="30" cy="18" rx="3.8" ry="4.2" fill="oklch(13% 0.03 40)" />
        <circle cx="21" cy="16.5" r="1.4" fill="white" />
        <circle cx="31" cy="16.5" r="1.4" fill="white" />
        <polygon points="25,22 23,24.5 27,24.5" fill="oklch(70% 0.09 18)" />
        <line x1="8" y1="21" x2="19" y2="22" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="8" y1="24" x2="19" y2="23" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="42" y1="21" x2="31" y2="22" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="42" y1="24" x2="31" y2="23" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <path d="M44,34 Q54,24 48,16 Q46,26 42,30" fill={c} />
      </svg>
    </div>
  );
}

export function RoomScene({ mood = 'golden', wallColor, floorColor, avatarA, avatarB, items = [], coins = 0, onMoodChange, onAvatarTap, noteText }) {
  const wc = wallColor || 'oklch(93% 0.022 55)';
  const fc = floorColor || 'oklch(65% 0.08 54)';
  const m = MOODS[mood] || MOODS.golden;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* back wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '38%', background: wc }}>
        <div style={{ position: 'absolute', inset: 0, background: m.wallLight, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'rgba(0,0,0,0.04)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 16, background: 'rgba(0,0,0,0.045)', borderTop: '1.5px solid rgba(0,0,0,0.06)' }} />
      </div>

      {/* floor */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '61%', background: fc }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * 52 + 18, height: 1, background: 'rgba(0,0,0,0.05)' }} />
        ))}
      </div>

      {/* wall→floor shadow */}
      <div style={{ position: 'absolute', top: '61%', left: 0, right: 0, height: 28, background: 'linear-gradient(to bottom, rgba(0,0,0,0.09), transparent)', pointerEvents: 'none' }} />

      {/* window */}
      <RoomWindow mood={mood} x={91} y={60} w={211} h={186} />

      {/* window light spill */}
      <div style={{ position: 'absolute', bottom: '38%', left: '20%', width: '60%', height: 80, background: mood === 'night' ? 'rgba(255,210,130,0.09)' : 'rgba(255,228,148,0.12)', filter: 'blur(20px)', pointerEvents: 'none' }} />

      {/* night lamp glow */}
      {mood === 'night' && (
        <div style={{ position: 'absolute', bottom: '36%', right: 14, width: 110, height: 140, background: 'radial-gradient(ellipse at 80% 55%, oklch(92% 0.14 76), transparent 70%)', opacity: 0.38, pointerEvents: 'none' }} />
      )}

      <PlantDecor x={12} bottom={190} />
      <LampDecor right={16} bottom={188} glowing={mood === 'night'} />

      {/* rug */}
      <div style={{ position: 'absolute', bottom: 108, left: '50%', transform: 'translateX(-50%)', width: 230, height: 68, borderRadius: 34, background: 'oklch(69% 0.09 28)', boxShadow: '0 4px 14px rgba(0,0,0,0.14)' }}>
        <div style={{ position: 'absolute', inset: 9, borderRadius: 25, border: '2.5px solid oklch(78% 0.08 32)' }} />
        <div style={{ position: 'absolute', inset: 18, borderRadius: 16, border: '1.5px dashed oklch(80% 0.07 36)' }} />
      </div>

      {items.includes('cat') && <CatDecor left={34} bottom={116} />}

      {/* avatars */}
      <div style={{ position: 'absolute', bottom: 106, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => onAvatarTap?.('a')}>
          <BlobAvatar bodyColor={avatarA?.bodyColor} blushColor={avatarA?.blushColor} size={68} name={avatarA?.name} />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => onAvatarTap?.('b')}>
          <BlobAvatar bodyColor={avatarB?.bodyColor} blushColor={avatarB?.blushColor} size={68} name={avatarB?.name} flip />
        </div>
      </div>

      {/* sticky note peek */}
      <div style={{ position: 'absolute', bottom: 190, right: 12, width: 70, height: 70, background: 'oklch(95% 0.09 86)', borderRadius: 5, boxShadow: '2px 3px 10px rgba(0,0,0,0.14)', transform: 'rotate(4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, cursor: 'pointer', zIndex: 3 }}>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 8.5, color: 'oklch(38% 0.08 65)', lineHeight: 1.45, textAlign: 'center' }}>
          {noteText || "can't wait to see you 🌙"}
        </div>
      </div>

      {/* coin pill */}
      <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 5 }}>
        <span style={{ fontSize: 14 }}>🪙</span>
        <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 14, color: 'oklch(40% 0.09 55)' }}>{coins}</span>
      </div>

      {/* mood toggle */}
      <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 8px', display: 'flex', gap: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 5 }}>
        {Object.entries(MOODS).map(([key, md]) => (
          <div key={key} onClick={() => onMoodChange?.(key)}
            style={{ fontSize: 13, padding: '2px 5px', borderRadius: 12, cursor: 'pointer', background: mood === key ? 'rgba(0,0,0,0.09)' : 'transparent', transition: 'background 0.15s' }}>
            {md.label}
          </div>
        ))}
      </div>

      {/* tap hint */}
      <div style={{ position: 'absolute', bottom: 84, left: 0, right: 0, textAlign: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 10, color: 'rgba(80,60,40,0.35)', letterSpacing: 0.5, fontWeight: 600, pointerEvents: 'none' }}>
        tap a blob to customize
      </div>
    </div>
  );
}
