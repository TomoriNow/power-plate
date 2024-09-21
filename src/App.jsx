import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import CustomAuth from './CustomAuth'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


const ANON_KEY = import.meta.env.VITE_ANON_API_KEY;
console.log('ANON_KEY:', ANON_KEY);
const supabase = createClient('https://lufswepdkuvvgsrmqist.supabase.co', ANON_KEY)
console.log('Supabase client:', supabase);
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [count, setCount] = useState(0)
  const [session, setSession] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchUsername(session.user.id)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchUsername(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])
  
  const fetchUsername = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('user_id', userId)
      .single()
    console.log('Data: ', data)

    if (error) {
      console.error('Error fetching username:', error)
    } else if (data) {
      setUsername(data.username)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUsername('')
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
  else {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar onLogout={handleLogout} username={username} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Your routes here */}
            </Routes>
          </main>
        </div>
      </Router>
    )
  }
}

export default App
