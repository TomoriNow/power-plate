import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


const ANON_KEY = import.meta.env.VITE_ANON_API_KEY;
const supabase = createClient('https://lufswepdkuvvgsrmqist.supabase.co', ANON_KEY)
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [count, setCount] = useState(0)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Auth 
          supabaseClient={supabase} 
          appearance={{
            extend: true,
            className: {
              button: 'bg-red-500 text-white hover:bg-red-600',
              anchor: 'text-blue-500 hover:text-blue-600',
              input: 'bg-indigo-50',
              container: 'w-full max-w-md',
            },
          }}
          providers={[]}
        />
      </div>
    )
  }
  else {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar onLogout={handleLogout} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-8">
                    <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                      <img src={viteLogo} className="h-24 hover:drop-shadow-lg transition-all duration-300" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                      <img src={reactLogo} className="h-24 animate-spin-slow hover:drop-shadow-lg transition-all duration-300" alt="React logo" />
                    </a>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">Vite + React</h1>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <button 
                      onClick={() => setCount((count) => count + 1)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                      count is {count}
                    </button>
                    <p className="mt-4">
                      Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to test HMR
                    </p>
                  </div>
                  <p className="mt-8 text-gray-600">
                    Click on the Vite and React logos to learn more
                  </p>
                </div>
              } />
              {/* Add more routes here for other pages */}
            </Routes>
          </main>
        </div>
      </Router>
    )
  }
}

export default App
