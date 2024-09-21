import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
  return (
    <nav className="bg-gray-800 text-white h-screen w-56 fixed left-0 top-0 flex flex-col justify-between">
      <div className="p-4">
        <Link to="/" className="text-4xl mb-8 font-bold block text-purple-500">PowerPlate</Link>
        <span className="mt-5 text-lg block mb-8">Hello {username}!</span>
      </div>
      <div className="flex flex-col p-4">
        <Link to="/workouts" className="text-white hover:text-purple-500 px-3 py-2 rounded mb-2">My Workouts</Link>
        <Link to="/meals" className="text-white hover:text-purple-500 px-3 py-2 rounded mb-2">My Meals</Link>
        <Link to="/chat" className="text-white hover:text-purple-500 px-3 py-2 rounded mb-2">Chat With Hercules</Link>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded mt-4">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;