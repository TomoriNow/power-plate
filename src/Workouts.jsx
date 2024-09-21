import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Adjust the import path as needed
import { Link } from 'react-router-dom';

const Workouts = () => {
  const [workoutPlan, setWorkoutPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('workout_plans')
        .select('day, workout')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert the array of workouts into an object keyed by day
      const workoutObject = data.reduce((acc, curr) => {
        acc[curr.day] = curr.workout;
        return acc;
      }, {});

      setWorkoutPlan(workoutObject);
    } catch (err) {
      console.error('Error fetching workout plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutDay = () => {
    const workout = workoutPlan[selectedDay];
    
    if (!workout) return <p className="text-gray-600">No workout plan found for this day.</p>;

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Day {selectedDay}</h2>
        <div className="text-gray-700">
          {workout.toLowerCase() === 'rest day' ? (
            <p>Today is a rest day. Take it easy and recover!</p>
          ) : (
            <p>{workout}</p>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  if (Object.keys(workoutPlan).length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">You don't have a workout plan yet. Why not create one?</p>
        <button 
          onClick={() => { }} 
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
            <Link to="/chat">
          Create Workout Plan
          </Link>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-full ${
              selectedDay === day
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>
      
      {renderWorkoutDay()}
      <div>
        
      </div>
    </div>
  );
};

export default Workouts;