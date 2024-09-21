import './App.css';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'


const API_KEY = "";
const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a sports professional with decades of experience in academia, specializing in basketball and the NBA. Whenever possible, list your answers in bullet points for clarity."
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
      message: "Hello, I'm HooperGPT! Ask me anything!",
      sentTime: "just now",
      sender: "HooperGPT",
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
    
    if (message.toLowerCase().includes("image of")) {
      const imageDescription = message.match(/image of (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription);
      console.log("entered first case: image of");
    } else if (message.toLowerCase().includes("picture of")) {
      const imageDescription2 = message.match(/picture of (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription2);
      console.log("entered second case: picture of");
    } else if (message.toLowerCase().includes("show me")) {
      const imageDescription3 = message.match(/show me (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription3);
      console.log("entered third case: show me");
    } else if (message.toLowerCase().includes("show how")) {
      const imageDescription4 = message.match(/show how (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription4);
      console.log("entered fourth case: show how");
    } else if (message.toLowerCase().includes("show a")) {
      const imageDescription5 = message.match(/show a (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription5);
      console.log("entered fifth case: show a");
    } else if (message.toLowerCase().includes("visualize")) {
      const imageDescription6 = message.match(/visualize (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription6);
      console.log("entered sixth case: visualize");
    } else if (message.toLowerCase().includes("visualization")) {
      const imageDescription7 = message.match(/visualization (.*)/i)[1];
      setImageIsLoading(true);
      await fetchAndSetImage(imageDescription7);
      console.log("entered seventh case: visualization"); 
    } else {
      setIsTyping(true);
      await processMessageToHooperGPT(newMessages);
      console.log("entered default case");
    }
  };
  
  // DALL-E API Function to Generate an Image
  async function fetchAndSetImage(prompt) {
    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,   // This should be a text description
          n: 1,             // Number of images to generate
          size: "1024x1024" // Size of the image
        })
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API error response:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
  
      const data = await response.json();
  
      if (data.data && data.data.length > 0) {
        const imageUrl = data.data[0].url;
  
        // Add the image as a new message
        setMessages(prevMessages => [
          ...prevMessages,
          {
            message: `<img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; border-radius: 8px;" />`,
            sender: "HooperGPT",
            direction: "incoming",
          },
        ]);
      } else {
        console.error("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          message: `Sorry, I couldn't generate the image. Please try again later.`,
          sender: "HooperGPT",
          direction: "incoming",
        },
      ]);
    } finally {
      setImageIsLoading(false);
    }
  }
  
  async function processMessageToHooperGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "HooperGPT" ? "assistant" : "user";
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
              sender: "HooperGPT",
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
          sender: "HooperGPT",
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