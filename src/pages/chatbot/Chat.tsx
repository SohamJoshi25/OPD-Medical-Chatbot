import { useEffect, useRef, useState } from "react"
import { Message } from "../../types/MessageTypes"

//Utils
import { groq_competition_input } from "../../utils/groq"

//Custom Hooks
import useTextToSpeech from "../../hooks/speech/useTextToSpeech";
import useSpeechToText from "../../hooks/speech/useSpeechToText";
import { useResponseContext } from "../../contexts/responseContext";
import { useNavigate } from "react-router-dom";


const defaultMessages: Message[] = [
  {
    "role": "system",
    "content": "You are a medical assistant chatbot for hospital patients. Your primary role is to collect medical information, assess urgency, and guide to the appropriate OPD ward. Final output must be JSON. Be brief and professional.\n\n### Instructions:\n1. **Engage with the Patient:**\n   - Greet the patient briefly and ask what brings them to the hospital.\n   - Ask about their current symptoms first.\n   - Collect ALL detailed information about symptoms.\n\n2. **Personal Information Collection:**\n   - After understanding symptoms, collect:\n     - Full Name\n     - Age\n     - Gender\n     - Location (city, area address, building name)\n     - Medical History (previous admissions, surgeries, medications as string array)\n\n3. **Medical Assessment:**\n   - Based on symptoms, generate:\n     - \"LikelySymptoms\": symptoms array\n     - \"LikelyDiseases\": possible diseases array\n     - \"SeverityLevel\": 0-10 score (0=no visit needed, 10=emergency)\n     - \"Urgency\": Routine/Moderate/Critical/Emergency\n\n4. **OPD Ward Recommendation:**\n   - Recommend appropriate department: General Medicine, Cardiology, Neurology, Orthopedics, Dermatology, Gastroenterology, Psychiatry, Pediatrics, ENT, Urology, Gynecology, Others\n\n### Important Rules:\n- If User is not for any medical condition, let them know an exit early by greeting goodbye or thankyou and letting them know this is only for patients. You can ask multiple questions if permissible but do NOT ask more than 3 questions and keep assistant's content less. If User Does not need hospital or medical attention tell user an return early.\n- Do not make any diagnosis or tell user about thier illness to user — only provide possible diseases based on symptoms only in final output. DO NOT Scare Patients by telling them about diagnosis. Avoid Long messages and do not apologise when not required. Confirm with user about all their details first then only output in the final output format.\n- For severe symptoms (chest pain, breathing difficulty, unconsciousness):\n  - \"Urgency\": \"Emergency\"\n  - \"SeverityLevel\": 10\n  - \"RecommendedOPD\": \"Emergency Department\"\n\n### After collecting all necessary information, ask the user to confirm details. DO NOT MISS ANY FIELDS. Ask user again if you miss any fieds. Final JSON Output Format an include the word JSON in it Example:\nJSON\n{\n  \"FullName\": \"<String>\",\n  \"Age\": <Number>,\n  \"Gender\": \"<String>\",\n  \"Location\": \"<String>\",\n  \"MedicalHistory\": [\"<String>\", \"<String>\"],\n  \"LikelySymptoms\": [\"<String>\", \"<String>\"],\n  \"LikelyDiseases\": [\"<String>\", \"<String>\"],\n  \"SeverityLevel\": <Number>,\n  \"Urgency\": \"<String>\",\n  \"RecommendedOPD\": \"<String>\"\n}\n\nUse this format only. Start with JSON. Do not output anything extra. If information is missing, ask politely for the missing details without repeating what user said. Just acknowledge and focus on getting required information. Do not mention JSON processing."
  }
]


const Chat = () => {

  const navigate = useNavigate();

  const {setResponse} = useResponseContext()

  const [inputText, setInputText] = useState<string>("")
  
  const { startListening, stopListening, isListening } = useSpeechToText(setInputText);
  const { speak, stopSpeaking, isSpeaking } = useTextToSpeech();

  //const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(defaultMessages)

  const chatsRef = useRef<HTMLInputElement>(null)

  // const handleUserText = (e:React.ChangeEvent<HTMLInputElement>) => {
  //   setInputText(e.target.value)
  // }

  // const handleUserEnter = async (e:React.KeyboardEvent<HTMLInputElement>) => {
  //   if(e.key.toLowerCase() == "enter"){
      
  //     await groq_comp_call()
  //     setInputText("")

      
  //   }
  // }

  const handleListenButton = () => {
    if(isListening || isSpeaking) {
      stopListening();
      stopSpeaking();
      setInputText("");
    }else{
      startListening()
    }
  }

  const groq_comp_call =async () => {
    const [message,isEnd] = await groq_competition_input(messages,setMessages,inputText);

    if(isEnd){
        setResponse(message)
        navigate("/response")
    }
    speak(message)
    chatsRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(()=>{
    if(!isListening && inputText){
      groq_comp_call()
    }
  },[isListening])

  useEffect(()=>{
    if(!isSpeaking && inputText){
      setInputText("");
      startListening()
    }
  },[isSpeaking])

  return (
    <div className="mx-20 font-mono">
      <span className="flex justify-left mt-10 text-5xl " style={{fontFamily:"fantasy"}}>OPD MediAssist</span>
      <div className="pt-4 flex flex-col justify-around h-[87vh]">

        {messages && messages.filter((o) => o.role !== "system").length !== 0 && <div className="mb-3 overflow-y-scroll h-full hide-scrollbar" ref={chatsRef}>
          {messages.filter((o) => o.role !== "system").map((message, idx) => {
            return <div key={idx} className="my-3 p-2 px-5 w-full bg-slate-100 rounded-sm">
              <div className={`${message.role === "assistant" ? "text-left" : "text-right"}`}>{message.content}</div>
            </div>
          })}
        </div>}

        <div className="flex flex-row">
          <button className={`my-2 ${isListening ? "bg-amber-200" : isSpeaking ? "bg-green-200" : "bg-slate-200"} p-3 text-center w-full `} onClick={handleListenButton}>{isListening ? "Listening . . ." : isSpeaking ? "Click to stop speaking" : "Click to start Listening"}</button>
        </div>     
      </div>


    </div>


  )
}

export default Chat