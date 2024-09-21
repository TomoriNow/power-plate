import React from 'react';
import { Link } from 'react-router-dom';

function Card() {
    return (
        <div class="flex justify-center space-x-4">
            <div class="my-10 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to="/meal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">MyMeal</h5>
                </Link>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"></p>
            </div>

            <div class="my-10 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to="/chat">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Chat with Hercules</h5>
                </Link>

            </div>

            <div class="my-10 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <Link to="/workout">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">MyWorkout</h5>
                </Link>
            </div>
        </div>

    )
}

export default Card;