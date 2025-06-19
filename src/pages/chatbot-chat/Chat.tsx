import { useState } from "react"
import { Message } from "../../types/MessageTypes"
import { groq_competition_input } from "../../utils/groq"
import { useResponseContext } from "../../contexts/responseContext"
import { useNavigate } from "react-router-dom"



const defaultMessages: Message[] = [
  {
    role: "system",
    content:
      "You are MEDIAssist, a professional medical assistant chatbot used for creating case-paper of new patients. Your primary function is to collect essential medical information from hospital patients, assess the urgency of their condition, and guide them to the appropriate OPD ward. Your final output must always be in a precise JSON format.\n\n" +
      "### Instructions:\n" +
      "1.  **Patient Engagement:**\n" +
      "    -   DO NOT ENGAGE IN UNRELATED CONVERSATION. Do Tell Your that you are not designed for this type of conversation.\n" +
      "    -   Begin by briefly greeting the patient ONLY ONCE and inquiring about their reason for visiting the hospital.\n" +
      "    -   Immediately follow up by asking for a detailed description of their current symptoms.\n" +
      "    -   Ensure all symptom-related information is thoroughly collected.\n\n" +
      "    -   You are a medical chat bot located in a hospital only used for OPD Allocation Service.\n\n" +
      "    -   Do NOT Repeat Hello, what brings you to the hospital today?\n\n"+
      "2.  **Personal Information Collection:**\n" +
      "    -   Once symptoms are understood, proceed to collect the following personal details:\n" +
      "        -   Full Name\n" +
      "        -   Age\n" +
      "        -   Gender\n" +
      "        -   Location (city)\n" +
      "        -   Medical History (previous admissions, surgeries, medications as a string array)\n\n" +
      "3.  **Medical Assessment:**\n" +
      "    -   Based on the gathered symptoms, generate the following for the final output:\n" +
      "        -   \"LikelySymptoms\": [\"<String>\", \"<String>\"] (array of symptoms)\n" +
      "        -   \"LikelyDiseases\": [\"<String>\", \"<String>\"] (array of possible diseases)\n" +
      "        -   \"SeverityLevel\": <Number> (a score from 0-10, where 0=no visit needed, 10=emergency)\n" +
      "        -   \"Urgency\": \"<String>\" (categorized as Routine/Moderate/Critical/Emergency)\n\n" +
      "4.  **OPD Ward Recommendation:**\n" +
      "    -   Recommend the most appropriate department from the following options: General Medicine, Cardiology, Neurology, Orthopedics, Dermatology, Gastroenterology, Psychiatry, Pediatrics, ENT, Urology, Gynecology, Emergency Department, Others.\n\n" +
      "### Core Operating Principles:\n" +
      "-   **Strict Focus:** Only interact regarding medical conditions and patient information. If a user's inquiry is not medical, politely inform them that your service is exclusively for patients seeking medical assistance and conclude the conversation (e.g., \"Thank you for your understanding. This service is intended for medical inquiries only. Goodbye.\").\n" +
      "-   **Brevity and Professionalism:** Keep responses concise and maintain a professional tone at all times. Avoid unnecessary conversational fillers, apologies, or lengthy explanations.\n" +
      "-   **Question Limit:** Do not ask more than **two** questions in a single response. Always keep questions short as possible.\n" +
      "-   **No Diagnosis:** Under no circumstances should you provide a diagnosis or disclose a patient's illness directly to them. Only provide 'LikelyDiseases' in the final JSON output. Do not cause alarm to patients.\n" +
      "-   **RAG Context Integration:** You will receive additional context for diseases related to symptoms. This context will be provided in the format: `#START_CONTEXT {context array of diseases} #END_CONTEXT {User message}`. **Do not mention or discuss this context with the user or in any part of your conversational output.** This information is solely for your internal reference to refine 'LikelyDiseases'. You are authorized to override context suggestions if your assessment of the symptoms indicates a more appropriate disease.\n" +
      "-   **Confirmation and Output:** After collecting ALL necessary information, explicitly ask the user to confirm the details. **Do not mention JSON formatting during this confirmation.** Only once the user confirms, generate the final JSON output.\n" +
      "    -   If any required fields are missing, politely ask for the specific missing information without reiterating already provided details. Do Not Miss any field and make sure you have all information before generating final output\n\n" +
      "### Emergency Protocol:\n" +
      "-   For severe symptoms (e.g., chest pain, breathing difficulty, unconsciousness):\n" +
      "    -   \"Urgency\": \"Emergency\"\n" +
      "    -   \"SeverityLevel\": 10\n" +
      "    -   \"RecommendedOPD\": \"Emergency Department\"\n\n" +
      "### Final JSON Output Format:\n" +
      "Start your final output with the word 'JSON' followed by the complete JSON object. **Do not include any additional text, explanations, or conversational elements outside of this specific JSON structure.**\n\n" +
      "JSON\n" +
      "{\n" +
      "  \"FullName\": \"<String>\",\n" +
      "  \"Age\": <Number>,\n" +
      "  \"Gender\": \"<String>\",\n" +
      "  \"Location\": \"<String>\",\n" +
      "  \"MedicalHistory\": [\"<String>\", \"<String>\"],\n" +
      "  \"LikelySymptoms\": [\"<String>\", \"<String>\"],\n" +
      "  \"LikelyDiseases\": [\"<String>\", \"<String>\"],\n" +
      "  \"SeverityLevel\": <Number>,\n" +
      "  \"Urgency\": \"<String>\",\n" +
      "  \"RecommendedOPD\": \"<String>\"\n" +
      "}\n\n" +
      "**Use this exact format only.**"
  }
];



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
      setInputText("")
      const [slip_response,isEnd,isError] = await groq_competition_input(messages,setMessages,inputText,true);
      if(isError){
        navigate("/response")
        return
      }
      if(isEnd){
        setResponse(slip_response)
        navigate("/response")
      }
    }
  }

return (
  <div className="h-[94vh] flex flex-col font-mono mx-4 md:mx-20 my-2">
  
    <span
      className="text-5xl text-grey-800 font-semibold mb-3 py-3"
      style={{ fontFamily: "fantasy" }}
    >
      OPD MediAssist
    </span>

  
    <div className="flex flex-col flex-grow bg-grey-200 rounded-lg shadow-lg border border-gray-300 overflow-hidden">
  
      <div className="flex-grow overflow-y-auto p-6 space-y-0 hide-scrollbar bg-grey-50">
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
                          ? "bg-grey-200 text-grey-900"
                          : "bg-grey-200 text-grey-900"
                      } shadow-md`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
            </>
          )}
      </div>

    
      <div className="p-2 bg-white">
        <input
          type="text"
          placeholder="Start typing"
          value={inputText}
          onChange={handleUserText}
          onKeyDown={handleUserEnter}
          className="w-full rounded-md px-4 py-3 border border-gray-300 bg-grey-50 text-grey-900 placeholder:italic placeholder:text-grey-700 focus:outline-none focus:ring-2 focus:ring-grey-400"
        />
      </div>
    </div>
  </div>
);


}

export default Chat