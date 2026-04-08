/**
 * useYjs — Custom hook for Yjs real-time collaboration
 *
 * This hook manages the entire Yjs lifecycle for a given room:
 * 1. Creates a Y.Doc (the CRDT document)
 * 2. Connects a WebSocket provider (syncs with y-websocket server)
 * 3. Sets up IndexedDB persistence (offline support)
 * 4. Manages awareness (user presence: cursor position, name, color)
 *
 * AWARENESS EXPLAINED:
 * - Awareness is a lightweight protocol separate from document sync
 * - Each connected client has a "local state" containing user info
 * - When a user moves their cursor, awareness broadcasts that position
 * - Other clients receive awareness updates and render colored cursors
 * - Awareness states are automatically cleaned up when a user disconnects
 *
 * @param {string} roomId - The document/room ID to connect to
 * @param {object} [userInfo] - Optional user info (name, color)
 * @returns {{ ydoc, provider, awareness, connectedUsers, isConnected, isSynced }}
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { createYjsSetup, destroyYjsSetup, getCursorColor } from '../lib/yjs';

export function useYjs(roomId, userInfo = {}) {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // Use refs to hold the Yjs instances so they survive re-renders
  const setupRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    // Create the Yjs setup (ydoc + provider + persistence)
    const setup = createYjsSetup(roomId, userInfo);
    setupRef.current = setup;

    const { provider, persistence } = setup;

    // ---- Connection status ----
    const handleStatus = ({ status }) => {
      setIsConnected(status === 'connected');
    };
    provider.on('status', handleStatus);

    // ---- Sync status (IndexedDB loaded) ----
    persistence.on('synced', () => {
      setIsSynced(true);
    });

    // ---- Awareness change handler ----
    // This fires whenever ANY user's awareness state changes
    // (cursor move, user joins/leaves, name change, etc.)
    const handleAwarenessChange = () => {
      const states = provider.awareness.getStates();
      const users = [];

      // Iterate over all awareness states
      // Each state is a Map entry: [clientId, { user: { name, color, ... }, cursor: {...} }]
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({
            clientId,
            name: state.user.name || 'Anonymous',
            color: state.user.color || getCursorColor(clientId),
            // isCurrentUser helps the UI differentiate self from others
            isCurrentUser: clientId === provider.awareness.clientID,
          });
        }
      });

      setConnectedUsers(users);
    };

    // Subscribe to awareness changes
    provider.awareness.on('change', handleAwarenessChange);

    // Get initial awareness state
    handleAwarenessChange();

    // ---- Cleanup on unmount or roomId change ----
    return () => {
      provider.off('status', handleStatus);
      provider.awareness.off('change', handleAwarenessChange);
      destroyYjsSetup(setup);
      setupRef.current = null;
      setIsConnected(false);
      setIsSynced(false);
      setConnectedUsers([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Update awareness when user info changes (e.g., after login)
  const updateUser = useCallback((newUserInfo) => {
    const provider = setupRef.current?.provider;
    if (!provider) return;

    const color = newUserInfo.color || getCursorColor(provider.awareness.clientID);
    provider.awareness.setLocalStateField('user', {
      name: newUserInfo.name || 'Anonymous',
      color,
      colorLight: color + '33',
    });
  }, []);

  return {
    /** The Yjs document instance */
    ydoc: setupRef.current?.ydoc || null,
    /** The WebSocket provider (for TipTap Collaboration extension) */
    provider: setupRef.current?.provider || null,
    /** The Awareness instance (for cursor sharing) */
    awareness: setupRef.current?.awareness || setupRef.current?.provider?.awareness || null,
    /** Array of connected users with { clientId, name, color, isCurrentUser } */
    connectedUsers,
    /** Whether the WebSocket is currently connected */
    isConnected,
    /** Whether IndexedDB persistence has finished initial sync */
    isSynced,
    /** Function to update the local user's awareness info */
    updateUser,
  };
}
