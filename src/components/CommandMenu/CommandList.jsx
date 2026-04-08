import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CommandList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = index => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-[var(--surface-2)] shadow-2xl border border-[var(--surface-4)] rounded-xl py-2 w-72 overflow-hidden z-[9999] backdrop-blur-sm">
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`flex items-center gap-3 w-full text-left px-4 py-2 transition-all ${
              index === selectedIndex
                ? 'bg-indigo-600 border-l-2 border-indigo-300'
                : 'border-l-2 border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-3)] hover:text-white'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
           {item.icon && (
             <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-indigo-500/50 text-white' : 'bg-[var(--surface-1)] text-[var(--text-muted)]'}`}>
               {item.icon}
             </span>
           )}
           <div className="flex flex-col flex-1 min-w-0">
             <span className={`font-semibold text-sm ${index === selectedIndex ? 'text-white' : 'text-[var(--text-primary)]'}`}>
               {item.title}
             </span>
             {item.description && (
               <span className={`text-[11px] truncate ${index === selectedIndex ? 'text-indigo-200' : 'text-[var(--text-muted)]'}`}>
                 {item.description}
               </span>
             )}
           </div>
          </button>
        ))
      ) : (
        <div className="px-5 py-3 text-sm text-[var(--text-muted)] text-center">No matching commands.</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
export default CommandList;
