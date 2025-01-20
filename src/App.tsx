import React, { useEffect, useState, Suspense } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Header from './Header';
import QuoteManager from './QuoteManager';
import { loginWithGoogle } from './oauth';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgotPassword'>('login');

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginWithGoogle = async () => {
    loginWithGoogle();
  };

  const handleLoginWithEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in:', error.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleSignUpWithEmail = async () => {
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) {
      console.error('Error verifying OTP:', error.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Error sending password reset email:', error.message);
    } else {
      setEmailSent(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {!session ? (
          <div className="flex flex-col items-center justify-center flex-grow h-full w-full mt-16">

            <div className="flex flex-col items-center mt-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-4 py-2 ${activeTab === 'login' ? 'bg-white shadow-md' : 'bg-gray-300'} border border-gray-300`}
                >
                  Login with Email
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`px-4 py-2 ${activeTab === 'signup' ? 'bg-white shadow-md' : 'bg-gray-300'} border border-gray-300`}
                >
                  Sign Up with Email
                </button>
              </div>
              {activeTab === 'login' ? (
                <>
                  <button
                    onClick={handleLoginWithGoogle}
                    className="flex items-center mx-0 my-6 px-4 py-2 border border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100"
                  >
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google logo"
                      className="w-5 h-5 mr-2"
                    />
                    Login with Google
                  </button>

                  <span className='flex gap-0 items-center justify-center w-2/3'>
                    <span className='my-4 border-b border-gray-400 w-full'></span><span>Or</span><span className='my-4 border-b border-gray-400 w-full'></span>
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <button
                    onClick={handleLoginWithEmail}
                    className="m-2 px-4 py-2 border border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100"
                  >
                    Login with Email
                  </button>

                  <a
                    href="#"
                    onClick={() => setActiveTab('forgotPassword')}
                    className="text-blue-500 hover:underline mt-2"
                  >
                    Forgot Password?
                  </a>
                </>
              ) : activeTab === 'signup' ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <button
                    onClick={handleSignUpWithEmail}
                    className="m-2 px-4 py-2 border border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100"
                  >
                    Sign Up with Email
                  </button>
                  {otpSent && (
                    <div className="flex flex-col items-center">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP"
                        className="m-2 p-2 border border-gray-300"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        className="m-2 px-4 py-2 border border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="m-2 p-2 border border-gray-300"
                  />
                  <button
                    onClick={handleForgotPassword}
                    className="m-2 px-4 py-2 border border-gray-300 shadow-md bg-white text-gray-700 font-medium hover:bg-gray-100"
                  >
                    Reset Password
                  </button>
                  {emailSent && <p className="text-green-500">Check your email for the password reset link!</p>}
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mt-4 flex gap-2 justify-end items-center">
              <p className="m-0 px-4 py-2 text-zinc-900 font-medium">
                {session.user?.email}
              </p>
              <button
                onClick={handleLogout}
                className="m-0 px-4 mb-8 mt-12 py-2 shadow-md bg-amber-400 text-zinc-900 font-medium hover:border-zinc-800 hover:bg-amber-400/70 hover:border hover:text-zinc-800"
              >
                Logout
              </button>
            </div>
            <QuoteManager session={session} />
          </>
        )}
      </Suspense>
    </div>
  );
};

export default App;