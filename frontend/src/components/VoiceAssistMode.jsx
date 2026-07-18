import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageToggle from './LanguageToggle';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const labelsByLanguage = {
  english: {
    title: "Voice Medicine Assistant",
    description: "Speak or type a medicine name to get details read aloud.",
    speakBtn: "Click to Speak Medicine Name",
    listening: "Listening... Speak the medicine name now.",
    inputPlaceholder: "Or type medicine name here...",
    searchBtn: "Search",
    speakDetailsBtn: "🔊 Read Details Aloud",
    stopSpeakBtn: "🛑 Stop Reading",
    medName: "Medicine Name",
    usedFor: "What it is used for",
    sideEffects: "Side effects",
    warnings: "Warnings / Precautions",
    loading: "Finding medicine details...",
    noResults: "No details found. Please try speaking clearly again.",
    instructSpeak: "Please select a language, click the microphone button, and speak the name of the medicine clearly."
  },
  hindi: {
    title: "आवाज दवा सहायक (Voice Assistant)",
    description: "दवा का नाम बोलें या लिखें और जानकारी बोलकर सुनें।",
    speakBtn: "दवा का नाम बोलने के लिए क्लिक करें",
    listening: "सुन रहा हूँ... अब दवा का नाम बोलें।",
    inputPlaceholder: "या यहाँ दवा का नाम लिखें...",
    searchBtn: "खोजें",
    speakDetailsBtn: "🔊 जानकारी बोलकर सुनें",
    stopSpeakBtn: "🛑 पढ़ना बंद करें",
    medName: "दवा का नाम",
    usedFor: "यह किस काम आती है",
    sideEffects: "दुष्प्रभाव (Side effects)",
    warnings: "सावधानियां / चेतावनी",
    loading: "दवा की जानकारी खोजी जा रही है...",
    noResults: "कोई जानकारी नहीं मिली। कृपया फिर से स्पष्ट बोलें।",
    instructSpeak: "कृपया भाषा चुनें, माइक बटन दबाएं, और दवा का नाम स्पष्ट रूप से बोलें।"
  },
  malayalam: {
    title: "വോയ്‌സ് മെഡിസിൻ അസിസ്റ്റന്റ്",
    description: "മരുന്നിന്റെ പേര് പറയുക അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യുക, വിവരങ്ങൾ കേൾക്കുക.",
    speakBtn: "മരുന്നിന്റെ പേര് പറയാൻ ക്ലിക്ക് ചെയ്യുക",
    listening: "ശ്രദ്ധിക്കുന്നു... മരുന്നിന്റെ പേര് പറയുക.",
    inputPlaceholder: "അല്ലെങ്കിൽ മരുന്നിന്റെ പേര് ടൈപ്പ് ചെയ്യുക...",
    searchBtn: "തിരയുക",
    speakDetailsBtn: "🔊 വിവരങ്ങൾ ഉറക്കെ വായിക്കുക",
    stopSpeakBtn: "🛑 വായന നിർത്തുക",
    medName: "മരുന്നിന്റെ പേര്",
    usedFor: "എന്തിനാണ് ഉപയോഗിക്കുന്നത്",
    sideEffects: "പാർശ്വഫലങ്ങൾ",
    warnings: "മുന്നറിയിപ്പുകൾ / മുൻകരുതലുകൾ",
    loading: "മരുന്ന് വിവരങ്ങൾ കണ്ടെത്തുന്നു...",
    noResults: "വിവരങ്ങൾ ലഭ്യമല്ല. ദയവായി വ്യക്തമായി വീണ്ടും പറയുക.",
    instructSpeak: "ദയവായി ഒരു ഭാഷ തിരഞ്ഞെടുക്കുക, മൈക്രോഫോൺ ബട്ടൺ ക്ലിക്ക് ചെയ്യുക, മരുന്നിന്റെ പേര് വ്യക്തമായി പറയുക."
  }
};

