import './App.css';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'


const API_KEY = "";
const systemMessage = {
    "role": "system",
    "content": `
      You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals. Provide an IN-DEPTH and INFORMATIVE general consultation about health and fitness, or any general diagnoses for the user. Please provide real-world references to your explanations whenever possible, and try to be ENCOURAGING and MOTIVATING to the user.
  
      KEEP IN MIND THE CONTEXT OF THE USER:
      The GOALS of the user are to: [USER_GOALS].
      They have these ALLERGY(S): [USER_ALLERGIES].
      They have these INJURY and PHYSICAL CONSTRAINT(S): [USER_INJURIES].
    `
  }

function formatResponse(text) {
  // Replace ### headers with <h3> tags
  text = text.replace(/^###\s*(.*?)$/gm, '<h3>$1</h3>');
  
  // Replace **bold** with <strong> tags
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace bullet points (both • and -) at the start of a line with <li> tags
  text = text.replace(/^[•-]\s*(.*?)$/gm, '<li>$1</li>');
  
  // Wrap lists in <ul> tags
  text = text.replace(/(<li>.*<\/li>)\n(?!<li>)/gs, '<ul>$1</ul>\n');
  
  // Split the text into paragraphs
  const paragraphs = text.split('\n\n');
  
  // Wrap each paragraph in a <p> tag, unless it's already a header or list
  const formattedParagraphs = paragraphs.map(p => {
    if (p.startsWith('<h3>') || p.startsWith('<ul>')) {
      return p;
    }
    return `<p>${p}</p>`;
  });
  
  // Join the paragraphs back together
  return formattedParagraphs.join('');
}


function Chatbot() {
  //const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Hercules! Ask me anything!",
      sentTime: "just now",
      sender: "Hercules",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [imageIsLoading, setImageIsLoading] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };
  
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    
    setIsTyping(true);
    await processMessageToPlateGPT(newMessages);
  
  };
  
  
  async function processMessageToPlateGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Hercules" ? "assistant" : "user";
      return { role: role, content: messageObject.message }
    });
  
    const apiRequestBody = {
      "model": "gpt-4o-mini", 
      "messages": [
        systemMessage,
        ...apiMessages 
      ]
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        let rawResponse = data.choices[0].message.content;
        const formattedResponse = formatResponse(rawResponse);
          setMessages(prevMessages => [
            ...prevMessages,
            {
              message: formattedResponse,
              sender: "Hercules",
              direction: "incoming",
            },
          ]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          message: `I'm sorry, I encountered an error while processing your request: ${error.message}.`,
          sender: "Hercules",
          direction: "incoming",
        },
      ]);
    } finally {
      setIsTyping(false);
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
                    <div className="p-2 md:p-3 rounded-lg bg-blue-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Hooper-GPT is typing...
                    </div>
                </div>
            )}
            {imageIsLoading && (
                <div className="flex justify-start mb-4">
                    <div className="p-2 md:p-3 rounded-lg bg-blue-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Generating image...
                    </div>
                </div>
            )}
        </div>
        <div className="p-4 md:p-6 bg-white border-t border-gray-200"> {/* Input area - sticks to bottom */}
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