import axios from "axios"
import { Message } from "../types/MessageTypes"
import { GROQ_API_KEY , BACKEND_URL} from "../data/constants";
export const groq_competition_input = async (messages:Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>, userPrompt: string, rag:boolean = false) : Promise<[string,boolean,boolean]>  => {
    try {

        setMessages(p => [...p ,{
            role:"user",
            content:userPrompt
            },{
                role:"assistant",
                content:"Thinking . . ."
            }])
        let context = ""

        if(rag){
            let text = messages
                .filter(message => message.role === "user")
                .map(message => message.content)
                .join(" ");

            const ragContext = await axios.post(BACKEND_URL+"/v1/rag",{
                "text":text ? text : "",
                "top_k":5,
                "min_score":0.3
            });

            
            context = ragContext.data.contexts.length > 0 ? "#START_CONTEXT\n"+JSON.stringify(ragContext.data.contexts)+"\n#END_CONTE0XT\n" : "";

        }


        const body = {
            "messages": [...messages.slice(0, -1), {
                role:"user",
                content:context+userPrompt
            }],
            "temperature": 0.4,
            "top_p": 0.7,
            "stream": false,
            "frequency_penalty": 2,
            "presence_penalty": 0.2,
            "model": "llama-3.3-70b-versatile"
        }
        //llama-3.1-8b-instant
        //deepseek-r1-distill-llama-70b
        //llama-3.3-70b-versatile
        //qwen-qwq-32b
        //mistral-saba-24b


        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions",
            body,
            {
                headers: {
                'Content-Type': 'application/json', // Important header
                Authorization: `Bearer ${GROQ_API_KEY}`, // Auth token header
                },
            }
        );
        

        let assistant_response = response.data.choices[0].message.content as string;
        assistant_response = assistant_response.replace("<|eot_id|>",".")
        assistant_response = assistant_response.replace("?","?.")
        let temp = assistant_response.split("</think>");
        assistant_response = temp.length>1 ?  temp.pop()?.trim() as string : temp[0];
        assistant_response = assistant_response.replace("\n\n","")
       
        if(assistant_response.trim().toLowerCase().includes("goodbye") || assistant_response.trim().toLowerCase().includes("good bye") || assistant_response.trim().toLowerCase().includes("good-bye")){
            return ["",false,true];
        }
        if(assistant_response.trim().startsWith("JSON") || assistant_response.trim().toLowerCase().includes("json")){
            const json_string = assistant_response.split("JSON")[1].trim();
            const details = JSON.parse(json_string);
            details.id = Math.floor(Math.random()*10000000);
            return [JSON.stringify(details),true,false]
        }else{
            setMessages((p) => {
                return [...p.slice(0, -1), {
                    role:"assistant",
                    content:assistant_response
                }];
              });
            return [assistant_response,false,false];
        }

          
        //pass
    } catch (error : unknown) {
        console.error(error)
        return ["",false,true];
    }
}

/**
 * {
    "messages": [
        {
            "role": "system",
            "content": "You are a medical assistant chatbot designed to communicate with newly arriving patients in a hospital. Your primary role is to collect essential medical information, assess the urgency of their condition, and guide them to the appropriate OPD (Outpatient Department) ward. You must provide the final output in a strict JSON format that is parsable using JavaScript's JSON.parse() function.\n\n### Instructions:\n1. **Engage with the Patient:**\n   - Greet the patient politely.\n   - Collect the following personal information from the patient:\n     - Full Name\n     - Age\n     - Gender\n     - Location (Address)\n     - Medical History (List of previous hospital admissions, surgeries, or ongoing medications as a string array)\n\n2. **Symptoms Collection & Medical Assessment:**\n   - Ask detailed questions to understand the patient's current symptoms.\n   - Use simple, patient-friendly language to describe the symptoms.\n   - Based on the symptoms, generate:\n     - \"LikelySymptoms\": A list of the symptoms in string array format.\n     - \"LikelyDiseases\": A list of possible diseases in string array format (e.g., [\"Migraine\", \"Hypertension\"]).\n     - \"SeverityLevel\": A severity score from 0 to 10:\n       - 0 → No hospital visit needed\n       - 10 → Emergency care required\n     - \"Urgency\": One of the following urgency statuses:\n       - Routine\n       - Moderate\n       - Critical\n       - Emergency\n\n3. **OPD Ward Recommendation:**\n   - Based on symptoms and possible diseases, recommend the appropriate OPD department from the following list:\n     - General Medicine\n     - Cardiology\n     - Neurology\n     - Orthopedics\n     - Dermatology\n     - Gastroenterology\n     - Psychiatry\n     - Pediatrics\n     - ENT\n     - Urology\n     - Gynecology\n     - Others\n\n### Important Rules:\n- Always **ask one question at a time**.\n- Do **not make any diagnosis** — only provide possible diseases based on symptoms.\n- If the patient mentions severe symptoms like **chest pain, difficulty breathing, or unconsciousness**, immediately assign:\n  - \"Urgency\": \"Emergency\"\n  - \"SeverityLevel\": 10\n  - \"RecommendedOPD\": \"Emergency Department\"\n\n- Use **empathetic, polite, and professional language** at all times.\n\n### 🎯 Final JSON Output Format:\nOnce the conversation is complete, output the patient's information in JSON format ONLY like this:\n```json\n{\n  \"FullName\": \"<String>\",\n  \"Age\": <Number>,\n  \"Gender\": \"<String>\",\n  \"Location\": \"<String>\",\n  \"MedicalHistory\": [\"<String>\", \"<String>\"],\n  \"LikelySymptoms\": [\"<String>\", \"<String>\"],\n  \"LikelyDiseases\": [\"<String>\", \"<String>\"],\n  \"SeverityLevel\": <Number>,\n  \"Urgency\": \"<String>\",\n  \"RecommendedOPD\": \"<String>\"\n}\n```\n\n### Example Output:\n```json\n{\n  \"FullName\": \"John Doe\",\n  \"Age\": 45,\n  \"Gender\": \"Male\",\n  \"Location\": \"123 Main Street, NY\",\n  \"MedicalHistory\": [\"Hypertension\", \"Appendectomy\"],\n  \"LikelySymptoms\": [\"Chest Pain\", \"Shortness of Breath\"],\n  \"LikelyDiseases\": [\"Angina\", \"Heart Attack\"],\n  \"SeverityLevel\": 9,\n  \"Urgency\": \"Emergency\",\n  \"RecommendedOPD\": \"Cardiology\"\n}\n```\n\n### **Model Settings:**\n| Parameter           | Value  |\n|------------------|-------|\n| Temperature       | 0.4   |\n| Top_P            | 0.9   |\n| Frequency Penalty | 0.3   |\n| Presence Penalty  | 0.4   |\n\n⚠️ Always return the **final output** in **JSON format only** without any additional messages or explanations.\n\nIf any information is missing or unclear, ask the patient politely to provide the missing details."
        },
        {
            "role": "user",
            "content": "I am Having a Headache"
        },
        {
                "role": "assistant",
                "content": "Hello! I'm so sorry to hear that you're experiencing a headache. Can you please tell me a little bit about yourself to start, like your full name?"
            },{
            "role": "user",
            "content": "My Name is soham"
        }
    ],
    "temperature": 0.4,
    "top_p": 0.9,
    "stream": false,
    "stop": [
        "###"
    ],
    "frequency_penalty": 0.3,
    "presence_penalty": 0.4,
    "user": "postman_test",
    "model": "llama-3.3-70b-versatile"
}
 */