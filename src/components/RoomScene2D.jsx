import React from 'react';
import { MOODS, CAT_COLORS, PING_MESSAGES, FURNITURE_COLORS } from '../constants.js';

const DRAG_THRESHOLD = 6;

// ── Draggable wrapper ────────────────────────────────────────
function DraggableDecor({ itemId, pos, onMove, onTap, roomRef, zBase = 0, children }) {
  const [livePos, setLivePos] = React.useState(pos);
  const [dragging, setDragging] = React.useState(false);
  const startRef   = React.useRef(null);
  const didDragRef = React.useRef(false);

  React.useEffect(() => {
    if (!dragging) setLivePos(pos);
  }, [pos.x, pos.y, dragging]); // eslint-disable-line

  const onPointerDown = (e) => {
    e.stopPropagation();
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return;
    startRef.current   = { cx: e.clientX, cy: e.clientY, px: livePos.x, py: livePos.y, rect };
    didDragRef.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!startRef.current) return;
    const { cx, cy, px, py, rect } = startRef.current;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) didDragRef.current = true;
    if (!didDragRef.current) return;
    setLivePos({
      x: Math.max(0, Math.min(88, px + (dx / rect.width)  * 100)),
      y: Math.max(4, Math.min(86, py + (dy / rect.height) * 100)),
    });
  };
  const onPointerUp = (e) => {
    if (!startRef.current) return;
    if (didDragRef.current) { onMove?.(itemId, { ...livePos }); e.stopPropagation(); }
    else onTap?.();
    setDragging(false); startRef.current = null;
  };

  return (
    <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      style={{ position: 'absolute', left: `${livePos.x}%`, top: `${livePos.y}%`,
        cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none',
        zIndex: dragging ? 200 : zBase + Math.round(livePos.y) + 4,
        transform: dragging ? 'scale(1.12) rotate(-3deg)' : 'scale(1)',
        filter: dragging ? 'drop-shadow(0 10px 18px rgba(0,0,0,0.28))' : 'none',
        transition: dragging ? 'none' : 'transform 0.2s, filter 0.2s',
      }}>
      {children}
    </div>
  );
}

// ── Accessory SVG (rendered inside blob SVG) ─────────────────
function AccessorySVG({ id }) {
  if (!id || id === 'none') return null;
  if (id === 'crown') return (
    <>
      <path d="M-13,-36 L-16,-47 L-7,-41 L0,-49 L7,-41 L16,-47 L13,-36 Z"
        fill="oklch(86% 0.17 82)" stroke="oklch(70% 0.14 78)" strokeWidth="0.8"/>
      <circle cx="-7"  cy="-41" r="1.9" fill="oklch(66% 0.18 15)"/>
      <circle cx="0"   cy="-45" r="2.2" fill="oklch(66% 0.16 270)"/>
      <circle cx="7"   cy="-41" r="1.9" fill="oklch(66% 0.18 15)"/>
    </>
  );
  if (id === 'bow') return (
    <>
      <path d="M0,-40 Q-7,-37 -14,-42 Q-10,-51 -2,-47 Z" fill="oklch(78% 0.13 18)"/>
      <path d="M0,-40 Q7,-37 14,-42 Q10,-51 2,-47 Z"     fill="oklch(78% 0.13 18)"/>
      <circle cx="0" cy="-43" r="3.8" fill="oklch(70% 0.14 18)"/>
    </>
  );
  if (id === 'halo') return (
    <ellipse cx="0" cy="-44" rx="16" ry="5" fill="none"
      stroke="oklch(88% 0.18 84)" strokeWidth="3" opacity="0.88"/>
  );
  if (id === 'flower') return (
    <>
      {[0,72,144,216,288].map(deg => {
        const r = (deg * Math.PI) / 180;
        return (
          <ellipse key={deg} cx={Math.sin(r) * 8} cy={-43 - Math.cos(r) * 8}
            rx="4.5" ry="6"
            fill="oklch(82% 0.11 340)" opacity="0.88"
            transform={`rotate(${deg}, 0, -43)`}/>
        );
      })}
      <circle cx="0" cy="-43" r="5" fill="oklch(88% 0.16 82)"/>
    </>
  );
  return null;
}

