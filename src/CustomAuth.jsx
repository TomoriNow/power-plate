import React, { useState } from 'react';

const CustomAuth = ({ supabase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
  
    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();
  
    if (checkError) {
      setError('Error checking username');
      return;
    }
  
    if (existingUser) {
      setError('Username already exists');
      return;
    }
  
    // Sign up without email confirmation
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null, // Skip email confirmation
      },
    });
  
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
  
    if (data.user) {
      // Insert the username into the public.users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({ user_id: data.user.id, username });
  
      if (insertError) {
        setError('Error creating user profile');
        return;
      }
  
      // No need to sign in again since user is automatically signed in
      // You can redirect or update your app state here
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        if (error.status === 429) {
            setError("Too many attempts. Please wait a moment and try again.");
        } else {
            setError(error.message);
        }
    }
  };

  return (

    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsSignUp(false)}
          className={`px-4 py-2 rounded ${!isSignUp ? 'bg-black text-white border-purple-500 border-2' : 'bg-white text-black border-black'}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`px-4 py-2 rounded ${isSignUp ? 'bg-black text-white border-purple-500 border-2' : 'bg-white text-black border-black'}`}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-black text-white border border-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-8 bg-black text-white border border-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-black text-white border border-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
        )}
        <hr />
        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CustomAuth;