import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import ResetPassword from './ResetPassword';
import { UserProvider } from './UserContext';
import { supabase } from './supabaseClient';
import "./tailwind.css";

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    const newPassword = prompt('Please enter your new password:');
    if (newPassword) {
      supabase.auth.updateUser({ password: newPassword }).then(({ error }) => {
        if (error) {
          alert('Error updating password: ' + error.message);
        } else {
          alert('Password updated successfully!');
        }
      });
    }
  }
});

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);