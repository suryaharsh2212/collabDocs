/**
 * useRoom.js — Firestore Room Management hook
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, 
  collection, query, where, orderBy, limit, onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export function useRoom(roomId, initialType = 'doc') {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth(); // Need to wait for auth state

  useEffect(() => {
    if (!roomId || authLoading) return;

    let cancelled = false;

    async function loadOrCreateRoom() {
      try {
        setLoading(true);
        setError(null);

        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomData = roomSnap.data();
          // Claim ownership if the room has no owner and the user is now logged in
          if (!roomData.createdBy && user && !cancelled) {
            await updateDoc(roomRef, {
              createdBy: user.uid,
              updatedAt: serverTimestamp(),
            });
            roomData.createdBy = user.uid;
          }

          if (!cancelled) {
            setRoom({ id: roomSnap.id, ...roomData });
          }
        } else {
          // Room doesn't exist — create it
          const newRoom = {
            title: initialType === 'code' ? 'Untitled Code Snippet' : 'Untitled Document',
            type: initialType,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: user ? user.uid : null, // Set owner to current user (even if anonymous)
          };
          await setDoc(roomRef, newRoom);
          if (!cancelled) {
            setRoom({ id: roomId, ...newRoom });
          }
        }
      } catch (err) {
        console.error('Room load error:', err);
        if (!cancelled) {
          setError(err.message);
          // Default state on failure so editor still works locally
          setRoom({
            id: roomId,
            title: initialType === 'code' ? 'Untitled Code Snippet' : 'Untitled Document',
            type: initialType,
            createdAt: new Date(),
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrCreateRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId, authLoading, user?.uid, initialType]);

  const updateTitle = useCallback(async (newTitle) => {
    if (!roomId || newTitle === room?.title) return;
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        title: newTitle,
        updatedAt: serverTimestamp(),
      });
      setRoom((prev) => prev ? { ...prev, title: newTitle } : prev);
    } catch (err) {
      console.error('Failed to update room title:', err);
    }
  }, [roomId, room?.title]);

  const updateContent = useCallback(async (html, preview) => {
    if (!roomId) return;
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        content: html,
        preview: preview || '',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to update room content:', err);
    }
  }, [roomId]);

  const updateRoomType = useCallback(async (type) => {
    if (!roomId) return;
    try {
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        type: type,
        updatedAt: serverTimestamp(),
      });
      setRoom((prev) => prev ? { ...prev, type } : prev);
    } catch (err) {
      console.error('Failed to update room type:', err);
    }
  }, [roomId]);

  return {
    room,
    loading,
    error,
    updateTitle,
    updateContent,
    updateRoomType,
  };
}

/**
 * Hook to fetch rooms belonging to the current user
 */
export function useUserRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) {
        setRooms([]);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    // Remove orderBy to ensure the query works without a composite index
    const q = query(
      collection(db, 'rooms'),
      where('createdBy', '==', user.uid),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Fallback for sorting if updatedAt is missing or pending
        updatedAtDate: d.data().updatedAt?.toDate ? d.data().updatedAt.toDate() : new Date(0)
      }));

      // Sort in memory by updatedAt descending
      docs.sort((a, b) => b.updatedAtDate - a.updatedAtDate);

      setRooms(docs);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching user rooms:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  const deleteRoom = useCallback(async (roomId) => {
    if (!roomId) return;
    try {
      // 1. Delete from Firestore
      const roomRef = doc(db, 'rooms', roomId);
      await deleteDoc(roomRef);

      // 2. Cleanup local IndexedDB (Yjs data)
      // y-indexeddb creates a database with the roomId as the name
      const request = indexedDB.deleteDatabase(roomId);
      request.onerror = () => console.warn(`Could not delete IndexedDB for room ${roomId}`);
      request.onsuccess = () => console.log(`Deleted IndexedDB for room ${roomId}`);

    } catch (err) {
      console.error('Failed to delete room:', err);
      throw err;
    }
  }, []);

  return { rooms, loading, deleteRoom };
}
