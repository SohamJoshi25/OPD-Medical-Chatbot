import { useEffect, useState } from 'react';

function chunkSentence(input: string): string[] {
  const words = input.split(" ");
  const result: string[] = [];
  let chunk: string[] = [];

  for (const word of words) {
    chunk.push(word);

    if (chunk.join(" ").length >= 120) { // Split based on character length
      result.push(chunk.join(" "));
      chunk = [];
    }
  }

  if (chunk.length) {
    result.push(chunk.join(" "));
  }

  return result;
}

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert('Text-to-Speech is not supported in this browser');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const availableVoices = window.speechSynthesis.getVoices();
    const selectedVoice = availableVoices[7];

    const sentences = chunkSentence(text);
    if (sentences.length === 0) return;

    let currentIndex = 0;
    setIsSpeaking(true);

    const speakNext = () => {
      if (currentIndex >= sentences.length) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
      utterance.lang = "en-US";
      utterance.pitch = 1.0;
      utterance.rate = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        currentIndex++;
        setTimeout(speakNext, 300); // Add small pause between sentences
      };

      utterance.onerror = () => {
        console.error("Speech error");
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stopSpeaking, isSpeaking, voices };
};

export default useTextToSpeech;
