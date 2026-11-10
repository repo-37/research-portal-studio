import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {Theme} from '@astryxdesign/core/theme';
import {themes, defaultThemeSlug} from '../astryx-themes';

import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './global.css';

import {App} from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('root element is missing from index.html');
}

// The theme is mounted once, at the root. Every component below reads its
// tokens from here, so a theme swap is a one-line change in astryx-themes.js.
createRoot(container).render(
  <StrictMode>
    <Theme theme={themes[defaultThemeSlug]}>
      <App />
    </Theme>
  </StrictMode>,
);
