import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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

  if (!session) {
    return (<Auth 
      supabaseClient={supabase} 
      // appearance={{ theme: customTheme }} 
      appearance={{
        extend: true,
        style: {
          button: { background: 'red', color: 'white' },
          anchor: { color: 'blue' },
          input: { background: 'indigo'},
          container: {width: '500px', alignContent: 'center'},
        },
      }}
      providers={[]}
    />)
  }
  else {

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
}

export default App
