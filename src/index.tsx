// filepath: /d:/GitHub/CSD_viewer/gis-viewer-app/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

document.title = "GIS Viewer App";
const link = document.createElement('link');
link.rel = 'icon';
link.href = '../../public/favicon.ico';
document.head.appendChild(link);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);