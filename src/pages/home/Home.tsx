import { useNavigate } from "react-router-dom"



const Home = () => {

  const navigate = useNavigate();
  return (
    <div className="bg-[#e2e4e7] flex">
      <div className="w-[40%] flex flex-col justify-center items-center h-screen">
        <span className="text-4xl font-sans tracking-wider pb-5" style={{fontFamily:"fantasy"}}>Welcome To MediAssist</span>
        <span className="text-xl my-5 p-2  rounded-md hover:cursor-pointer hover:bg-[#d1d2d6]" onClick={()=>{navigate("/chat")}}>Lets get you connected to a doctor</span>
      </div>
      <div>
        <img src="doctor.jpg" alt="" className="h-screen ml-auto"/>
      </div>
    </div>
  )
}

export default Home