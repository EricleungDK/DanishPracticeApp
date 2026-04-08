import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApiProvider } from '../../packages/data-layer/src/api-provider';
import { createCapacitorApi } from '../../packages/data-layer/src/capacitor-api';
import { setApiInstance } from './lib/api-instance';
import { initSafeArea } from './lib/safe-area';
import App from './App';
import './index.css';

const api = createCapacitorApi();
setApiInstance(api);

initSafeArea();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ApiProvider value={api}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
);
