import './App.css';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import.meta.env

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function fetchUserData() {
  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setUserId(user.id); // Get the current user ID
    }
  }, []);
  
  try {
    const { data, error } = await supabase
      .from('users')  // Name of the table
      .select('*')    // Fetch all columns or specify specific columns
      .eq('user_id', user.id)  // Fetch based on userId (or any other unique field)
      .single();

    if (error) throw error;

    return data
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// We'll use an async IIFE to get the current user
const getCurrentUser = async () => {
  const user = supabase.auth.user();
  if (user) {
    const userData = await fetchUserData();
    return userData;
  } else {
    return null;
  }
};

const systemMessageGeneralConsult = {
  "role": "system",
  "content": `
    You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals. Provide an IN-DEPTH and INFORMATIVE general consultation about health and fitness, or any general diagnoses for the user. Please provide real-world references to your explanations whenever possible, and try to be ENCOURAGING and MOTIVATING to the user.

    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.
  `
};

const systemMessageWorkoutPlanNotGenerated = {
  "role": "system",
  "content": `
    You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals.
    Please generate a 7 WORKOUT PLAN for the user to follow. Each day will consist of ONE WORKOUT OR A REST DAY. Provide a brief introduction to each workout, and please insert a NEW LINE for every workout DAY.
      
    for WORKOUT/REST-DAY, choose one and fill in only [workout] when you choose WORKOUT
      strictly follow this format:
      DAY 1: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 2: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 3: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 4: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 5: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 6: 
      <WORKOUT/REST-DAY> <workout>
      
      DAY 7: 
      <WORKOUT/REST-DAY> <workout>
      
    Do not write anything before typing DAY 1 
    
    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.
  `
};

const systemMessageWorkoutPlanGenerated = {
  "role": "system",
  "content": `
    You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals.


    Please provide consultation to the user regarding their current WORKOUT-PLAN. The consultation could be general questions, questions regarding specific workouts, recommending workouts based on the constraints of the user, among other things. The user will ask about a particular day of a week of their workout plan. 

    THIS IS THEIR CURRENT DAY OF THE WORKOUT PLAN: 
    XXXXXXXXXX

    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.
  `
};

const systemMessageMealNotGenerated = {
  "role": "system",
  "content": `
    You are DIonysus. Like the Roman God, you are a symbol of nutrition, health and wellbeing. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals.
    Please generate a 7 DAYS MEAL PLAN for the user to follow. Each day will consist of BREAKFAST, LUNCH, and DINNER. Provide JUST A BRIEF introduction to each meal. 

    PLEASE STRICTLY FOLLOW THIS FORMAT; PROVIDE JUST A BRIEF DESCRIPTION OF THE MEAL AND NOT THE RECIPE; MAKE SURE TO INCLUDE THE MEAL FOR EACH DAY OF THE WEEK:
    strictly follow this format:
    DAY 1: 
    BREAKFAST: <Meal>
    LUNCH:  <Meal>
    DINNER: <Meal>
    DAY 2: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 3: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 4: 
    BREAKFAST: <Meal>
    LUNCH:  <Meal>
    DINNER: <Meal>
    DAY 5: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 6: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 7: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>

    NOTE: Fill in the <Meal> field with the generated meal
    
    Do not write anything before typing DAY 1
    
    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.
  `
};

const systemMessageMealGenerated = {
  "role": "system",
  "content": `
    You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals.

    Please provide consultation to the user regarding their current MEAL-PLAN. The consultation could be general questions, questions regarding recipes, among other things.  The user will ask about a particular day of a week of their meal plan. 

    THIS IS THEIR CURRENT DAY OF THE MEAL PLAN: 
    XXXXXXXXXX

    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.
  `
};

const systemMessageRemedy = {
  "role": "system",
  "content":`
    You are Hercules. Like the Roman God, you are a symbol of strength, well-being, motivation, and encouragement. In this context, you are also an expert of health and fitness and are trying to help the user with their fitness goals.

    KEEP IN MIND THE CONTEXT OF THE USER:
    The WORKOUT PREFERENCE of the user are to: ${getCurrentUser.userWorkoutPreferences}.
    The User is ${getCurrentUser.userAge} years old, ${getCurrentUser.userGender}, and is located in ${getCurrentUser.userLocation}.
    They have these ALLERGY(S): ${getCurrentUser.userAllergies}.
    The BMI of the user is ${getCurrentUser.userBmi}.

    HERE IS THE CURRENT MEAL PLAN OF THE USER: 

    GENERATE A NEW MEAL PLAN SUCH THAT IT STILLS IN LINE WITH THE USER GOALS. 
    PLEASE STRICTLY FOLLOW THIS FORMAT: 
    DAY 1: 
    BREAKFAST: <Meal>
    LUNCH:  <Meal>
    DINNER: <Meal>
    DAY 2: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 3: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 4: 
    BREAKFAST: <Meal>
    LUNCH:  <Meal>
    DINNER: <Meal>
    DAY 5: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 6: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>
    DAY 7: 
    BREAKFAST: <Meal>
    LUNCH: <Meal>
    DINNER: <Meal>

    NOTE: Fill in the <Meal> field with the generated meal
  `
};

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
      await processMessageToConsult(newMessages);
    } else if (mealPlan) {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
          };
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processMealPlan(newMessages);

        
    } else if (workoutPlan) {
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processWorkoutPlan(newMessages);        
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
    } else {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = messageObject.sender === "Hercules" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
          });
        
          const apiRequestBody = {
            "model": "gpt-4o-mini", 
            "messages": [
              systemMessageMealNotGenerated,
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
            setIsMealGenerated(true);
          }
    }
    
  }
  
  
  async function processMessageToConsult(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Hercules" ? "assistant" : "user";
      return { role: role, content: messageObject.message }
    });
  
    const apiRequestBody = {
      "model": "gpt-4o-mini", 
      "messages": [
        systemMessageGeneralConsult,
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
  
async function processWorkoutPlan(chatMessages) {
    if (workoutGenerated) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = messageObject.sender === "Hercules" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
          });
        
          const apiRequestBody = {
            "model": "gpt-4o-mini", 
            "messages": [
              systemMessageWorkoutPlanGenerated,
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
    } else {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = messageObject.sender === "Hercules" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
          });
        
          const apiRequestBody = {
            "model": "gpt-4o-mini", 
            "messages": [
              systemMessageWorkoutPlanNotGenerated,
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
            setIsWorkoutGenerated(true);
          }
    }
  }

  async function processMealPlan(chatMessages) {
    // IF THE MEAL PLAN HAS BEEN GENERATED
    if (mealGenerated) {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = messageObject.sender === "Hercules" ? "assistant" : "user";
        return { role: role, content: messageObject.message }
      });

      const apiRequestBody = {
        "model": "gpt-4o-mini",
        "messages": [
          systemMessageMealGenerated,
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

      // IF THE MEAL PLAN HAS NOT BEEN GENERATED
    } else {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = messageObject.sender === "Hercules" ? "assistant" : "user";
        return { role: role, content: messageObject.message }
      });

      const apiRequestBody = {
        "model": "gpt-4o-mini",
        "messages": [
          systemMessageMealNotGenerated,
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
        setIsMealGenerated(true);
      }
    }

  }

  //Process General Consultation
  async function processMessageToConsult(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Hercules" ? "assistant" : "user";
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model": "gpt-4o-mini",
      "messages": [
        systemMessageGeneralConsult,
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
  
async function processWorkoutPlan(chatMessages) {
    if (workoutGenerated) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = messageObject.sender === "Hercules" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
          });
        
          const apiRequestBody = {
            "model": "gpt-4o-mini", 
            "messages": [
              systemMessageWorkoutPlanGenerated,
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
    } else {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = messageObject.sender === "Hercules" ? "assistant" : "user";
            return { role: role, content: messageObject.message }
          });
        
          const apiRequestBody = {
            "model": "gpt-4o-mini", 
            "messages": [
              systemMessageWorkoutPlanNotGenerated,
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
            setIsWorkoutGenerated(true);
          }
    }
  }
  
  async function processRemedy(chatMessages) {
        if (remedyGenerated) {
            let apiMessages = chatMessages.map((messageObject) => {
                let role = messageObject.sender === "Hercules" ? "assistant" : "user";
                return { role: role, content: messageObject.message }
            });
            
            const apiRequestBody = {
                "model": "gpt-4o-mini", 
                "messages": [
                systemMessageGeneralConsult,
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
        } else {
            let apiMessages = chatMessages.map((messageObject) => {
                let role = messageObject.sender === "Hercules" ? "assistant" : "user";
                return { role: role, content: messageObject.message }
            });
            
            const apiRequestBody = {
                "model": "gpt-4o-mini", 
                "messages": [
                systemMessageGeneralConsult,
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
                setIsRemedyGenerated(true);
            }
        }
    }

  return (
    <div className="flex flex-col max-h-[90vh] h-screen ">
        <div className="flex-grow p-4 md:p-8 bg-gray-100 overflow-y-auto"> {/* Chat area - full height with scroll */}
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'} mb-4`}>
                    <div className={`p-2 md:p-3 rounded-lg text-left ${message.direction === 'incoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-xs md:max-w-md lg:max-w-lg`}>
                      <div dangerouslySetInnerHTML={{__html: message.message }} />
                    </div>
                </div>
            ))}``
            {isTyping && (
                <div className="flex justify-start mb-4">
                    <div className="p-2 md:p-3 rounded-lg bg-blue-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Hercules is typing...
                    </div>
                </div>
            )}
            {/* {imageIsLoading && (
                <div className="flex justify-start mb-4">
                    <div className="p-2 md:p-3 rounded-lg bg-blue-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Generating image...
                    </div>
                </div>
            )} */}
        </div>
        <div className="py-4">
            <button className="rounded-lg bg-blue-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                MyMeals
            </button>
        </div>
        <div className="p-4 md:p-6 border-t border-gray-200"> {/* Input area - sticks to bottom */}
            <input 
                type="text"
                placeholder="What do you require from the gods"
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