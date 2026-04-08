import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import DocPage from './pages/DocPage';
import CodePage from './pages/CodePage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing page — create or join a document */}
        <Route path="/" element={<Home />} />
        {/* Editor page — collaborative editing for a specific document room */}
        <Route path="/doc/:roomId" element={<DocPage />} />
        {/* Code page — collaborative coding for a specific code room */}
        <Route path="/code/:roomId" element={<CodePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
