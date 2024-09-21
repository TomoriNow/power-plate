import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import CustomAuth from './CustomAuth'
import Survey from './Survey'
import Chatbot from './Chatbot'

const ANON_KEY = import.meta.env.VITE_ANON_API_KEY;
const supabase = createClient('https://lufswepdkuvvgsrmqist.supabase.co', ANON_KEY)

function ProtectedRoute({ children, isProfileComplete }) {
  const location = useLocation();
  
  if (!isProfileComplete) {
    return <Navigate to="/survey" state={{ from: location }} replace />;
  }
  
  return children;
}

function App() {
  const [session, setSession] = useState(null)
  const [username, setUsername] = useState('')
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUserData(session.user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUserData(session.user.id)
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
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white text-center mb-8">Power Plate</h1>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <CustomAuth supabase={supabase} />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isProfileComplete && <Navbar onLogout={handleLogout} username={username} />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute isProfileComplete={isProfileComplete}>
                  <div>Welcome to PowerPlate!</div>
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
                <ProtectedRoute isProfileComplete={isProfileComplete}>
                  <Chatbot />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App