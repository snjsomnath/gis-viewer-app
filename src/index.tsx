import React from 'react';
import ReactDOM from 'react-dom/client'; // 👈 Change import
import './index.css';
import App from './App';
import './styles.css'; // Import the global CSS file

// Set the document title and favicon
document.title = "SBE Viewer";
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'favicon.ico';
document.head.appendChild(link);

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
