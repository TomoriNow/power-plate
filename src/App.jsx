import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import CustomAuth from './CustomAuth'
import Survey from './Survey'
import Chatbot from './Chatbot'
import Landing from './Landing'
import Workouts from './Workouts'
import Meals from './Meals'

const ANON_KEY = import.meta.env.VITE_ANON_API_KEY;
const supabase = createClient('https://lufswepdkuvvgsrmqist.supabase.co', ANON_KEY)

function ProtectedRoute({ children, isProfileComplete, isLoading }) {
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isProfileComplete) {
    return <Navigate to="/survey" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [session, setSession] = useState(null)
  const [username, setUsername] = useState('')
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUserData(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUserData(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('username, weight, height, age, gender, location, workout_preferences, allergies')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user data:', error)
    } else if (data) {
      setUsername(data.username)
      setIsProfileComplete(
        data.weight && data.height && data.age && data.gender && data.location && data.workout_preferences && data.allergies
      )
    }
    setIsLoading(false)
  }

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUsername('')
    setIsProfileComplete(false)
  }

  if (!session) {
    return (
      <div className="flex h-screen">
        {/* Left side */}
        <div className="w-1/2 bg-zinc-900 flex items-center justify-center">
          <div className="text-center justify-center">
            <img src="src/assets/PowerPlate-logo.png" className='flex size-32 mx-auto mb-8' />
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C87FEB] to-cyan-300 mb-4 font-roboto">
              We are PowerPlate
            </h2>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C87FEB] to-cyan-300 font-roboto">
              Your Personal Health Consultant
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 bg-black flex items-center justify-center">
          <div className="w-3/4 max-w-md">
            <CustomAuth supabase={supabase} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isProfileComplete={isProfileComplete} isLoading={isLoading}>
                  <Landing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey"
              element={
                isProfileComplete ? (
                  <Navigate to="/" replace />
                ) : (
                  <Survey
                    supabase={supabase}
                    userId={session.user.id}
                    onProfileComplete={handleProfileComplete}
                  />
                )
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute isProfileComplete={isProfileComplete} isLoading={isLoading}>
                  <Chatbot />
                  <Navbar onLogout={handleLogout} username={username} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute isProfileComplete={isProfileComplete} isLoading={isLoading}>
                  <Workouts />
                  <Navbar onLogout={handleLogout} username={username} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meals"
              element={
                <ProtectedRoute isProfileComplete={isProfileComplete} isLoading={isLoading}>
                  <Meals />
                  <Navbar onLogout={handleLogout} username={username} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </Router>
  )
}

export default App