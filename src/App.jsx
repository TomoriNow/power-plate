import { useState } from 'react'
import './App.css'
import Chatbot from './Chatbot'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Chatbot/>
    </>
  )
}

export default App
