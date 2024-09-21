import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  return (
    <nav className="fixed left-0 flex flex-col h-screen w-1/6 py-6 bg-[#333333] text-white">
      <div className="p-4">
        <Link to="/" className="text-4xl mb-8 font-bold block text-[#C87FEB]">PowerPlate</Link>
      </div>
      <div className="flex flex-col w-5/6 mx-auto space-y-2">
      <span className="block h-16 px-3 text-lg">Hello {username}!</span>
      <Link to="/meals" className="block w-full h-11 px-3 py-2.5 text-white hover:bg-[#444444] rounded-lg">
          <div class="flex flex-row h-full">
            <img src="src/assets/Food-s.png" class="size-6 mr-4" />
            <h3>MyMeals</h3>
          </div>
        </Link>
        <Link to="/workouts" className="block w-full h-11 px-3 py-2.5 text-white hover:bg-[#444444] rounded-lg">
          <div class="flex flex-row h-full">
            <img src="src/assets/Workout-s.png" class="size-6 mr-4" />
            <h3>MyWorkout</h3>
          </div>
        </Link>
        <Link to="/chat" className="block w-full h-11 px-3 py-2.5 text-white hover:bg-[#444444] rounded-lg">
          <div class="flex flex-row h-full">
            <img src="src/assets/Chat-s.png" class="size-6 mr-4" />
            <h3>Chat</h3>
          </div>
        </Link>
        <hr />
        <Link to="/" className="block w-full h-11 px-3 py-2.5 text-white hover:bg-[#444444] rounded-lg">
          <div class="flex flex-row h-full">
            <img src="src/assets/home-s.png" class="size-6 mr-4" />
            <h3>Home</h3>
          </div>
        </Link>
        <button onClick={onLogout} className="absolute bottom-5 w-4/5 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;