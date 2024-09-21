import './App.css';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import.meta.env

import processMealPlan from './components/services/processMeal';
import processMessageToConsult from './components/services/processConsult';
import processRemedy from './components/services/processRemedy';
import processWorkoutPlan from './components/services/processWorkout';






function Chatbot() {
  //const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Hercules! I'm here to assist you in your fitness journey!",
      sentTime: "just now",
      sender: "Hercules",
      direction: "incoming"
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [consultation, setIsConsultation] = useState(true);
  const [mealPlan, setIsMealPlan] = useState(false);
  const [workoutPlan, setIsWorkoutPlan] = useState(false);
  const [remedy, setIsRemedy] = useState(false);
  const [mealGenerated, setIsMealGenerated] = useState(false);
  const [workoutGenerated, setIsWorkoutGenerated] = useState(false);
  const [remedyGenerated, setIsRemedyGenerated] = useState(false);
  

  const handleSend = async (message) => {

    if (consultation) {
      const newMessage = {
        message,
        direction: 'outgoing',
        sender: "user"
      };

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      setIsTyping(true);
      await processMessageToConsult(newMessages, setMessages, setIsTyping);
    } else if (mealPlan) {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
          };
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processMealPlan(newMessages, mealGenerated, setIsMealGenerated, setMessages, setIsTyping);
        
    } else if (workoutPlan) {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
          };
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processWorkoutPlan(newMessages, workoutGenerated, setIsWorkoutGenerated, setMessages, setIsTyping);
        
    } else {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
          };
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processRemedy(newMessages);
        
    }

  }

  return (
    <div className="flex flex-col h-screen">
        <div className="flex-grow p-4 md:p-8 bg-gray-100 overflow-y-auto"> {/* Chat area - full height with scroll */}
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'} mb-4`}>
                    <div className={`p-2 md:p-3 rounded-lg text-left ${message.direction === 'incoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-xs md:max-w-md lg:max-w-lg`}>
                      <div dangerouslySetInnerHTML={{__html: message.message }} />
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start mb-4">
                    <div className="text-white p-2 md:p-3 rounded-lg bg-blue-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Hercules is typing...
                    </div>
                </div>
            )}
        </div>
        <div className="py-4">
            <button onClick={() => {setIsWorkoutPlan(false); setIsMealPlan(true); setIsConsultation(false); setIsRemedy(false);}} className="mx-4 rounded-lg bg-blue-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                MyMealsChat
            </button>
            <button onClick={() => {setIsWorkoutPlan(true); setIsMealPlan(false); setIsConsultation(false); setIsRemedy(false);}} className="mx-4 rounded-lg bg-blue-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                MyWorkoutChat
            </button>
            <button onClick={() => {setIsWorkoutPlan(false); setIsMealPlan(false); setIsConsultation(false); setIsRemedy(true);}} className="mx-4 rounded-lg bg-blue-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                Remedy
            </button>
        </div>
        <div className="mx-4 p-4 md:p-6 bg-white border-t border-gray-200"> {/* Input area - sticks to bottom */}
            <input 
                type="text"
                placeholder="Type your basketball query here"
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSend(e.target.value);
                        e.target.value = '';
                    }
                }}
            />
        </div>
    </div>
  );
}

export default Chatbot