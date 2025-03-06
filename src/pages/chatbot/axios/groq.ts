import axios from "axios"
import { Message } from "../types"
import { GROQ_API_KEY } from "../../../data/constants";

export const groq_competition_input = async (messages:Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>, userPrompt: string) => {
    try {

        const body = {
            "messages": [...messages, {
                role:"user",
                content:userPrompt
            }],
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

        setMessages(p => [...p ,{
            role:"user",
            content:userPrompt
        },{
            role:"assistant",
            content:"Thinking . . ."
        }])

        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions",
            body,
            {
                headers: {
                'Content-Type': 'application/json', // Important header
                Authorization: `Bearer ${GROQ_API_KEY}`, // Auth token header
                },
            }
        );

        const assistant_response = response.data.choices[0].message.content as string;
        setMessages((p) => {
            return [...p.slice(0, -1), {
                role:"assistant",
                content:assistant_response
            }];
          });
          
        //pass
    } catch (error : unknown) {
        console.error(error)
    }
}