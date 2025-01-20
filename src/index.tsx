import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import ResetPassword from './ResetPassword';
import { UserProvider } from './UserContext';
import "./tailwind.css";

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <App />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Router>
    </UserProvider>
  </React.StrictMode>
);