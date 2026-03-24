import { useState } from "react";
import { sendVoice } from "../Api/api";
import useAuth from "../Hooks/useAuth";

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [text, setText] = useState("");

  const start = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "es-ES";

    recognition.onresult = async (e) => {
      const t = e.results[0][0].transcript;

      setText(t);

      // 🔥 ahora sí, cuando ya tenés el texto
      const res = await sendVoice(t, user.email);
      speak(res);
    };

    recognition.start();
  };

  const speak = (text) => {
    if (!text) return;
    console.log("🗣️ Respuesta del asistente:", text);
    const synth = window.speechSynthesis;

    // cortar audio anterior
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text.response);
    utterance.lang = "es-AR";

    // cargar voces bien
    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("es"));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => console.log("🔊 Hablando...");
    utterance.onerror = (e) => console.error("❌ Error TTS", e);

    synth.speak(utterance);
  };

  return (
    <div className="bg-white shadow rounded p-4 mt-6">
      <h2 className="font-semibold mb-3">Asistente de Agenda</h2>

      <p className="text-gray-600 mb-4">
        Decí algo como: "agendar reunión mañana a las 10 para agendar un evento"
      </p>
      <p className="text-gray-600 mb-4">
        O también: "¿qué tengo para hoy?" o "¿qué eventos tengo esta semana?"
      </p>

      <button
        onClick={start}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Hablar
      </button>

      <p className="mt-4">{text}</p>
    </div>
  );
}
