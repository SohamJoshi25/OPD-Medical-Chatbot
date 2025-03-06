// src/hooks/useSpeechToText.ts
import { useState, useEffect, useRef } from 'react';

const getSpeechRecognition = (): SpeechRecognition | null => {
    const SpeechRecognition =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;

  return SpeechRecognition ? new SpeechRecognition() : null;
};

const useSpeechToText = (setUserText : React.Dispatch<React.SetStateAction<string>>) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    recognitionRef.current = getSpeechRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserText(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return { startListening, stopListening, isListening };
};

export default useSpeechToText;
