import React from 'react';
import { IOSDevice, IOSStatusBar } from './components/IOSFrame.jsx';
import { RoomScene2D } from './components/RoomScene2D.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { TasksScreen } from './screens/TasksScreen.jsx';
import { ShopScreen } from './screens/ShopScreen.jsx';
import { NoteScreen } from './screens/NoteScreen.jsx';
import { CustomizeScreen } from './screens/CustomizeScreen.jsx';
import { OnboardingScreen } from './screens/OnboardingScreen.jsx';
import { P } from './constants.js';
import { useRoom, getLastRoomCode, saveRoomCode } from './hooks/useRoom.js';

function ScreenHeader({ title }) {
  return (
    <div style={{ padding: '68px 22px 16px', background: P.white, borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
      <div style={{ fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', fontSize: 30, color: P.ink, letterSpacing: -0.5, lineHeight: 1 }}>{title}</div>
    </div>
  );
}

export default function App() {
  const [roomCode, setRoomCode] = React.useState(() => getLastRoomCode());
  const [screen,   setScreen]   = React.useState('room');

  const { room, updateRoom, status } = useRoom(roomCode);

  const enterRoom = (code) => { saveRoomCode(code); setRoomCode(code); setScreen('room'); };
  const leaveRoom = () => { saveRoomCode(null); setRoomCode(null); setScreen('room'); };

  // ── task helpers ────────────────────────────────────────────
  const completeTask = (task) => {
    const today     = new Date().toDateString();
    const last      = room.lastActive;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak   = room.streak ?? 0;
    if (last !== today) newStreak = (last === yesterday) ? newStreak + 1 : 1;

    updateRoom({
      tasks:          room.tasks.map(t => t.id === task.id ? { ...t, done: true } : t),
      coins:          room.coins + task.coins,
      lastActive:     today,
      streak:         newStreak,
      completedTasks: [
        { id: task.id, text: task.text, coins: task.coins, ts: Date.now() },
        ...(room.completedTasks || []).slice(0, 49),
      ],
    });
  };

  const addTask = (text, coins, immediate = false) => {
    if (immediate) updateRoom({ coins: room.coins + coins });
    else           updateRoom({ tasks: [...room.tasks, { id: Date.now(), text, coins, done: false }] });
  };

  const editTask   = (id, text, coins) => updateRoom({ tasks: room.tasks.map(t => t.id === id ? { ...t, text, coins } : t) });
  const removeTask = (id)               => updateRoom({ tasks: room.tasks.filter(t => t.id !== id) });

  // ── shop helpers ─────────────────────────────────────────────
  const buyItem      = (item) => {
    if (room.coins < item.cost) return;
    updateRoom({ coins: room.coins - item.cost, shopItems: room.shopItems.map(i => i.id === item.id ? { ...i, owned: true, placed: true } : i) });
  };
  const togglePlaced = (item) => updateRoom({ shopItems: room.shopItems.map(i => i.id === item.id ? { ...i, placed: !i.placed } : i) });
  const moveItem     = (itemId, pos) => updateRoom({ shopItems: room.shopItems.map(i => i.id === itemId ? { ...i, pos } : i) });

  // ── blob helpers ─────────────────────────────────────────────
  const moveBlob   = (which, pos) => {
    if (which === 'a') updateRoom({ avatarA: { ...room.avatarA, pos } });
    else               updateRoom({ avatarB: { ...room.avatarB, pos } });
  };
  const toggleSleep = (which) => {
    if (which === 'a') updateRoom({ sleepA: !room.sleepA });
    else               updateRoom({ sleepB: !room.sleepB });
  };

  // ── ping ─────────────────────────────────────────────────────
  const sendPing = (msg) => updateRoom({ ping: { ts: Date.now(), msg: msg || '💕' } });

  // ── reactions ────────────────────────────────────────────────
  const addReaction = ({ id, emoji, x, y, ts }) => {
    const now     = Date.now();
    const pruned  = (room.reactions || []).filter(r => now - r.ts < 10000);
    updateRoom({ reactions: [...pruned, { id, emoji, x, y, ts }] });
  };

  // ── room meta ────────────────────────────────────────────────
  const setRoomName = (name) => updateRoom({ roomName: name });

  // ── note (now includes photo) ────────────────────────────────
  const saveNote = ({ note, notePhoto }) => updateRoom({ note, notePhoto: notePhoto ?? room.notePhoto ?? null });

  // ── render ───────────────────────────────────────────────────
  if (!roomCode) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 40 }}>
        <IOSDevice width={393} height={852}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}><IOSStatusBar /></div>
          <div style={{ position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <OnboardingScreen onEnter={enterRoom} />
          </div>
        </IOSDevice>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 40 }}>
      <IOSDevice width={393} height={852}>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
          <IOSStatusBar dark={screen === 'room' && room.mood === 'night'} />
        </div>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 82, overflow: 'hidden' }}>

          {/* ROOM */}
          {screen === 'room' && (
            <RoomScene2D
              mood={room.mood}
              wallColor={room.wallColor}
              floorColor={room.floorColor}
              accentColor={room.accentColor}
              avatarA={room.avatarA}
              avatarB={room.avatarB}
              shopItems={room.shopItems}
              coins={room.coins}
              catColorIdx={room.catColorIdx ?? 0}
              noteText={room.note}
              sleepA={room.sleepA ?? false}
              sleepB={room.sleepB ?? false}
              ping={room.ping ?? null}
              streak={room.streak ?? 0}
              reactions={room.reactions ?? []}
              nextDate={room.nextDate ?? null}
              roomName={room.roomName ?? ''}
              onMoodChange={mood => updateRoom({ mood })}
              onAvatarTap={() => setScreen('customize')}
              onNoteClick={() => setScreen('note')}
              onCatColorChange={idx => updateRoom({ catColorIdx: idx })}
              onItemMove={moveItem}
              onBlobMove={moveBlob}
              onToggleSleep={toggleSleep}
              onPing={sendPing}
              onAddReaction={addReaction}
              onRoomNameChange={setRoomName}
            />
          )}

          {/* TASKS */}
          {screen === 'tasks' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: P.bg }}>
              <ScreenHeader title="our tasks" />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <TasksScreen
                  tasks={room.tasks}
                  coins={room.coins}
                  completedTasks={room.completedTasks ?? []}
                  onComplete={completeTask}
                  onAdd={addTask}
                  onEdit={editTask}
                  onRemove={removeTask}
                  onCoinsEdit={c => updateRoom({ coins: c })}
                />
              </div>
            </div>
          )}

          {/* SHOP */}
          {screen === 'shop' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: P.bg }}>
              <ScreenHeader title="nest shop" />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <ShopScreen coins={room.coins} items={room.shopItems} onBuy={buyItem} onTogglePlaced={togglePlaced} />
              </div>
            </div>
          )}

          {/* NOTE */}
          {screen === 'note' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: P.bg }}>
              <ScreenHeader title="sticky note" />
              <div style={{ flex: 1, overflow: 'auto' }}>
                <NoteScreen
                  note={room.note}
                  notePhoto={room.notePhoto ?? null}
                  onSave={saveNote}
                  avatarA={room.avatarA}
                  avatarB={room.avatarB}
                />
              </div>
            </div>
          )}

          {/* CUSTOMIZE */}
          {screen === 'customize' && (
            <CustomizeScreen
              room={room}
              onUpdate={updateRoom}
              onLeaveRoom={leaveRoom}
              roomCode={roomCode}
              connStatus={status}
            />
          )}
        </div>

        <BottomNav active={screen} onChange={setScreen} />
      </IOSDevice>
    </div>
  );
}
