import logo from './assets/Entity-logo.png'
import Cards from './Cards'

function Landing({ username }) {
    return (
        <div className="w-1/2 flex items-center justify-center">
            <div className="w-full">
                <h1 className="text-center text-xl font-bold text-[#C87FEB] font-roboto">PowerPlate</h1>
                <img src={logo} className="mx-auto mt-10" alt="Entity Logo" />
                <h1 className="text-center text-xl mt-5 mb-12 font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C87FEB] to-cyan-300 font-roboto">We are PowerPlate. Your Personal Health Consultant</h1>
                <h1 className="text-4xl font-bold text-[#C87FEB] font-roboto">Hi, {username}</h1>
                <h1 className="text-4xl mb-12 font-bold text-white font-roboto">How can I help today?</h1>
                <Cards />
            </div>
        </div>
    );
    
}

export default Landing;