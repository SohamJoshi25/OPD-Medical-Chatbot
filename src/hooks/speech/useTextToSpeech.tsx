import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { GROQ_API_KEY } from '../../data/constants';


const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, []);

  const stopSpeaking = () => {
    const audio = audioRef.current;


    if (audio) {
      audio.currentTime = 0;
      audio.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const speak = async (text: string) => {
    stopSpeaking(); // stop any current speech

    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/speech",
      {
        model: "playai-tts",
        input: text,
        voice: "Arista-PlayAI",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        responseType: "arraybuffer",
      }
    );

    const blob = new Blob([response.data], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(blob);
    audioRef.current = new Audio(audioUrl);

    audioRef.current.onended = () => {
      URL.revokeObjectURL(audioUrl);
      audioRef.current = null;
      setIsSpeaking(false);
    };

    // Optional safety: handle failure to buffer
    audioRef.current.addEventListener("error", () => {
      console.error("Failed to load audio");
      setIsSpeaking(false);
      audioRef.current = null;
    });

    audioRef.current.play();
    setIsSpeaking(true)
  };

  return { speak, stopSpeaking, isSpeaking };
};

export default useTextToSpeech;
