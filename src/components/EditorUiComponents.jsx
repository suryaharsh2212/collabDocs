import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Reusable Toolbar Button with Tooltip
 */
export const ToolbarButton = ({ 
  icon, 
  onClick, 
  active = false, 
  disabled = false, 
  tooltip,
  className = "" 
}) => {
  return (
    <div className="relative group/tooltip">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
          ${active 
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'
          }
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        {icon}
      </button>
      {tooltip && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--surface-4)] text-[var(--text-primary)] text-[10px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-lg border border-[var(--glass-border)]">
          {tooltip}
        </div>
      )}
    </div>
  );
};

/**
 * Dropdown for Selecting Options (Fonts, Sizes, Styles)
 */
export const ToolbarDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  icon, 
  className = "",
  tooltip
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="group/tooltip">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-all h-8
            ${isOpen ? 'bg-[var(--surface-3)] text-[var(--text-primary)]' : ''}
            ${className}
          `}
        >
          {icon && <span className="opacity-70">{icon}</span>}
          <span className="text-xs font-bold truncate max-w-[80px]">
            {selectedOption.label}
          </span>
          <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {tooltip && !isOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--surface-4)] text-[var(--text-primary)] text-[10px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-lg border border-[var(--glass-border)]">
            {tooltip}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 min-w-[140px] glass rounded-lg border border-[var(--glass-border)] p-1 shadow-xl z-50 animate-slide-down">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value, opt);
                setIsOpen(false);
              }}
              className={`
                flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                ${value === opt.value 
                  ? 'bg-indigo-500/10 text-indigo-300' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                }
              `}
              style={opt.style || {}}
            >
              {opt.label}
              {value === opt.value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Color Picker for Text and Highlight
 */
export const ToolbarColorPicker = ({ 
  icon, 
  value, 
  onChange, 
  colors, 
  tooltip,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="group/tooltip">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex flex-col items-center justify-center w-8 h-8 rounded-md transition-all
            ${isOpen ? 'bg-[var(--surface-3)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)]'}
            ${className}
          `}
        >
          {icon}
          <div className="w-4 h-0.5 mt-0.5 rounded-full" style={{ backgroundColor: value || 'white' }} />
        </button>
        {tooltip && !isOpen && (
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[var(--surface-4)] text-[var(--text-primary)] text-[10px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-lg border border-[var(--glass-border)]">
            {tooltip}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 p-2 glass rounded-lg border border-[var(--glass-border)] shadow-xl z-50 animate-slide-down min-w-[160px]">
          <div className="grid grid-cols-5 gap-1.5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className={`
                  w-6 h-6 rounded-md border border-[var(--glass-border)] transition-transform hover:scale-110 active:scale-90
                  ${value === color ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0b0d17]' : ''}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="col-span-5 mt-1 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] border-t border-[var(--glass-border)] pt-2"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