// ── Blob avatar ──────────────────────────────────────────────
export function BlobAvatar({
  bodyColor  = 'oklch(60% 0.11 42)',
  blushColor = 'oklch(82% 0.09 20)',
  size       = 72,
  name       = '',
  flip       = false,
  bouncing   = false,
  floatAnim  = 'blobFloat',
  sleeping   = false,
  pinged     = false,
  accessory  = 'none',
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
      {sleeping && (
        <div style={{ position: 'absolute', top: -6, right: -8, pointerEvents: 'none', zIndex: 5 }}>
          {['z','z','Z'].map((z, i) => (
            <span key={i} style={{ display: 'block', fontFamily: '"Nunito",sans-serif', fontWeight: 900, fontSize: 7 + i * 3, color: 'oklch(55% 0.08 250)', opacity: 0, animation: `zzzFloat 2.2s ease-in-out ${i * 0.65}s infinite`, lineHeight: 1 }}>{z}</span>
          ))}
        </div>
      )}
      {pinged && (
        <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 18, animation: 'pingHeart 1.2s ease-out forwards', pointerEvents: 'none', zIndex: 10 }}>💕</div>
      )}
      <div style={{
        animation: bouncing
          ? 'blobBounce 0.72s cubic-bezier(0.36,0.07,0.19,0.97) forwards'
          : `${floatAnim} ${floatAnim === 'blobFloat' ? '3.2s' : '3.8s'} ease-in-out infinite`,
        transformOrigin: 'bottom center', willChange: 'transform',
      }}>
        <svg width={size} height={size} viewBox="-40 -40 80 80"
          style={{ transform: flip ? 'scaleX(-1)' : 'none', overflow: 'visible', display: 'block' }}>
          <AccessorySVG id={accessory} />
          <path d="M0,-36 C22,-36 38,-18 38,2 C38,24 22,38 0,38 C-22,38 -38,24 -38,2 C-38,-18 -22,-36 0,-36Z" fill={bodyColor} />
          <ellipse cx="-19" cy="9" rx="8"  ry="5.5" fill={blushColor} opacity="0.55" />
          <ellipse cx="19"  cy="9" rx="8"  ry="5.5" fill={blushColor} opacity="0.55" />
          {sleeping ? (
            <>
              <path d="M-17,-4 Q-12,-10 -7,-4" stroke="oklch(18% 0.03 40)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M7,-4 Q12,-10 17,-4"    stroke="oklch(18% 0.03 40)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <line x1="-17" y1="-4" x2="-20" y2="-7" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-12" y1="-7" x2="-12" y2="-10" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-7"  y1="-4" x2="-4"  y2="-7" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7"   y1="-4" x2="4"   y2="-7" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12"  y1="-7" x2="12"  y2="-10" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="17"  y1="-4" x2="20"  y2="-7" stroke="oklch(18% 0.03 40)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-7,15 Q0,19 7,15" stroke="oklch(30% 0.04 40)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
            </>
          ) : (
            <>
              <circle cx="-12" cy="-4" r="7" fill="white" />
              <circle cx="12"  cy="-4" r="7" fill="white" />
              <circle cx="-11" cy="-3" r="4" fill="oklch(18% 0.03 40)" />
              <circle cx="13"  cy="-3" r="4" fill="oklch(18% 0.03 40)" />
              <circle cx="-9"  cy="-5" r="1.8" fill="white" />
              <circle cx="15"  cy="-5" r="1.8" fill="white" />
              <path d="M-9,14 Q0,20 9,14" stroke="oklch(30% 0.04 40)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35" />
            </>
          )}
        </svg>
      </div>
      {name && (
        <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, color: 'oklch(40% 0.06 50)', letterSpacing: 0.3 }}>
          {name}{sleeping ? ' 💤' : ''}
        </div>
      )}
    </div>
  );
}

// ── Weather sky ──────────────────────────────────────────────
function SkyView({ mood, width, height }) {
  const m = MOODS[mood] || MOODS.golden;
  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', background: `linear-gradient(to bottom, ${m.skyA}, ${m.skyB})` }}>
      {mood === 'golden' && <>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, oklch(80% 0.15 72), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '22%', right: '20%', width: 28, height: 28, borderRadius: '50%', background: 'oklch(91% 0.16 82)', boxShadow: '0 0 18px 6px oklch(86% 0.18 78)' }} />
        <div style={{ position: 'absolute', top: '14%', left: '8%' }}>
          <div style={{ width: 48, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.76)' }} />
          <div style={{ width: 28, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.76)', marginTop: -10, marginLeft: 10 }} />
        </div>
      </>}
      {mood === 'cloudy' && <>
        {[0,1,2].map(i => <div key={i} style={{ position: 'absolute', top: `${10+i*18}%`, left: `${i*28-5}%`, width: 70, height: 24, borderRadius: 12, background: 'rgba(200,210,228,0.92)' }} />)}
        <div style={{ position: 'absolute', top: '8%', right: '10%', width: 52, height: 22, borderRadius: 11, background: 'rgba(215,222,235,0.88)' }} />
      </>}
      {mood === 'rainy' && <>
        {[0,1,2].map(i => <div key={i} style={{ position: 'absolute', top: `${8+i*17}%`, left: `${i*30-4}%`, width: 75, height: 22, borderRadius: 11, background: 'rgba(168,184,212,0.88)' }} />)}
        {Array.from({length:14}).map((_,i) => <div key={i} style={{ position: 'absolute', top: 0, left: `${(i*7.3)%100}%`, width: 1, height: 10, background: 'rgba(180,208,240,0.7)', animation: `rainDrop ${0.54+(i%3)*0.18}s linear ${i*0.09}s infinite` }} />)}
      </>}
      {mood === 'night' && <>
        {Array.from({length:22}).map((_,i) => <div key={i} style={{ position: 'absolute', left: `${(i*43+11)%88+4}%`, top: `${(i*23+9)%65+4}%`, width: 1+(i%3)*0.6, height: 1+(i%3)*0.6, borderRadius: '50%', background: 'white', opacity: 0.35+(i%3)*0.25 }} />)}
        <div style={{ position: 'absolute', top: '12%', right: '16%', width: 26, height: 26, borderRadius: '50%', background: 'oklch(93% 0.04 75)', boxShadow: '0 0 10px 3px oklch(88% 0.07 78)' }} />
        <div style={{ position: 'absolute', top: '10%', right: '20%', width: 22, height: 22, borderRadius: '50%', background: MOODS.night.skyA }} />
      </>}
    </div>
  );
}

