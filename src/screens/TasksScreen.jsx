import React from 'react';
import { P } from '../constants.js';

function Stepper({ value, onChange, min = 1, max = 50 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={e => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
        style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid oklch(80% 0.04 50)`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: P.muted }}>
        −
      </button>
      <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800, color: 'oklch(44% 0.09 55)', minWidth: 22, textAlign: 'center' }}>{value}</span>
      <button
        onClick={e => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
        style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid oklch(80% 0.04 50)`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: P.muted }}>
        +
      </button>
    </div>
  );
}

function TaskRow({ task, onComplete, onEdit, onRemove }) {
  const [editing, setEditing] = React.useState(false);
  const [draft,   setDraft]   = React.useState(task.text);
  const [flash,   setFlash]   = React.useState(false);

  const earn = () => {
    if (task.done) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    onComplete(task);
  };

  const commitEdit = (newText, newCoins) => {
    onEdit(task.id, newText ?? draft, newCoins ?? task.coins);
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ background: P.white, borderRadius: 18, padding: '14px 16px', marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && commitEdit()}
          style={{ width: '100%', fontFamily: '"Nunito", sans-serif', fontSize: 15, border: 'none', outline: 'none', color: P.ink, background: 'transparent', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, color: P.muted }}>🪙</span>
            <Stepper value={task.coins} onChange={c => onEdit(task.id, draft, c)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setDraft(task.text); setEditing(false); }} style={{ background: 'transparent', color: P.muted, border: 'none', borderRadius: 10, padding: '6px 10px', fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => commitEdit()} style={{ background: P.terra, color: 'white', border: 'none', borderRadius: 10, padding: '6px 14px', fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: task.done ? 'oklch(94% 0.01 55)' : P.white, borderRadius: 18, marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', opacity: task.done ? 0.6 : 1, transition: 'all 0.15s' }}>

      {/* complete circle */}
      <div onClick={earn} style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${task.done ? 'transparent' : 'oklch(78% 0.06 50)'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: task.done ? P.terra : 'transparent', cursor: task.done ? 'default' : 'pointer', transition: 'all 0.2s' }}>
        {(task.done || flash) && (
          <svg width="12" height="9" viewBox="0 0 12 9" style={{ animation: flash ? 'checkIn 0.25s ease-out' : 'none' }}>
            <path d="M1 4.5l3.5 3.5L11 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* text + earn button */}
      <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 600, color: task.done ? P.muted : P.ink, textDecoration: task.done ? 'line-through' : 'none', flex: 1 }}>
        {task.text}
      </span>

      {/* coin badge */}
      {!task.done ? (
        <div onClick={earn} style={{ display: 'flex', alignItems: 'center', gap: 3, background: flash ? P.terra : 'oklch(94% 0.04 66)', borderRadius: 12, padding: '3px 10px', flexShrink: 0, cursor: 'pointer', transition: 'background 0.2s' }}>
          <span style={{ fontSize: 11 }}>🪙</span>
          <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 12, fontWeight: 800, color: flash ? 'white' : 'oklch(44% 0.09 55)', transition: 'color 0.2s' }}>+{task.coins}</span>
        </div>
      ) : (
        <span style={{ fontSize: 11, color: P.muted }}>+{task.coins}🪙</span>
      )}

      {/* edit */}
      {!task.done && (
        <button onClick={e => { e.stopPropagation(); setEditing(true); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: P.muted, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* remove */}
      <button onClick={e => { e.stopPropagation(); onRemove(task.id); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'oklch(74% 0.05 15)', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function TasksScreen({ tasks, coins, onComplete, onAdd, onEdit, onRemove, onCoinsEdit }) {
  const [showAdd,    setShowAdd]    = React.useState(false);
  const [newText,    setNewText]    = React.useState('');
  const [newCoins,   setNewCoins]   = React.useState(5);
  const [editCoins,  setEditCoins]  = React.useState(false);
  const [coinDraft,  setCoinDraft]  = React.useState(String(coins));

  // one-off quick task state
  const [showOneOff, setShowOneOff] = React.useState(false);
  const [ofText,     setOfText]     = React.useState('');
  const [ofCoins,    setOfCoins]    = React.useState(5);

  React.useEffect(() => { if (!editCoins) setCoinDraft(String(coins)); }, [coins, editCoins]);

  const pending   = tasks.filter(t => !t.done);
  const completed = tasks.filter(t =>  t.done);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 24 }}>

      {/* balance */}
      <div style={{ padding: '20px 22px 18px', background: P.white, marginBottom: 2 }}>
        <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 14, color: P.muted }}>your balance</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span style={{ fontSize: 36 }}>🪙</span>
          {editCoins ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                value={coinDraft}
                onChange={e => setCoinDraft(e.target.value.replace(/\D/g, ''))}
                onBlur={() => { onCoinsEdit(parseInt(coinDraft, 10) || 0); setEditCoins(false); }}
                onKeyDown={e => { if (e.key === 'Enter') { onCoinsEdit(parseInt(coinDraft, 10) || 0); setEditCoins(false); } }}
                autoFocus
                style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 48, color: P.terra, width: 140, border: 'none', borderBottom: `2px solid ${P.terra}`, outline: 'none', background: 'transparent', lineHeight: 1 }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: 48, color: P.ink, lineHeight: 1 }}>{coins}</span>
              <button onClick={() => { setCoinDraft(String(coins)); setEditCoins(true); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: P.muted }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* To Do */}
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', padding: '20px 4px 10px' }}>To Do</div>

        {pending.map(t => (
          <TaskRow key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onRemove={onRemove} />
        ))}

        {/* add preset task */}
        {!showAdd ? (
          <div onClick={() => setShowAdd(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 18, border: '1.5px dashed oklch(82% 0.04 50)', cursor: 'pointer', marginBottom: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', border: '1.5px dashed oklch(76% 0.04 50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.muted, fontSize: 18, lineHeight: 1 }}>+</div>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 600, color: P.muted }}>Add a task…</span>
          </div>
        ) : (
          <div style={{ background: P.white, borderRadius: 18, padding: '16px', marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
            <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="Task name…" autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && newText.trim()) { onAdd(newText.trim(), newCoins); setNewText(''); setShowAdd(false); } }}
              style={{ width: '100%', fontFamily: '"Nunito", sans-serif', fontSize: 15, border: 'none', outline: 'none', marginBottom: 12, color: P.ink, background: 'transparent' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11 }}>🪙</span>
                <Stepper value={newCoins} onChange={setNewCoins} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', color: P.muted, border: 'none', borderRadius: 12, padding: '8px 12px', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { if (!newText.trim()) return; onAdd(newText.trim(), newCoins); setNewText(''); setShowAdd(false); }}
                  style={{ background: P.terra, color: 'white', border: 'none', borderRadius: 12, padding: '8px 16px', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Add</button>
              </div>
            </div>
          </div>
        )}

        {/* one-off quick task */}
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', padding: '16px 4px 10px' }}>Quick Earn</div>
        {!showOneOff ? (
          <div onClick={() => setShowOneOff(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 18, border: '1.5px dashed oklch(86% 0.06 66)', background: 'oklch(98% 0.03 66)', cursor: 'pointer', marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 600, color: 'oklch(54% 0.08 66)' }}>Log a one-off task…</span>
          </div>
        ) : (
          <div style={{ background: P.white, borderRadius: 18, padding: '16px', marginBottom: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', border: '1.5px solid oklch(90% 0.06 66)' }}>
            <input value={ofText} onChange={e => setOfText(e.target.value)} placeholder="What did you do? (earns coins now)" autoFocus
              style={{ width: '100%', fontFamily: '"Nunito", sans-serif', fontSize: 15, border: 'none', outline: 'none', marginBottom: 12, color: P.ink, background: 'transparent' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11 }}>🪙</span>
                <Stepper value={ofCoins} onChange={setOfCoins} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowOneOff(false)} style={{ background: 'transparent', color: P.muted, border: 'none', borderRadius: 12, padding: '8px 12px', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { if (!ofText.trim()) return; onAdd(ofText.trim(), ofCoins, true); setOfText(''); setOfCoins(5); setShowOneOff(false); }}
                  style={{ background: 'oklch(60% 0.12 68)', color: 'white', border: 'none', borderRadius: 12, padding: '8px 16px', fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Earn +{ofCoins}🪙
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 2.5, textTransform: 'uppercase', padding: '14px 4px 10px' }}>Completed</div>
            {completed.map(t => (
              <TaskRow key={t.id} task={t} onComplete={onComplete} onEdit={onEdit} onRemove={onRemove} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
