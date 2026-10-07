import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import SiteLayout from './components/SiteLayout.jsx';
import App from './App.jsx';
import About from './pages/About.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Terms from './pages/Terms.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteLayout>
        <Routes>
          <Route path="/"        element={<App />} />
          <Route path="/about"   element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms"   element={<Terms />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  </StrictMode>,
);
