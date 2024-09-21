import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, username }) => {
    return (
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">PowerPlate</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Hello! {username}</span>
              <Link to="/workouts" className="hover:bg-gray-700 px-3 py-2 rounded">My Workout</Link>
              <Link to="/meals" className="hover:bg-gray-700 px-3 py-2 rounded">My Meals</Link>
              <Link to="/chat" className="hover:bg-gray-700 px-3 py-2 rounded">Chat With Hercules</Link>
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;