import logo from './assets/Entity-logo.png'
import Cards from './Cards'

function Landing() {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-xl font-bold  from-purple-500 to-blue-500 font-roboto">PowerPlate</h1>
                <img src={logo} className="mx-auto mt-10" alt="Entity Logo" />
                <h1 className="text-xl mt-10 font-bold  from-purple-500 to-blue-500 font-roboto">We are PowerPlate. Your Personal Health Consultant</h1>
                <Cards />
            </div>
        </div>
    );
    
}

export default Landing;