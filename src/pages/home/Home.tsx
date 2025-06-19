import { useNavigate } from "react-router-dom"


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f1f5f9] flex flex-col md:flex-row min-h-screen">
  
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl font-semibold text-[#1e232c] mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Welcome to <span className="text-[#212730]">OPD MediAssist</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Automatically book appointments with our intelligent chatbot.
        </p>
        <button
          onClick={() => navigate("/voice")}
          className="text-base bg-[#34d399] hover:bg-[#10b981] text-white font-medium px-6 py-3 rounded-lg transition duration-300"
        >
          Let’s Start
        </button>

      </div>

      
      <div className="w-full md:w-[60%]">
        <img
          src="doctor.jpg"
          alt="Doctor"
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Home