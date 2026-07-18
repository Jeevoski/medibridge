import { useState } from "react";
import LanguageToggle from "./LanguageToggle";
import VoiceInput from "./VoiceInput";
import LoadingSpinner from "./LoadingSpinner";
import SOAPNoteDisplay from "./SOAPNoteDisplay";
import PDFExportButton from "./PDFExportButton";
import * as api from "../utils/api";

export default function DoctorMode() {
  const [language, setLanguage] = useState("english");
  const [summary, setSummary] = useState("");
  const [soapNote, setSoapNote] = useState("");
  const [soapLanguage, setSoapLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVoiceTranscript = (transcript) => {
    setSummary((prev) => (prev ? prev + " " + transcript : transcript));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!summary.trim()) {
      setError("Please enter a consultation summary");
      return;
    }

    setLoading(true);
    setError("");
    setSoapNote("");

    try {
      const result = await api.generateSOAP(summary, language);
      setSoapNote(result);
      setSoapLanguage(language);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
          Generate Clinical Note
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Speak or type your patient consultation summary
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>

          <VoiceInput onTranscript={handleVoiceTranscript} />

          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Consultation Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter patient consultation details here..."
              minLength={10}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                minHeight: '150px',
                fontColor: '#111827'
              }}
              rows="6"
            />
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0A2463',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate Clinical Note"}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {soapNote && (
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <SOAPNoteDisplay soap={soapNote} language={soapLanguage} />
          <PDFExportButton soapNote={soapNote} language={soapLanguage} />
        </div>
      )}
    </div>
  );
}
