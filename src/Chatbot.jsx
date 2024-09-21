import './App.css';
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './supabaseClient';
import.meta.env

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY


export async function fetchUserData() {
  useEffect(() => {
    const user = supabase.auth.getUser();
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
  const user = supabase.auth.getUser();
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
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
          };
        
          const newMessages = [...messages, newMessage];
          setMessages(newMessages);
          
          setIsTyping(true);
          await processWorkoutPlan(newMessages);
        
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
          
          // Parse the workout plan
          const mealPlan = parseMealPlan(rawResponse);
          console.log('Parsed meal plan:', mealPlan);
          
          if (mealPlan.length > 0) {
            // Get the current user's ID
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            if (user && user.id) {
              try {
                await insertMealPlan(mealPlan, user.id);
                console.log('Meal plan processed and saved successfully');
              } catch (insertError) {
                console.error('Failed to insert meal plan:', insertError);
                // You might want to add a user-friendly error message here
              }
            } else {
              console.warn('No user found. Meal plan not saved to database.');
            }
          } else {
            console.warn('No valid meal plan found in the response.');
          }
          
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
  
  function parseMealPlan(response) {
    if (typeof response !== 'string' || response === '') {
      console.error('Invalid response format');
      return [];
    }
  
    // Find the position of "DAY 1" and start parsing from there
    const startIndex = response.indexOf('DAY 1');
    if (startIndex === -1) {
      console.error('No valid meal plan days found');
      return [];
    }
  
    // Trim the response from "DAY 1" onward
    const mealPlan = response.slice(startIndex);
  
    // Split the meal plan by 'DAY' and filter out any empty days
    const days = mealPlan.split('DAY').filter(day => day.trim());
  
    // Initialize an empty array to hold parsed days
    const parsedDays = [];
  
    // Parse each day from the meal plan
    days.forEach(day => {
      const lines = day.split('\n').filter(line => line.trim());
  
      if (lines.length < 2) {
        // Skip invalid entries with insufficient data
        return;
      }
  
      // Extract day number
      const dayNum = lines[0].split(':')[0].trim();
  
      // Initialize meals object
      const meals = {
        BREAKFAST: '',
        LUNCH: '',
        DINNER: ''
      };
  
      // Parse meals
      lines.slice(1).forEach(line => {
        const [mealType, ...mealDescription] = line.split(':');
        if (meals.hasOwnProperty(mealType.trim().toUpperCase())) {
          meals[mealType.trim().toUpperCase()] = mealDescription.join(':').trim();
        }
      });
  
      // Add the parsed day to the parsedDays array
      parsedDays.push({
        day: dayNum,
        meals: meals
      });
    });
    
    console.log(parsedDays);
  
    // Ensure we have exactly 7 days (1 to 7)
    const completePlan = [];
    for (let i = 1; i <= 7; i++) {
      const existingDay = parsedDays.find(day => day.day === i.toString());
      if (existingDay) {
        completePlan.push(existingDay);
      } else {
        // If the day is missing, add a default empty day
        completePlan.push({
          day: i.toString(),
          meals: {
            BREAKFAST: '',
            LUNCH: '',
            DINNER: ''
          }
        });
      }
    }
    
    return completePlan;
  }
  
  function parseWorkoutPlan(response) {
    if (typeof response !== 'string' || response === '') {
      console.error('Invalid response format');
      return [];
    }
  
    // Find the position of "DAY 1" and start parsing from there
    const startIndex = response.indexOf('DAY 1');
    if (startIndex === -1) {
      console.error('No valid workout days found');
      return [];
    }
  
    // Trim the response from "DAY 1" onward
    const workoutPlan = response.slice(startIndex);
  
    // Split the workout plan by 'DAY' and filter out any empty days
    const days = workoutPlan.split('DAY').filter(day => day);
  
    // Initialize an empty object to hold parsed days
    const parsedDays = {};
  
    // Parse each day from the workout plan
    days.forEach(day => {
      const lines = day.split('\n').filter(line => line);
  
      if (lines.length < 2) {
        // Skip invalid entries with insufficient data
        return;
      }
  
      // Extract day number and details
      const dayNum = lines[0].replace(':', '').trim();
      let type = lines[1].toUpperCase().startsWith('REST-DAY') ? 'REST-DAY' : 'WORKOUT';
      let workout = lines.slice(2).join(' ').trim();
  
      // If the workout description is blank, set the type to REST-DAY
      if (!workout) {
        type = 'REST-DAY';
        workout = ''; // Ensure workout is blank for REST-DAY
      }
  
      // Add the parsed day to the parsedDays object
      parsedDays[dayNum] = {
        day: dayNum,
        type: type,
        workout: workout
      };
    });
  
    // Ensure we have exactly 7 days (1 to 7)
    const completePlan = [];
    for (let i = 1; i <= 7; i++) {
      const dayStr = i.toString(); // Convert to string for key lookup
      if (parsedDays[dayStr]) {
        completePlan.push(parsedDays[dayStr]);
      } else {
        // If the day is missing in the parsedDays, add a default REST-DAY
        completePlan.push({
          day: dayStr,
          type: 'REST-DAY',
          workout: ''
        });
      }
    }
    
    return completePlan;
  }
  
  async function insertMealPlan(mealPlan, userId) {
    if (!userId) {
      console.error('No user ID provided. Cannot insert meal plan.');
      return;
    }
  
    try {
      // First, check if the user exists in the users table
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();
  
      if (userError) {
        if (userError.code === 'PGRST116') {
          console.log(`User with id ${userId} not found in the users table. Attempting to create...`);
          // User doesn't exist, so let's create them
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({ user_id: userId })
            .single();
  
          if (createError) throw createError;
          user = newUser;
        } else {
          throw userError;
        }
      }
      
      for (const day of mealPlan) {
        const {data, error} = await supabase
          .from('meal_plans')
          .upsert({
            user_id: userId,
            day: day.day,
            meal_plan: day.meal_plan
            //explanation: day.explanation // Include Explanation if needed
          }, {
            onConflict: 'user_id,day'
          });
          
          if (error) throw error;
      }
      console.log('Meal plan inserted successfully');
    } catch (error) {
      console.error('Error inserting meal plan:', error);
      throw error; // Re-throw the error so it can be caught and handled by the caller
    }
}
  
  async function insertWorkoutPlan(workoutPlan, userId) {
    if (!userId) {
      console.error('No user ID provided. Cannot insert workout plan.');
      return;
    }
  
    try {
      // First, check if the user exists in the users table
      let { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();
  
      if (userError) {
        if (userError.code === 'PGRST116') {
          console.log(`User with id ${userId} not found in the users table. Attempting to create...`);
          // User doesn't exist, so let's create them
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({ user_id: userId })
            .single();
  
          if (createError) throw createError;
          user = newUser;
        } else {
          throw userError;
        }
      }
  
      // If we reach here, the user exists (or was just created), so we can proceed with inserting the workout plan
      for (const day of workoutPlan) {
        const { data, error } = await supabase
          .from('workout_plans')
          .upsert({
            user_id: userId,
            day: day.day,
            workout: day.type === 'REST-DAY' ? 'Rest Day' : day.workout
          }, {
            onConflict: 'user_id,day'
          });
  
        if (error) throw error;
      }
      console.log('Workout plan inserted successfully');
    } catch (error) {
      console.error('Error inserting workout plan:', error);
      throw error; // Re-throw the error so it can be caught and handled by the caller
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
          console.log('Raw API response:', rawResponse);
          const formattedResponse = formatResponse(rawResponse);
          
          // Parse the workout plan
          const workoutPlan = parseWorkoutPlan(rawResponse);
          console.log('Parsed workout plan:', workoutPlan);
          
          if (workoutPlan.length > 0) {
            // Get the current user's ID
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            if (user && user.id) {
              try {
                await insertWorkoutPlan(workoutPlan, user.id);
                console.log('Workout plan processed and saved successfully');
              } catch (insertError) {
                console.error('Failed to insert workout plan:', insertError);
                // You might want to add a user-friendly error message here
              }
            } else {
              console.warn('No user found. Workout plan not saved to database.');
            }
          } else {
            console.warn('No valid workout plan found in the response.');
          }
          
          setMessages(prevMessages => [
            ...prevMessages,
            {
              message: formattedResponse,
              sender: "Hercules",
              direction: "incoming",
            },
          ]);
        } else {
          throw new Error('No valid response from the API');
        }
      } catch (error) {
        console.error("Error processing message:", error);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            message: `I'm sorry, I encountered an error while processing your request: ${error.message}. Please try again.`,
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
    <div className="flex flex-col h-screen flex-grow ml-64 p-8">
        <div className="flex-grow p-4 md:p-8 bg-gray-100 overflow-y-auto"> {/* Chat area - full height with scroll */}
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.direction === 'incoming' ? 'justify-start' : 'justify-end'} mb-4`}>
                    <div className={`p-2 md:p-3 rounded-lg text-left ${message.direction === 'incoming' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-xs md:max-w-md lg:max-w-lg`}>
                      <div dangerouslySetInnerHTML={{__html: message.message }} />
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start mb-4">
                    <div className="text-white p-2 md:p-3 rounded-lg bg-purple-500 max-w-xs md:max-w-md lg:max-w-lg">
                        Hercules is typing...
                    </div>
                </div>
            )}
        </div>
        <div className="py-4">
            <button onClick={() => {setIsWorkoutPlan(false); setIsMealPlan(true); setIsConsultation(false); setIsRemedy(false);}} className="mx-4 rounded-lg bg-purple-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                MyMealsChat
            </button>
            <button onClick={() => {setIsWorkoutPlan(true); setIsMealPlan(false); setIsConsultation(false); setIsRemedy(false);}} className="mx-4 rounded-lg bg-purple-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                MyWorkoutChat
            </button>
            <button onClick={() => {setIsWorkoutPlan(false); setIsMealPlan(false); setIsConsultation(false); setIsRemedy(true);}} className="mx-4 rounded-lg bg-purple-500 text-white font-bold py-2 px-4 hover:bg-blue-700">
                Remedy
            </button>
        </div>
        <div className="mx-4 p-4 md:p-6 bg-white border-t border-gray-200"> {/* Input area - sticks to bottom */}
            <input 
                type="text"
                placeholder="Type your basketball query here"
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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