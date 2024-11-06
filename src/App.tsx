// src/App.tsx
import React, { Suspense, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from './UserContext';
import Header from './Header';
import { supabase } from './supabaseClient';
import ClientForm from './ClientForm';

const Form = React.lazy(() => import('./Form'));
const Login = React.lazy(() => import('./Login'));
const QuoteManager = React.lazy(() => import('./QuoteManager'));

const PrivateRoute = ({ element }: { element: React.ReactElement }) => {
  const { session, loading } = useUser();
  return loading ? (
    <div>Loading...</div>
  ) : session ? (
    element
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  const { session, setSession, userProfile, loading } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setShowLogin(false); // Hide login form after successful login
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setSession(null);
      window.location.reload();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      
      <Suspense fallback={<div>Loading...</div>}>
        {showLogin ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            {!session ? (
              <div className="text-center mb-12 mt-4 flex gap-2 justify-center items-center">
                <button
                  onClick={() => setShowLogin(true)}
                  className="m-0 px-4 py-2 border border-gray-900 shadow-md bg-amber-400 text-gray-900 font-medium hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900 "
                >
                  Login
                </button>
                <a
                  href="https://ssta-nts-client.netlify.app/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-0 px-4 py-2 border border-gray-900 shadow-md bg-amber-400 text-gray-900 font-medium hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900 "
                >
                  Sign Up
                </a>
                  
              </div>
            ) : (
              <div className="text-center mt-4 flex gap-2 justify-end items-center">
                <p className="m-0 px-4 py-2 text-gray-900 font-medium">
                  Welcome {userProfile?.first_name}
                </p>

                <button
                  onClick={handleLogout}
                  className="m-0 px-4 mb-8 py-2 border border-gray-900 shadow-md bg-amber-400 text-gray-900 font-medium hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-gray-900 "
                >
                  Logout
                </button>
              </div>
            )}
            <QuoteManager />
          </>
        )}
      
      </Suspense>
    </div>
  );
}

export default App;