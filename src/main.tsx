import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@fontsource/dseg7-classic/400.css';
import '@fontsource/dseg7-classic/700.css';
import '@fontsource/dseg7-modern/400.css';
import '@fontsource/dseg7-modern/700.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
