import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Remove the boot spinner once React has actually painted, rather than on the
// arbitrary 1200ms timer index.html used to run. That timer meant the spinner
// either covered a ready page or disappeared while the page was still blank.
requestAnimationFrame(() => {
  document.getElementById('boot')?.remove();
});
