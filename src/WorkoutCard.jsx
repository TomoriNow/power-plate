import React from 'react';

const WorkoutCard = ({ day, workout }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Day {day}</h3>
      <p>{workout}</p>
    </div>
  );
};

export default WorkoutCard;