export default function VoiceAssistMode() {
  const [language, setLanguage] = useState("english");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const copy = labelsByLanguage[language] || labelsByLanguage.english;

  // Speech Recognition (Speech-to-Text)
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please try typing.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "hindi" ? "hi-IN" : language === "malayalam" ? "ml-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
      setQuery("");
    };

    recognition.onerror = (event) => {
      console.error(event);
      setError("Voice input error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuery(speechToText);
      handleSearch(speechToText);
    };

    recognition.start();
  };

  const handleSearch = async (searchQuery = query) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    stopSpeaking();

    try {
      const response = await axios.post(`${BASE_URL}/find-medicine`, {
        query: textToSearch,
        language
      });
      setResult(response.data);
      // Auto speak details upon loading for accessibility
      speakDetails(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to search medicine.");
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech (Read Aloud)
  const speakDetails = (medData = result) => {
    if (!medData || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    const ttsLang = language === "hindi" ? "hi-IN" : language === "malayalam" ? "ml-IN" : "en-US";
    
    // Construct readout text
    let readText = "";
    if (language === "malayalam") {
      readText = `മരുന്നിന്റെ പേര്: ${medData.medicine}. ഇത് ഉപയോഗിക്കുന്നത്: ${medData.usedFor}. പാർശ്വഫലങ്ങൾ: ${medData.sideEffects}. മുന്നറിയിപ്പുകൾ: ${medData.warnings}.`;
    } else if (language === "hindi") {
      readText = `दवा का नाम: ${medData.medicine}. उपयोग: ${medData.usedFor}. दुष्प्रभाव: ${medData.sideEffects}. सावधानियां: ${medData.warnings}.`;
    } else {
      readText = `Medicine Name: ${medData.medicine}. Used for: ${medData.usedFor}. Side effects: ${medData.sideEffects}. Warnings: ${medData.warnings}.`;
    }

    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = ttsLang;
    
    // Find matching native voice in client browser if possible
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().includes(ttsLang.toLowerCase()));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
          🎙️ {copy.title}
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          {copy.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Language Selector */}
          <div>
            <LanguageToggle language={language} setLanguage={(lang) => {
              setLanguage(lang);
              stopSpeaking();
              setResult(null);
              setQuery("");
            }} />
          </div>

          {/* Big Voice Button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <button
              onClick={startRecognition}
              disabled={listening || loading}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                backgroundColor: listening ? '#dc2626' : '#0A2463',
                color: 'white',
                border: 'none',
                cursor: (listening || loading) ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: listening ? '0 0 25px rgba(220,38,38,0.7)' : '0 10px 15px -3px rgba(10,36,99,0.3)',
                animation: listening ? 'pulse 1.2s infinite' : 'none',
                transition: 'all 0.3s'
              }}
            >
              <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎙️</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', padding: '0 1rem', textAlign: 'center' }}>
                {listening ? "Listening..." : copy.speakBtn}
              </span>
            </button>
          </div>

          {listening && (
            <p style={{ textAlign: 'center', color: '#dc2626', fontWeight: '500', animation: 'pulse 1.2s infinite' }}>
              {copy.listening}
            </p>
          )}

          {/* Text input search fallback */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.inputPlaceholder}
              style={{
                flex: '1',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0A2463',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: (loading || !query.trim()) ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              {copy.searchBtn}
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem' }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#0A2463', fontWeight: '500' }}>
              ⏳ {copy.loading}
            </div>
          )}

          {/* Instruction helper */}
          {!result && !loading && !listening && (
            <div style={{ backgroundColor: '#f3f4f6', padding: '1.25rem', borderRadius: '0.5rem', color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.6', borderLeft: '4px solid #9ca3af' }}>
              ℹ️ {copy.instructSpeak}
            </div>
          )}

          {/* Search Result Card Panel */}
          {result && (
            <div style={{ marginTop: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0A2463' }}>
                  💊 {result.medicine}
                </h3>
                
                {/* Audio controls */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!speaking ? (
                    <button
                      onClick={() => speakDetails()}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3E9B6E',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {copy.speakDetailsBtn}
                    </button>
                  ) : (
                    <button
                      onClick={stopSpeaking}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {copy.stopSpeakBtn}
                    </button>
                  )}
                </div>
              </div>

              {/* Structured Info items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                  <p style={{ fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>📋 {copy.usedFor}</p>
                  <p style={{ color: '#1f2937', marginTop: '0.25rem', lineHeight: '1.5' }}>{result.usedFor}</p>
                </div>

                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                  <p style={{ fontWeight: '600', color: '#4b5563', fontSize: '0.875rem' }}>⚠️ {copy.sideEffects}</p>
                  <p style={{ color: '#1f2937', marginTop: '0.25rem', lineHeight: '1.5' }}>{result.sideEffects}</p>
                </div>

                <div>
                  <p style={{ fontWeight: '600', color: '#b91c1c', fontSize: '0.875rem' }}>🛑 {copy.warnings}</p>
                  <p style={{ color: '#991b1b', marginTop: '0.25rem', lineHeight: '1.5', fontWeight: '500' }}>{result.warnings}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
