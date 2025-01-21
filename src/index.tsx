import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import ResetPassword from './ResetPassword';
import { UserProvider } from './UserContext';
import { supabase } from './supabaseClient';
import "./tailwind.css";

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <App />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);