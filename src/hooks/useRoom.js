import React from 'react';
import { db, isFirebaseConfigured } from '../firebase.js';
import { ref, onValue, set, get } from 'firebase/database';
import { DEFAULT_ROOM } from '../constants.js';

const LS_ROOM    = 'nestled_room_v2';
const LS_CODE    = 'nestled_room_code';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_ROOM)) || DEFAULT_ROOM; } catch { return DEFAULT_ROOM; }
}

export function getLastRoomCode() {
  return localStorage.getItem(LS_CODE) || null;
}

export function saveRoomCode(code) {
  if (code) localStorage.setItem(LS_CODE, code);
  else localStorage.removeItem(LS_CODE);
}

export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// status: 'local' | 'connecting' | 'connected' | 'error'
export function useRoom(roomCode) {
  const [room,   setRoom]   = React.useState(loadLocal);
  const [status, setStatus] = React.useState(isFirebaseConfigured ? 'connecting' : 'local');
  const pendingRef = React.useRef(false); // true while we're writing to Firebase

  React.useEffect(() => {
    if (!roomCode || !isFirebaseConfigured || !db) {
      setStatus('local');
      return;
    }

    setStatus('connecting');
    const roomRef = ref(db, `rooms/${roomCode}`);

    // Seed room if it doesn't exist yet
    get(roomRef).then(snap => {
      if (!snap.exists()) set(roomRef, loadLocal());
    }).catch(() => setStatus('error'));

    const unsub = onValue(
      roomRef,
      snap => {
        if (!snap.exists()) return;
        if (pendingRef.current) { pendingRef.current = false; return; }
        const data = snap.val();
        setRoom(data);
        localStorage.setItem(LS_ROOM, JSON.stringify(data));
        setStatus('connected');
      },
      () => setStatus('error'),
    );

    return () => unsub();
  }, [roomCode]);

  const updateRoom = React.useCallback((changes) => {
    setRoom(prev => {
      const merged = { ...prev, ...changes };
      localStorage.setItem(LS_ROOM, JSON.stringify(merged));

      if (roomCode && isFirebaseConfigured && db && status === 'connected') {
        pendingRef.current = true;
        set(ref(db, `rooms/${roomCode}`), merged).catch(() => {
          pendingRef.current = false;
        });
      }
      return merged;
    });
  }, [roomCode, status]);

  return { room, updateRoom, status };
}
