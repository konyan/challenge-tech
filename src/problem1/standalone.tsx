import React from 'react';
import ReactDOM from 'react-dom/client';
import Problem1 from './Problem1';
import '../index.css';

// biome-ignore lint/style/noNonNullAssertion: <>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '2rem' }}>
      <Problem1 />
    </div>
  </React.StrictMode>
);
