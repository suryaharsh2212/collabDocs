import React, { useState, useCallback, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export default function ResizableImageComponent({ node, updateAttributes, selected }) {
  const [isResizing, setIsResizing] = useState(false);
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialMouseX, setInitialMouseX] = useState(0);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    setInitialWidth(parseInt(node.attrs.width) || e.currentTarget.parentElement.clientWidth);
    setInitialMouseX(e.clientX);
  }, [node.attrs.width]);

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e) => {
      const dx = e.clientX - initialMouseX;
      // We only resize from the right side for simplicity
      const newWidth = Math.max(50, Math.min(800, initialWidth + dx));
      updateAttributes({ width: `${newWidth}px` });
    };

    const onMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, initialMouseX, initialWidth, updateAttributes]);

  // Handle alignment
  const containerStyle = {
    display: 'flex',
    justifyContent: 
      node.attrs.textAlign === 'center' ? 'center' : 
      node.attrs.textAlign === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
    margin: '1rem 0',
  };

  return (
    <NodeViewWrapper style={containerStyle}>
      <div 
        className={`relative inline-block transition-shadow ${selected ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}
        style={{ width: node.attrs.width }}
      >
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt} 
          className="block w-full h-auto rounded-lg pointer-events-none"
        />
        
        {selected && (
          <>
            {/* Resize Handle */}
            <div 
              onMouseDown={onMouseDown}
              className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg cursor-nwse-resize transform translate-x-1/2 translate-y-1/2 z-10 hover:scale-125 transition-transform"
            />
            
            {/* Overlay info */}
            <div className="absolute -top-6 right-0 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {node.attrs.width}
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
