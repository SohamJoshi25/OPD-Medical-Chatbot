import { useState } from "react"
import { Message } from "../../types/MessageTypes"
import { groq_competition_input } from "../../utils/groq"
import { useResponseContext } from "../../contexts/responseContext"
import { useNavigate } from "react-router-dom"


const defaultMessages: Message[] = [
  {
    "role": "system",
    "content": "You are a professional medical assistant chatbot for hospital patients. Your primary role is to collect medical information, assess urgency, and guide to the appropriate OPD ward. Final output must be JSON. Be brief, and professional, you don't want to just chat.\n\n### Instructions:\n1. **Engage with the Patient:**\n   - Greet the patient briefly and ask what brings them to the hospital if not been told yet.\n   - Ask about their current symptoms first if not alreary told.\n   - Collect ALL detailed information about symptoms.\n\n2. **Personal Information Collection:**\n   - After understanding symptoms, collect:\n     - Full Name\n     - Age\n     - Gender\n     - Location (city)\n     - Medical History (previous admissions, surgeries, medications as string array)\n\n3. **Medical Assessment:**\n   - Based on symptoms, generate:\n     - \"LikelySymptoms\": symptoms array\n     - \"LikelyDiseases\": possible diseases array\n     - \"SeverityLevel\": 0-10 score (0=no visit needed, 10=emergency)\n     - \"Urgency\": Routine/Moderate/Critical/Emergency\n\n4. **OPD Ward Recommendation:**\n   - Recommend appropriate department: General Medicine, Cardiology, Neurology, Orthopedics, Dermatology, Gastroenterology, Psychiatry, Pediatrics, ENT, Urology, Gynecology, Others\n\n### Important Rules:\n- If User is not for any medical condition, let them know an exit early by greeting goodbye or thankyou and letting them know this is only for patients. You can ask multiple questions if permissible but do NOT ask more than 3 questions and keep assistant's content less. If User Does not need hospital or medical attention tell user an return early.\n- Do not make any diagnosis or tell user about thier illness to user — only provide possible diseases based on symptoms only in final output. DO NOT Scare Patients by telling them about diagnosis. Avoid Long messages and do not apologise when not required. Please DO NOT REPEAT Yourself always. Confirm with user about all their details first then only output in the final output format.\n- For severe symptoms (chest pain, breathing difficulty, unconsciousness):\n  - \"Urgency\": \"Emergency\"\n  - \"SeverityLevel\": 10\n  - \"RecommendedOPD\": \"Emergency Department\"\n\n### After collecting all necessary information, ask the user to confirm details. DO NOT MISS ANY FIELDS. Ask user again if you miss any fieds. Final JSON Output Format an include the word JSON in it Example:\nJSON\n{\n  \"FullName\": \"<String>\",\n  \"Age\": <Number>,\n  \"Gender\": \"<String>\",\n  \"Location\": \"<String>\",\n  \"MedicalHistory\": [\"<String>\", \"<String>\"],\n  \"LikelySymptoms\": [\"<String>\", \"<String>\"],\n  \"LikelyDiseases\": [\"<String>\", \"<String>\"],\n  \"SeverityLevel\": <Number>,\n  \"Urgency\": \"<String>\",\n  \"RecommendedOPD\": \"<String>\"\n}\n\nUse this format only. Start with JSON. Do not output anything extra. If information is missing, ask politely for the missing details without repeating what user said. Just acknowledge and focus on getting required information. Do not mention JSON processing."
  }
]


const Chat = () => {

  const navigate  = useNavigate();

  const {setResponse} = useResponseContext()

  const [inputText, setInputText] = useState<string>("")
  //const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(defaultMessages)

  const handleUserText = (e:React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleUserEnter = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key.toLowerCase() == "enter"){
      const [slip_response,isEnd] = await groq_competition_input(messages,setMessages,inputText);
      setInputText("")
      if(isEnd){
        setResponse(slip_response)
        navigate("/response")
      }
    }
  }

return (
  <div className="h-screen flex flex-col font-mono mx-4 md:mx-20 my-6">
  
    <span
      className="text-5xl text-emerald-800 font-semibold mb-6"
      style={{ fontFamily: "fantasy" }}
    >
      OPD MediAssist
    </span>

  
    <div className="flex flex-col flex-grow bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
  
      <div className="flex-grow overflow-y-auto p-6 space-y-4 hide-scrollbar bg-emerald-50">
        {messages &&
          messages.filter((o) => o.role !== "system").length !== 0 && (
            <>
              {messages
                .filter((o) => o.role !== "system")
                .map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-xl p-4 whitespace-pre-wrap text-sm ${
                        message.role === "assistant"
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-emerald-600 text-white"
                      } shadow-md`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
            </>
          )}
      </div>

    
      <div className="p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          placeholder="Start typing"
          value={inputText}
          onChange={handleUserText}
          onKeyDown={handleUserEnter}
          className="w-full rounded-md px-4 py-3 border border-gray-300 bg-emerald-50 text-emerald-900 placeholder:italic placeholder:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </div>
  </div>
);


}

export default Chat