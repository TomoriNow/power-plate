import { 
     systemMessageWorkoutPlanGenerated, 
    systemMessageWorkoutPlanNotGenerated 
  } from '../constants/systemMessages';
import.meta.env  

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY 
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
async function processWorkoutPlan(chatMessages, workoutGenerated, setIsWorkoutGenerated, setMessages, setIsTyping) {
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

              const parsed_workout = parseWorkouts(formattedResponse);
              const { error: updateError } = await supabase
              .from('meal')
              .update({
                parsed_workout.map((day, index) => {
                  return {day: day.day, workout: day.workout}
                })
              })
              .eq('user_id', userId);
        
            if (updateError) {
              setError("Error updating user profile. Please try again.");
            } else {
              onProfileComplete(); // Call this function to update the state in App.jsx
              navigate('/'); // Redirect to main app
            }
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
const parseWorkouts = (text) => {
    // Split the text into lines, filter out empty lines
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // Process each day and get the workout
    const workouts = lines.reduce((acc, line) => {
      // Check for "DAY" followed by a number
      const dayMatch = line.match(/DAY (\d+):/);
      if (dayMatch) {
        // Start a new workout entry for this day
        acc.push({ day: `Day ${dayMatch[1]}`, workout: "" });
      } else {
        // This line contains workout/rest-day information
        const workout = line.trim();
        if (acc.length > 0) {
          acc[acc.length - 1].workout = workout;
        }
      }
      return acc;
    }, []);

    return workouts;
  };

export default processWorkoutPlan