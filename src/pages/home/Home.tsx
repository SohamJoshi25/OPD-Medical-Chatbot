import { useNavigate } from "react-router-dom"



const Home = () => {

  const navigate = useNavigate();
  return (
    <div className="bg-[#e2e4e7] flex">
      <div className="w-[40%] flex flex-col justify-center items-center h-screen">
        <span className="text-4xl font-sans tracking-wide pb-2" style={{fontFamily:"fantasy"}}>Welcome To OPD MediAssist</span>
        <span className="text-lg pb-5 ">Automatically Book Appointments with Chatbot.</span>
        <span className="text-xl my-5 p-2 px-4 bg-[#d4d4da] rounded-md hover:cursor-pointer hover:bg-[#d1d2d6]" onClick={()=>{navigate("/voice")}}>Lets start</span>
      </div>
      <div>
        <img src="doctor.jpg" alt="" className="h-screen ml-auto"/>
      </div>
    </div>
  )
}

export default Home