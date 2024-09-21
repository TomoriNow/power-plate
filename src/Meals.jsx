import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
const Meals = () => {
  const [mealPlan, setMealPlan] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('meal_plans')
        .select('day, meal_plan')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert the array of meal plans into an object keyed by day
      const mealPlanObject = data.reduce((acc, curr) => {
        acc[curr.day] = JSON.parse(curr.meal_plan);
        return acc;
      }, {});

      setMealPlan(mealPlanObject);
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMealCard = (mealType, mealDescription) => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{mealType}</h3>
      <p className="text-gray-600">{mealDescription}</p>
    </div>
  );

  const renderMealPlanDay = () => {
    const dayMeals = mealPlan[selectedDay];
    
    if (!dayMeals) return <p className="text-gray-600">No meal plan found for this day.</p>;

    return (
      <div className="space-y-4">
        {renderMealCard('BREAKFAST', dayMeals.BREAKFAST)}
        {renderMealCard('LUNCH', dayMeals.LUNCH)}
        {renderMealCard('DINNER', dayMeals.DINNER)}
      </div>
    );
  };

  if (loading) return <p className="ml-60 text-center text-gray-600">Loading...</p>;
  if (error) return <p className="ml-60 text-center text-red-600">Error: {error}</p>;

  if (Object.keys(mealPlan).length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">You don't have a meal plan yet. Why not create one?</p>
        <button 
          onClick={() => {/* Navigate to meal plan creation */}} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            <Link to="/chat">
          Create Meal Plan
          </Link>
        </button>
      </div>
    );
  }

  return (
    <div className="w-2/3 ml-60 p-4">
      <div className="flex flex-row space-x-2 mb-6 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`basis-1/5 px-4 py-2 rounded-full ${
              selectedDay === day
                ? 'bg-[#C87EFB] text-white'
                : 'bg-[#333333] text-white hover:bg-[#444444]'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Day {selectedDay}</h3>
        {renderMealPlanDay()}
      </div>
    </div>
  );
};

export default Meals;