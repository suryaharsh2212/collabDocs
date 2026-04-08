/**
 * UserPresence.jsx — Connected User Avatars
 *
 * Reads the connected users from the useYjs hook (via Yjs Awareness protocol)
 * and renders colored avatar circles for each user.
 *
 * Each avatar:
 * - Shows the user's initials
 * - Uses a color that matches their cursor color in the editor
 * - Displays a tooltip with their full name on hover
 * - Slightly overlaps adjacent avatars for a compact, modern look
 */
import PropTypes from 'prop-types';

/**
 * Get initials from a display name
 * @param {string} name
 * @returns {string} 1-2 character initials
 */
function getInitials(name) {
  if (!name || name === 'Anonymous' || name === 'Guest') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || '?';
}

export default function UserPresence({ connectedUsers = [] }) {
  if (connectedUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {/* User count badge */}
      <span className="text-[var(--text-muted)] text-xs mr-1">
        {connectedUsers.length} online
      </span>

      {/* Avatar stack */}
      <div className="flex items-center -space-x-2">
        {connectedUsers.slice(0, 8).map((user) => (
          <div
            key={user.clientId}
            className="group relative"
          >
            {/* Avatar circle */}
            <div
              className={`
                w-7 h-7 rounded-full flex items-center justify-center
                text-[10px] font-bold border-2 border-[var(--surface-0)]
                transition-transform hover:scale-110 hover:z-10 cursor-default
                ${user.isCurrentUser ? 'ring-2 ring-indigo-400/40' : ''}
              `}
              style={{
                backgroundColor: user.color + '33', // 20% opacity background
                color: user.color,
                borderColor: user.isCurrentUser ? user.color : 'var(--surface-0)',
              }}
            >
              {getInitials(user.name)}
            </div>

            {/* Tooltip — shown on hover */}
            <div className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              px-2.5 py-1 rounded-md
              bg-[var(--surface-3)] text-[var(--text-primary)]
              text-xs font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100
              scale-90 group-hover:scale-100
              transition-all duration-150
              pointer-events-none z-50
              shadow-lg
            ">
              <span>{user.name}</span>
              {user.isCurrentUser && (
                <span className="text-[var(--text-muted)]"> (you)</span>
              )}
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--surface-3)]" />
            </div>
          </div>
        ))}

        {/* Overflow indicator */}
        {connectedUsers.length > 8 && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--surface-3)] text-[var(--text-secondary)] border-2 border-[var(--surface-0)]">
            +{connectedUsers.length - 8}
          </div>
        )}
      </div>
    </div>
  );
}

UserPresence.propTypes = {
  /** Array of connected users from useYjs hook */
  connectedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      /** Yjs client ID */
      clientId: PropTypes.number.isRequired,
      /** User display name */
      name: PropTypes.string.isRequired,
      /** User cursor/avatar color (hex) */
      color: PropTypes.string.isRequired,
      /** Whether this is the local user */
      isCurrentUser: PropTypes.bool.isRequired,
    })
  ),
};
