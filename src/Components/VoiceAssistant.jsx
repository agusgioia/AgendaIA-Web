import { useState } from "react";
import { sendVoice } from "../Api/api";
import useAuth from "../Hooks/useAuth";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const browserSupportsSpeech = !!SpeechRecognition;

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (textToSend) => {
    if (!textToSend.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await sendVoice(textToSend, user.email);
      setResponse(res.response);
      speak(res.response);
    } catch (e) {
      setError("No se pudo procesar la solicitud. Intentá de nuevo.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!browserSupportsSpeech) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      setListening(false);
      await handleSend(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      setError("No se pudo acceder al micrófono.");
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const handleSubmitText = (e) => {
    e.preventDefault();
    setText(inputText);
    handleSend(inputText);
    setInputText("");
  };

  const speak = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-AR";
    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("es"));
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full">
      <h2 className="text-white font-semibold text-lg mb-1">
        Asistente de Agenda
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Podés hablar o escribir. Ej: "agendar reunión mañana a las 10"
      </p>

      {/* Botón micrófono — solo si el browser lo soporta */}
      {browserSupportsSpeech ? (
        <button
          onClick={startListening}
          disabled={listening || loading}
          className={`w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 font-medium text-sm transition mb-4
            ${
              listening
                ? "bg-red-500 text-white animate-pulse cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
            }`}
        >
          <span className="text-lg">{listening ? "🔴" : "🎙️"}</span>
          {listening ? "Escuchando..." : "Hablar"}
        </button>
      ) : (
        <div className="mb-4 text-sm text-yellow-400 bg-yellow-950 border border-yellow-800 rounded-xl px-4 py-3">
          ⚠ Tu navegador no soporta reconocimiento de voz. Usá el campo de
          texto.
        </div>
      )}

      {/* Divider */}
      {browserSupportsSpeech && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs">o escribí</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
      )}

      {/* Input de texto */}
      <form onSubmit={handleSubmitText} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribí tu consulta..."
          disabled={listening || loading}
          className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || listening || loading}
          className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl px-4 py-3 text-sm transition"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      {/* Texto reconocido */}
      {text && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
          <p className="text-gray-400 text-xs mb-1">Vos dijiste:</p>
          <p className="text-white text-sm">{text}</p>
        </div>
      )}

      {/* Respuesta del asistente */}
      {response && (
        <div className="mt-3 bg-sky-950 border border-sky-800 rounded-xl px-4 py-3">
          <p className="text-sky-400 text-xs mb-1">Asistente:</p>
          <p className="text-white text-sm">{response}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 bg-red-950 border border-red-800 rounded-xl px-4 py-3">
          <p className="text-red-300 text-sm">⚠ {error}</p>
        </div>
      )}
    </div>
  );
}
