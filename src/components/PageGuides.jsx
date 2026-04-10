import React, { useState, useEffect, useRef } from 'react';

export default function PageGuides({ editor, showNumbers = true }) {
  const [pages, setPages] = useState(1);
  const containerRef = useRef(null);
  const PAGE_HEIGHT = 1123; // A4 height at 96 DPI

  useEffect(() => {
    if (!editor) return;

    const updatePages = () => {
      const dom = editor.view.dom;
      if (dom) {
        // We add some buffer for padding
        const totalHeight = dom.scrollHeight + 150; 
        const count = Math.max(1, Math.ceil(totalHeight / PAGE_HEIGHT));
        setPages(count);
      }
    };

    updatePages();
    editor.on('update', updatePages);
    
    // Also update on resize
    const resizeObserver = new ResizeObserver(updatePages);
    resizeObserver.observe(editor.view.dom);

    return () => {
      editor.off('update', updatePages);
      resizeObserver.disconnect();
    };
  }, [editor]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" ref={containerRef}>
      {Array.from({ length: pages }).map((_, i) => (
        <React.Fragment key={i}>
          {/* Page Number Label (if enabled) */}
          {showNumbers && (
            <div 
              className="page-number-label" 
              style={{ top: `${(i + 1) * PAGE_HEIGHT - 40}px` }}
            >
              Page {i + 1}
            </div>
          )}
          
          {/* Page Break Line (except for last page) */}
          {i < pages - 1 && (
            <div 
              className="page-break-indicator" 
              style={{ top: `${(i + 1) * PAGE_HEIGHT}px` }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
