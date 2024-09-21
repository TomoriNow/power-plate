import React from 'react';
import { Link } from 'react-router-dom';

function Card() {
    return (
        <div class="flex flex-row justify-center space-x-4 h-36 text-[#C87FEB]">
            <Link class="relative basis-1/3 pl-3.5 pt-3.5 bg-white rounded-lg shadow dark:bg-[#333333]" to="/meals">
                <div>
                    <h5 class="mb-2 text-base font-bold tracking-tight">MyMeals</h5>
                    <img class="absolute right-0 bottom-0 size-24" src="src/assets/Food restaurant.png" />
                </div>
            </Link>
            <Link class="relative basis-1/3 pl-3.5 pt-3.5 bg-white rounded-lg shadow dark:bg-[#333333]" to="/chat">
                <div>
                    <h5 class="mb-2 text-base text-left font-bold tracking-tight">Chat with Hercules</h5>
                    <img class="absolute right-0 bottom-0 size-24" src="src/assets/Conversation icon.png" />
                </div>
            </Link>
            <Link class="relative basis-1/3 pl-3.5 pt-3.5 bg-white rounded-lg shadow dark:bg-[#333333]" to="/workouts">
                <div>
                    <h5 class="mb-2 text-base text-left font-bold tracking-tight">MyWorkout</h5>
                    <img class="absolute right-0 bottom-0 size-24" src="src/assets/Workout Dumbbell.png" />
                </div>
            </Link>
        </div>
        // my-10 max-w-sm -for div class
    )
}

export default Card;