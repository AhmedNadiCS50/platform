import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { UserSessionProvider } from './context/UserSessionContext.jsx';
import './index.css';
import './responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserSessionProvider>
        <App />
      </UserSessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
