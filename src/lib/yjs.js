/**
 * Yjs Document Factory
 * 
 * Creates and configures a Yjs document with:
 * - WebSocket provider for real-time sync
 * - IndexedDB persistence for offline support
 * - Awareness protocol for cursor/presence sharing
 */
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';

/** Default WebSocket server URL. Uses Render in production. */
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:1234';

/**
 * Predefined cursor colors for collaborative users.
 * Each user is assigned a color based on their clientID modulo this array length.
 */
export const CURSOR_COLORS = [
  '#f472b6', // pink
  '#34d399', // emerald
  '#fbbf24', // amber
  '#60a5fa', // blue
  '#a78bfa', // violet
  '#fb923c', // orange
  '#2dd4bf', // teal
  '#f87171', // red
];

/**
 * Get a cursor color for a given Yjs client ID.
 * @param {number} clientId - The Yjs client ID
 * @returns {string} A hex color string
 */
export function getCursorColor(clientId) {
  return CURSOR_COLORS[clientId % CURSOR_COLORS.length];
}

/**
 * Creates a fully-configured Yjs collaboration setup for a room.
 *
 * @param {string} roomId - The document/room identifier
 * @param {object} [userInfo] - Optional user info for awareness
 * @param {string} [userInfo.name] - The user's display name
 * @param {string} [userInfo.color] - The user's cursor color
 * @returns {{ ydoc: Y.Doc, provider: WebsocketProvider, persistence: IndexeddbPersistence }}
 */
export function createYjsSetup(roomId, userInfo = {}) {
  // 1. Create the Yjs document — the core CRDT data structure
  const ydoc = new Y.Doc();

  // 2. WebSocket provider — syncs the ydoc with the y-websocket server
  //    All clients connected to the same roomId will share state in real-time
  const provider = new WebsocketProvider(WS_URL, roomId, ydoc, {
    connect: true,
    // Reconnection is handled automatically by y-websocket
  });

  // 3. IndexedDB persistence — saves the ydoc locally for offline support
  //    When the user reconnects, changes are synced automatically
  const persistence = new IndexeddbPersistence(roomId, ydoc);

  // 4. Set initial awareness state for this user
  //    Awareness is a separate protocol from the document sync.
  //    It's used for transient, per-user state like cursor position, name, and color.
  const color = userInfo.color || getCursorColor(ydoc.clientID);
  provider.awareness.setLocalStateField('user', {
    name: userInfo.name || 'Anonymous',
    color: color,
    colorLight: color + '33', // 20% opacity for selection highlight
  });

  return { ydoc, provider, persistence };
}

/**
 * Cleans up a Yjs setup — call this on component unmount.
 * @param {{ ydoc: Y.Doc, provider: WebsocketProvider, persistence: IndexeddbPersistence }} setup
 */
export function destroyYjsSetup({ ydoc, provider, persistence }) {
  provider?.disconnect();
  provider?.destroy();
  persistence?.destroy();
  ydoc?.destroy();
}
