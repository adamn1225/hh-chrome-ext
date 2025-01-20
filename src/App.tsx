import React, { useEffect, useState, Suspense } from 'react';
import { User, UserMetadata } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Header from './Header';
import QuoteManager from './QuoteManager';

const App = () => {
  const [session, setSession] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setSession(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);
      }
      setLoading(false);
    };

    fetchUserProfile();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user ?? null);
      if (session?.user) {
        const fetchProfile = async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUserProfile(profile);
        };
        fetchProfile();
      } else {
        setUserProfile(null);
      }
    });
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {!session ? (
          <div className="text-center mb-12 mt-4 flex gap-2 justify-center items-center">
            <button
              onClick={handleLogin}
              className="m-0 px-4 py-2 border border-zinc-800 shadow-md bg-amber-400 text-zinc-900 font-medium hover:border-gray-900 hover:bg-amber-400/70 hover:border hover:text-zinc-800"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mt-4 flex gap-2 justify-end items-center">
              <p className="m-0 px-4 py-2 text-zinc-900 font-medium">
              </p>
              <button
                onClick={handleLogout}
                className="m-0 px-4 mb-8 mt-12 py-2 shadow-md bg-amber-400 text-zinc-900 font-medium hover:border-zinc-800 hover:bg-amber-400/70 hover:border hover:text-zinc-800"
              >
                Logout
              </button>
            </div>
            <QuoteManager />
          </>
        )}
      </Suspense>
    </div>
  );
};

export default App;