// ── Window ───────────────────────────────────────────────────
function RoomWindow({ mood, x, y, w = 200, h = 170 }) {
  const frame = 'oklch(56% 0.07 56)', frameLight = 'oklch(64% 0.08 60)';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 8, border: `10px solid ${frame}`, boxShadow: `inset 0 0 0 3px ${frameLight}, 0 6px 20px rgba(0,0,0,0.16)`, overflow: 'hidden', zIndex: 2 }}>
      <SkyView mood={mood} width={w-20} height={h-20} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 4, background: frame, transform: 'translateX(-50%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: '44%', height: 4, background: frame }} />
      </div>
    </div>
  );
}

// ── Decor SVG components ─────────────────────────────────────
function PlantSVG() {
  return (
    <svg width="52" height="76" viewBox="0 0 52 76">
      <path d="M16,54 L13,76 L39,76 L36,54Z" fill="oklch(54% 0.10 44)" />
      <rect x="12" y="50" width="28" height="7" rx="3.5" fill="oklch(60% 0.11 46)" />
      <path d="M26,50 C26,36 26,20 26,10" stroke="oklch(42% 0.11 135)" strokeWidth="2.5" fill="none" />
      <path d="M26,40 C16,30 6,34 10,22 C18,30 22,36 26,40" fill="oklch(55% 0.13 145)" />
      <path d="M26,32 C36,22 46,26 42,14 C34,22 30,28 26,32" fill="oklch(60% 0.14 140)" />
      <path d="M26,23 C18,15 16,5 24,3 C24,12 24,18 26,23" fill="oklch(57% 0.12 148)" />
      <path d="M26,23 C34,15 36,5 28,3 C28,12 28,18 26,23" fill="oklch(53% 0.13 143)" />
    </svg>
  );
}
function CactusSVG() {
  return (
    <svg width="40" height="64" viewBox="0 0 40 64">
      <rect x="7"  y="48" width="26" height="10" rx="5" fill="oklch(58% 0.10 46)" />
      <rect x="15" y="10" width="10" height="42" rx="5" fill="oklch(55% 0.13 145)" />
      <rect x="5"  y="22" width="15" height="8"  rx="4" fill="oklch(55% 0.13 145)" />
      <rect x="2"  y="16" width="8"  height="14" rx="4" fill="oklch(55% 0.13 145)" />
      <rect x="25" y="28" width="12" height="8"  rx="4" fill="oklch(55% 0.13 145)" />
      <rect x="30" y="22" width="8"  height="14" rx="4" fill="oklch(55% 0.13 145)" />
      {[14,18,22,26,30,34].map(y => <circle key={y} cx="20" cy={y} r="1" fill="oklch(78% 0.08 145)" />)}
    </svg>
  );
}
function LampSVG({ glowing = false }) {
  return (
    <div style={{ position: 'relative' }}>
      {glowing && <div style={{ position: 'absolute', top: 10, left: -22, width: 68, height: 68, borderRadius: '50%', background: 'oklch(95% 0.14 78)', filter: 'blur(18px)', opacity: 0.55, pointerEvents: 'none' }} />}
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
function CatSVG({ bodyColor, wiggling }) {
  const c = bodyColor || CAT_COLORS[0];
  const innerEar = 'oklch(83% 0.07 22)';
  const catName = ['Sandy','Ginger','Grey','Midnight','Cream'][CAT_COLORS.indexOf(c)] ?? '';
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      <svg width="50" height="42" viewBox="0 0 50 42" style={{ animation: wiggling ? 'catWiggle 0.55s cubic-bezier(0.36,0.07,0.19,0.97) forwards' : 'none', transformOrigin: 'bottom center', willChange: 'transform', display: 'block' }}>
        <ellipse cx="25" cy="30" rx="21" ry="13" fill={c} />
        <ellipse cx="25" cy="18" rx="14" ry="13" fill={c} />
        <polygon points="13,11 9,2 18,9"  fill={c} /><polygon points="37,11 41,2 32,9"  fill={c} />
        <polygon points="14,10 11,3 18,9" fill={innerEar} /><polygon points="36,10 39,3 32,9" fill={innerEar} />
        <ellipse cx="20" cy="18" rx="3.8" ry="4.2" fill="oklch(13% 0.03 40)" />
        <ellipse cx="30" cy="18" rx="3.8" ry="4.2" fill="oklch(13% 0.03 40)" />
        <circle cx="21" cy="16.5" r="1.4" fill="white" /><circle cx="31" cy="16.5" r="1.4" fill="white" />
        <polygon points="25,22 23,24.5 27,24.5" fill="oklch(70% 0.09 18)" />
        <line x1="8" y1="21" x2="19" y2="22" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="8" y1="24" x2="19" y2="23" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="42" y1="21" x2="31" y2="22" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <line x1="42" y1="24" x2="31" y2="23" stroke="rgba(0,0,0,0.16)" strokeWidth="0.9" />
        <path d="M44,34 Q54,24 48,16 Q46,26 42,30" fill={c} />
      </svg>
      {wiggling && catName && (
        <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 8, padding: '3px 8px', fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', animation: 'catFlash 0.7s ease-out forwards', pointerEvents: 'none' }}>{catName}</div>
      )}
    </div>
  );
}
function RugSVG({ color }) {
  const c = color || 'oklch(69% 0.09 28)';
  return (
    <div style={{ width: 210, height: 60, borderRadius: 30, background: c, boxShadow: '0 4px 14px rgba(0,0,0,0.14)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 7,  borderRadius: 23, border: '2.5px solid rgba(255,255,255,0.35)' }} />
      <div style={{ position: 'absolute', inset: 16, borderRadius: 14, border: '1.5px dashed rgba(255,255,255,0.25)' }} />
    </div>
  );
}
function CandlesSVG() {
  return (
    <svg width="46" height="36" viewBox="0 0 46 36">
      <rect x="2"  y="14" width="10" height="20" rx="3" fill="oklch(90% 0.04 55)" />
      <rect x="18" y="8"  width="10" height="26" rx="3" fill="oklch(88% 0.06 58)" />
      <rect x="34" y="18" width="10" height="16" rx="3" fill="oklch(90% 0.04 55)" />
      <ellipse cx="7"  cy="14"   rx="5" ry="2.5" fill="oklch(82% 0.04 56)" />
      <ellipse cx="23" cy="8"    rx="5" ry="2.5" fill="oklch(84% 0.05 56)" />
      <ellipse cx="39" cy="18"   rx="5" ry="2.5" fill="oklch(82% 0.04 56)" />
      <ellipse cx="7"  cy="12"   rx="2" ry="3.5" fill="oklch(85% 0.18 72)" opacity="0.9" />
      <ellipse cx="23" cy="5.5"  rx="2" ry="3.5" fill="oklch(85% 0.18 72)" opacity="0.9" />
      <ellipse cx="39" cy="15.5" rx="2" ry="3.5" fill="oklch(85% 0.18 72)" opacity="0.9" />
    </svg>
  );
}
function BooksSVG() {
  const cols = ['oklch(60% 0.11 42)','oklch(55% 0.10 155)','oklch(55% 0.12 20)','oklch(55% 0.10 280)','oklch(58% 0.12 68)'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {[36,44,40,42,38].map((h,i) => <div key={i} style={{ width: 10, height: h, borderRadius: '2px 2px 0 0', background: cols[i] }} />)}
    </div>
  );
}
function BedDecor({ accentColor, color }) {
  const ac  = color || accentColor || 'oklch(58% 0.11 42)';
  const wood      = 'oklch(46% 0.08 46)';
  const woodLight = 'oklch(54% 0.09 49)';
  const woodDark  = 'oklch(38% 0.06 44)';
  return (
    <div>
      <svg width="134" height="96" viewBox="0 0 134 96">

        {/* ── Headboard ── */}
        <rect x="0" y="0" width="134" height="34" rx="8" fill={wood}/>
        <rect x="4" y="3" width="126" height="28" rx="6" fill={woodLight}/>
        {/* arch carved into headboard */}
        <path d="M18,28 Q67,7 116,28" fill="none" stroke="oklch(63% 0.08 52)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* tufting buttons */}
        <circle cx="43" cy="17" r="2.4" fill={woodDark} opacity="0.75"/>
        <circle cx="67" cy="13" r="2.4" fill={woodDark} opacity="0.75"/>
        <circle cx="91" cy="17" r="2.4" fill={woodDark} opacity="0.75"/>

        {/* ── Side rails ── */}
        <rect x="0"   y="30" width="10" height="52" rx="3" fill={wood}/>
        <rect x="2"   y="32" width="6"  height="48" rx="2" fill={woodLight}/>
        <rect x="124" y="30" width="10" height="52" rx="3" fill={wood}/>
        <rect x="126" y="32" width="6"  height="48" rx="2" fill={woodLight}/>

        {/* ── Footboard ── */}
        <rect x="0"  y="82" width="134" height="14" rx="5" fill={wood}/>
        <rect x="4"  y="85" width="126" height="8"  rx="3" fill={woodLight}/>

        {/* ── Mattress base ── */}
        <rect x="10" y="30" width="114" height="54" rx="3" fill="oklch(97% 0.016 56)"/>

        {/* ── Sheet fold at pillow line ── */}
        <rect x="10" y="50" width="114" height="7" rx="2" fill="oklch(91% 0.025 58)" opacity="0.9"/>

        {/* ── Duvet ── */}
        <rect x="10" y="55" width="114" height="29" rx="6" fill={ac} opacity="0.92"/>
        {/* puffer channels */}
        <rect x="10" y="55" width="114" height="10" rx="5" fill="white" opacity="0.20"/>
        <line x1="16" y1="65" x2="118" y2="65" stroke="white" strokeWidth="1.2" opacity="0.22"/>
        <rect x="10" y="65" width="114" height="10" fill="white" opacity="0.07"/>
        <line x1="16" y1="75" x2="118" y2="75" stroke="white" strokeWidth="1.2" opacity="0.15"/>
        <rect x="10" y="75" width="114" height="9"  rx="5" fill={ac} opacity="0.88"/>
        {/* duvet bottom shadow */}
        <path d="M14,82 Q67,86 120,82" stroke={woodDark} strokeWidth="1.5" fill="none" opacity="0.14"/>

        {/* ── Left pillow ── */}
        <rect x="14" y="31" width="46" height="22" rx="11" fill="white"/>
        {/* pillow top highlight */}
        <rect x="17" y="33" width="40" height="9" rx="5" fill="white" opacity="0.55"/>
        {/* pillow shadow at base */}
        <ellipse cx="37" cy="52" rx="21" ry="3.5" fill="oklch(82% 0.04 55)" opacity="0.38"/>
        {/* centre crease */}
        <path d="M36,32 Q38,42 36,53" stroke="oklch(87% 0.03 55)" strokeWidth="1.5" fill="none" opacity="0.45"/>

        {/* ── Right pillow ── */}
        <rect x="74" y="31" width="46" height="22" rx="11" fill="white"/>
        <rect x="77" y="33" width="40" height="9" rx="5" fill="white" opacity="0.55"/>
        <ellipse cx="97" cy="52" rx="21" ry="3.5" fill="oklch(82% 0.04 55)" opacity="0.38"/>
        <path d="M96,32 Q98,42 96,53" stroke="oklch(87% 0.03 55)" strokeWidth="1.5" fill="none" opacity="0.45"/>

      </svg>
    </div>
  );
}
function NightstandSVG({ color }) {
  const c = color || 'oklch(46% 0.08 46)';
  return (
    <svg width="44" height="60" viewBox="0 0 44 60">
      {/* tiny glass of water on top */}
      <rect x="15" y="1" width="14" height="10" rx="3.5" fill="oklch(80% 0.07 220)" opacity="0.62"/>
      <rect x="16" y="2" width="12" height="4"  rx="2"   fill="white" opacity="0.40"/>

      {/* table surface */}
      <rect x="0"  y="9"  width="44" height="8" rx="4" fill={c}/>
      <rect x="1"  y="10" width="42" height="4" rx="3" fill="white" opacity="0.22"/>

      {/* body */}
      <rect x="2"  y="16" width="40" height="30" rx="3" fill={c}/>
      {/* edge highlight */}
      <rect x="2"  y="16" width="4"  height="30" rx="2" fill="white" opacity="0.11"/>

      {/* drawer 1 */}
      <rect x="5"  y="18" width="34" height="11" rx="2" fill="white" opacity="0.09"/>
      <rect x="6"  y="19" width="32" height="9"  rx="2" fill="black" opacity="0.07"/>
      {/* handle 1 */}
      <rect x="16" y="22" width="12" height="3"  rx="1.5" fill="white" opacity="0.55"/>

      {/* divider */}
      <rect x="5"  y="30" width="34" height="1"  fill="white" opacity="0.18"/>

      {/* drawer 2 */}
      <rect x="5"  y="31" width="34" height="13" rx="2" fill="white" opacity="0.07"/>
      {/* handle 2 */}
      <rect x="16" y="36" width="12" height="3"  rx="1.5" fill="white" opacity="0.55"/>

      {/* legs */}
      <rect x="5"  y="45" width="8"  height="15" rx="4" fill={c}/>
      <rect x="31" y="45" width="8"  height="15" rx="4" fill={c}/>
      {/* leg top shadow */}
      <rect x="5"  y="45" width="8"  height="4"  rx="3" fill="black" opacity="0.13"/>
      <rect x="31" y="45" width="8"  height="4"  rx="3" fill="black" opacity="0.13"/>
    </svg>
  );
}

function FairyLights({ mood }) {
  const glowColor = mood === 'night' ? 'oklch(90% 0.18 78)' : 'oklch(88% 0.14 74)';
  const count = 12;
  return (
    <div style={{ position: 'absolute', top: 58, left: 0, right: 0, height: 24, pointerEvents: 'none', zIndex: 4 }}>
      <svg width="100%" height="24" viewBox="0 0 393 24" preserveAspectRatio="none">
        <path d={`M 0 8 ${Array.from({length:count},(_,i)=>`Q ${((i+0.5)/count)*393} 18 ${((i+1)/count)*393} 8`).join(' ')}`} fill="none" stroke="oklch(70% 0.08 50)" strokeWidth="1" opacity="0.5" />
        {Array.from({length:count},(_,i) => <circle key={i} cx={((i+0.5)/count)*393} cy="16" r="4" fill={glowColor} opacity={mood==='night'?0.9:0.65} />)}
      </svg>
    </div>
  );
}

// ── Main scene ───────────────────────────────────────────────
export function RoomScene2D({
  mood = 'golden', wallColor, floorColor, accentColor,
  avatarA, avatarB, shopItems = [], coins = 0, catColorIdx = 0, noteText,
  sleepA = false, sleepB = false, ping = null,
  streak = 0, nextDate = null, roomName = '',
  bedPos, nightstandPos,
  bedColor, rugColor, nightstandColor,
  onMoodChange, onAvatarTap, onNoteClick,
  onCatColorChange, onItemMove, onBlobMove, onBedMove, onNightstandMove,
  onFurnitureColor, onToggleSleep,
  onPing, onRoomNameChange,
}) {
  const wc = wallColor  || 'oklch(93% 0.022 55)';
  const fc = floorColor || 'oklch(65% 0.08 54)';
  const m  = MOODS[mood] || MOODS.golden;

  const [bouncingA, setBouncingA] = React.useState(false);
  const [bouncingB, setBouncingB] = React.useState(false);
  const [catWiggling,    setCatWiggling]    = React.useState(false);
  const [showPing,       setShowPing]       = React.useState(false);
  const [pingMsg,        setPingMsg]        = React.useState('');
  const [showPingPicker, setShowPingPicker] = React.useState(false);
  const [furniturePicker, setFurniturePicker] = React.useState(null); // 'bed'|'rug'|'nightstand'

  // room name inline edit
  const [editingName, setEditingName] = React.useState(false);
  const [nameDraft,   setNameDraft]   = React.useState(roomName);
  React.useEffect(() => { setNameDraft(roomName); }, [roomName]);
  const commitName = () => { setEditingName(false); if (nameDraft.trim()) onRoomNameChange?.(nameDraft.trim()); };

  // ping hearts auto-clear
  React.useEffect(() => {
    if (!ping?.ts) return;
    setPingMsg(ping.msg || '💕');
    setShowPing(true);
    const t = setTimeout(() => setShowPing(false), 4500);
    return () => clearTimeout(t);
  }, [ping?.ts]);

  const roomRef = React.useRef(null);

  const tapBlob = (which) => {
    if (which === 'a') { setBouncingA(true); setTimeout(() => setBouncingA(false), 720); }
    else               { setBouncingB(true); setTimeout(() => setBouncingB(false), 720); }
    setTimeout(() => onAvatarTap?.(which), 120);
  };
  const tapCat = () => {
    setCatWiggling(true);
    setTimeout(() => setCatWiggling(false), 560);
    onCatColorChange?.(((catColorIdx ?? 0) + 1) % CAT_COLORS.length);
  };

  const placed  = (id) => shopItems.find(i => i.id === id)?.placed;
  const itemPos = (id) => shopItems.find(i => i.id === id)?.pos ?? { x: 10, y: 60 };

  // Countdown days
  let daysUntil = null;
  if (nextDate) {
    const diff = new Date(nextDate + 'T00:00:00') - new Date(new Date().toDateString());
    daysUntil = Math.ceil(diff / 86400000);
  }

  return (
    <div ref={roomRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* back wall */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '46%', background: wc }}>
        <div style={{ position: 'absolute', inset: 0, background: m.wallLight, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 16, background: 'rgba(0,0,0,0.045)', borderTop: '1.5px solid rgba(0,0,0,0.06)' }} />
      </div>

      {/* floor */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: '54%', background: fc }}>
        {[...Array(5)].map((_,i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: i*48+14, height: 1, background: 'rgba(0,0,0,0.05)' }} />)}
      </div>
      <div style={{ position: 'absolute', top: '54%', left: 0, right: 0, height: 26, background: 'linear-gradient(to bottom, rgba(0,0,0,0.09), transparent)', pointerEvents: 'none' }} />

      {placed('lights') && <FairyLights mood={mood} />}
      <RoomWindow mood={mood} x={97} y={58} w={200} h={170} />

      {/* window light */}
      <div style={{ position: 'absolute', bottom: '46%', left: '18%', width: '64%', height: 70, background: mood==='night'?'rgba(255,210,130,0.09)':'rgba(255,228,148,0.12)', filter: 'blur(20px)', pointerEvents: 'none' }} />
      {mood === 'night' && <div style={{ position: 'absolute', bottom: '44%', right: 14, width: 100, height: 130, background: 'radial-gradient(ellipse at 80% 55%, oklch(92% 0.14 76), transparent 70%)', opacity: 0.38, pointerEvents: 'none' }} />}

      {/* Room name on wall */}
      <div style={{ position: 'absolute', top: 70, left: 16, zIndex: 3 }}>
        {editingName ? (
          <input
            value={nameDraft}
            onChange={e => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setEditingName(false); setNameDraft(roomName); } }}
            autoFocus
            onClick={e => e.stopPropagation()}
            style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 12, color: 'oklch(38% 0.06 50)', background: 'rgba(255,255,255,0.7)', border: 'none', borderBottom: '1.5px solid oklch(65% 0.08 50)', outline: 'none', borderRadius: 0, padding: '1px 3px', width: 130 }}
          />
        ) : (
          <div onClick={e => { e.stopPropagation(); setEditingName(true); }}
            style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 12, color: 'oklch(44% 0.06 52)', cursor: 'text', opacity: 0.75, maxWidth: 130 }}>
            {roomName || 'our little nest 🏡'}
          </div>
        )}
      </div>

      {/* Countdown widget — sits right below the room name */}
      {daysUntil !== null && (
        <div style={{ position: 'absolute', top: 88, left: 16, background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '4px 9px', zIndex: 3, boxShadow: '0 1px 6px rgba(0,0,0,0.10)', pointerEvents: 'none' }}>
          <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 9, fontWeight: 700, color: 'oklch(50% 0.05 50)', letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {daysUntil > 0 ? `see you in` : daysUntil === 0 ? '🎉 today!' : `${Math.abs(daysUntil)}d ago`}
          </div>
          {daysUntil > 0 && (
            <div style={{ fontFamily: '"DM Serif Display",serif', fontStyle: 'italic', fontSize: 15, color: 'oklch(44% 0.09 50)', lineHeight: 1.15 }}>
              {daysUntil} {daysUntil === 1 ? 'day' : 'days'} ❤️
            </div>
          )}
        </div>
      )}

      {/* ── Nightstand — draggable ── */}
      <DraggableDecor itemId="nightstand" pos={nightstandPos ?? { x: 53, y: 36 }} onMove={(_, pos) => onNightstandMove?.(pos)} onTap={() => setFurniturePicker('nightstand')} roomRef={roomRef} zBase={3}>
        <NightstandSVG color={nightstandColor} />
      </DraggableDecor>

      {/* ── Bed — draggable ── */}
      <DraggableDecor itemId="bed" pos={bedPos ?? { x: 58, y: 34 }} onMove={(_, pos) => onBedMove?.(pos)} onTap={() => setFurniturePicker('bed')} roomRef={roomRef} zBase={2}>
        <BedDecor accentColor={accentColor} color={bedColor} />
      </DraggableDecor>

      {/* sticky note */}
      <div onClick={e => { e.stopPropagation(); onNoteClick?.(); }}
        style={{ position: 'absolute', top: 72, right: 14, width: 64, height: 64, background: 'oklch(95% 0.09 86)', borderRadius: 5, boxShadow: '2px 3px 10px rgba(0,0,0,0.14)', transform: 'rotate(3deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 7, cursor: 'pointer', zIndex: 3 }}>
        <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 8, color: 'oklch(38% 0.08 65)', lineHeight: 1.45, textAlign: 'center', overflow: 'hidden' }}>
          {noteText || "can't wait to see you 🌙"}
        </div>
      </div>

      {/* ── Draggable decor ── */}
      {placed('plant')   && <DraggableDecor itemId="plant"   pos={itemPos('plant')}   onMove={onItemMove} roomRef={roomRef}><PlantSVG /></DraggableDecor>}
      {placed('cactus')  && <DraggableDecor itemId="cactus"  pos={itemPos('cactus')}  onMove={onItemMove} roomRef={roomRef}><CactusSVG /></DraggableDecor>}
      {placed('lamp')    && <DraggableDecor itemId="lamp"    pos={itemPos('lamp')}    onMove={onItemMove} roomRef={roomRef}><LampSVG glowing={mood==='night'} /></DraggableDecor>}
      {placed('books')   && <DraggableDecor itemId="books"   pos={itemPos('books')}   onMove={onItemMove} roomRef={roomRef}><BooksSVG /></DraggableDecor>}
      {placed('rug')     && <DraggableDecor itemId="rug"     pos={itemPos('rug')}     onMove={onItemMove} onTap={() => setFurniturePicker('rug')} roomRef={roomRef}><RugSVG color={rugColor} /></DraggableDecor>}
      {placed('candles') && <DraggableDecor itemId="candles" pos={itemPos('candles')} onMove={onItemMove} roomRef={roomRef}><CandlesSVG /></DraggableDecor>}
      {placed('cat')     && <DraggableDecor itemId="cat" pos={itemPos('cat')} onMove={onItemMove} onTap={tapCat} roomRef={roomRef}><CatSVG bodyColor={CAT_COLORS[catColorIdx??0]} wiggling={catWiggling} /></DraggableDecor>}

      {/* ── Blob A — draggable, always in front of decor ── */}
      <DraggableDecor itemId="blobA" pos={avatarA?.pos ?? {x:18,y:66}} onMove={(_,pos) => onBlobMove?.('a',pos)} onTap={() => tapBlob('a')} roomRef={roomRef} zBase={60}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <BlobAvatar bodyColor={avatarA?.bodyColor} blushColor={avatarA?.blushColor} size={64} name={avatarA?.name} bouncing={bouncingA} floatAnim="blobFloat" sleeping={sleepA} pinged={showPing} accessory={avatarA?.accessory} />
          <div onPointerDown={e => e.stopPropagation()} onClick={() => onToggleSleep?.('a')}
            style={{ background: sleepA?'rgba(0,0,0,0.12)':'rgba(255,255,255,0.82)', backdropFilter:'blur(6px)', borderRadius:14, padding:'4px 8px', fontSize:12, cursor:'pointer', boxShadow:'0 1px 5px rgba(0,0,0,0.10)', userSelect:'none', lineHeight:1 }}>
            {sleepA ? '☀️' : '🌙'}
          </div>
        </div>
      </DraggableDecor>

      {/* ── Blob B — draggable, always in front of decor ── */}
      <DraggableDecor itemId="blobB" pos={avatarB?.pos ?? {x:55,y:66}} onMove={(_,pos) => onBlobMove?.('b',pos)} onTap={() => tapBlob('b')} roomRef={roomRef} zBase={60}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <BlobAvatar bodyColor={avatarB?.bodyColor} blushColor={avatarB?.blushColor} size={64} name={avatarB?.name} flip bouncing={bouncingB} floatAnim="blobFloatB" sleeping={sleepB} pinged={showPing} accessory={avatarB?.accessory} />
          <div onPointerDown={e => e.stopPropagation()} onClick={() => onToggleSleep?.('b')}
            style={{ background: sleepB?'rgba(0,0,0,0.12)':'rgba(255,255,255,0.82)', backdropFilter:'blur(6px)', borderRadius:14, padding:'4px 8px', fontSize:12, cursor:'pointer', boxShadow:'0 1px 5px rgba(0,0,0,0.10)', userSelect:'none', lineHeight:1 }}>
            {sleepB ? '☀️' : '🌙'}
          </div>
        </div>
      </DraggableDecor>

      {/* ── Furniture colour picker ── */}
      {furniturePicker && (
        <div onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', bottom: 132, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.97)', borderRadius: 18, padding: '12px 14px', boxShadow: '0 6px 24px rgba(0,0,0,0.14)', zIndex: 60, minWidth: 230 }}>
          <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, color: 'oklch(50% 0.05 50)', textTransform: 'uppercase', letterSpacing: 1.4, textAlign: 'center', marginBottom: 10 }}>
            {furniturePicker === 'bed' ? 'duvet colour' : furniturePicker === 'rug' ? 'rug colour' : 'nightstand colour'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {FURNITURE_COLORS.map(col => {
              const current = furniturePicker === 'bed' ? (bedColor || accentColor) : furniturePicker === 'rug' ? rugColor : nightstandColor;
              const active = col === current;
              return (
                <div key={col} onClick={() => { onFurnitureColor?.(furniturePicker, col); setFurniturePicker(null); }}
                  style={{ width: 30, height: 30, borderRadius: '50%', background: col, cursor: 'pointer', flexShrink: 0,
                    boxShadow: active ? `0 0 0 2.5px white, 0 0 0 4.5px ${col}` : '0 1px 4px rgba(0,0,0,0.18)',
                    transform: active ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.12s' }} />
              );
            })}
          </div>
          <div onClick={() => setFurniturePicker(null)} style={{ textAlign: 'center', fontFamily: '"Nunito",sans-serif', fontSize: 11, color: 'oklch(60% 0.04 50)', cursor: 'pointer', marginTop: 10 }}>cancel</div>
        </div>
      )}

      {/* ── Ping message popover ── */}
      {showPingPicker && (
        <div onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', bottom: 132, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.97)', borderRadius: 18, padding: '10px 12px', boxShadow: '0 6px 24px rgba(0,0,0,0.14)', zIndex: 60, minWidth: 220 }}>
          <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 10, fontWeight: 700, color: 'oklch(50% 0.05 50)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, textAlign: 'center' }}>send a ping</div>
          {PING_MESSAGES.map(({ msg, emoji }) => (
            <div key={msg} onClick={() => { onPing?.(msg); setShowPingPicker(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, cursor: 'pointer', fontFamily: '"Nunito",sans-serif', fontSize: 13, fontWeight: 600, color: 'oklch(30% 0.05 50)', marginBottom: 2 }}
              onPointerEnter={e => e.currentTarget.style.background = 'oklch(95% 0.018 55)'}
              onPointerLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 16 }}>{emoji}</span>{msg}
            </div>
          ))}
          <div onClick={() => setShowPingPicker(false)} style={{ textAlign: 'center', fontFamily: '"Nunito",sans-serif', fontSize: 11, color: 'oklch(60% 0.04 50)', cursor: 'pointer', marginTop: 6 }}>cancel</div>
        </div>
      )}

      {/* ── Ping button ── */}
      <div style={{ position: 'absolute', bottom: 88, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10 }}>
        {showPing && pingMsg && (
          <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 11, fontWeight: 700, color: 'oklch(44% 0.09 50)', animation: 'pingHeart 4s ease-out forwards', pointerEvents: 'none', whiteSpace: 'nowrap', textAlign: 'center', maxWidth: 200 }}>
            {pingMsg}
          </div>
        )}
        <div style={{ fontFamily: '"Nunito",sans-serif', fontSize: 9, color: 'rgba(80,60,40,0.4)', fontWeight: 700, letterSpacing: 0.3 }}>ping!</div>
        <div onClick={e => { e.stopPropagation(); setShowPingPicker(p => !p); }}
          style={{ width: 36, height: 36, borderRadius: '50%', background: showPingPicker ? 'oklch(88% 0.06 50)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer', userSelect: 'none', transition: 'background 0.15s, transform 0.12s' }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
          onPointerUp={e   => e.currentTarget.style.transform = 'scale(1)'}
        >💌</div>
      </div>

      {/* coin + streak pill */}
      <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, zIndex: 5 }}>
        <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
          <span style={{ fontSize: 14 }}>🪙</span>
          <span style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 14, color: 'oklch(40% 0.09 55)' }}>{coins}</span>
        </div>
        {streak > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontFamily: '"Nunito",sans-serif', fontWeight: 800, fontSize: 12, color: 'oklch(50% 0.12 42)' }}>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* mood toggle */}
      <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '5px 8px', display: 'flex', gap: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', zIndex: 5 }}>
        {Object.entries(MOODS).map(([key,md]) => (
          <div key={key} onClick={e => { e.stopPropagation(); onMoodChange?.(key); }}
            style={{ fontSize: 12, padding: '2px 5px', borderRadius: 12, cursor: 'pointer', background: mood===key?'rgba(0,0,0,0.09)':'transparent', transition: 'background 0.15s' }}>
            {md.label}
          </div>
        ))}
      </div>

      {/* hint */}
      <div style={{ position: 'absolute', bottom: 74, left: 0, right: 0, textAlign: 'center', fontFamily: '"Nunito",sans-serif', fontSize: 9, color: 'rgba(80,60,40,0.3)', letterSpacing: 0.4, fontWeight: 600, pointerEvents: 'none' }}>
        drag blobs &amp; items to move · tap blob to customize
      </div>
    </div>
  );
}
