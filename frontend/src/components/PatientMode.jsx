import { useState } from "react";
import LanguageToggle from "./LanguageToggle";
import ImageUpload from "./ImageUpload";
import LoadingSpinner from "./LoadingSpinner";
import RxExplanation from "./RxExplanation";
import * as api from "../utils/api";

export default function PatientMode() {
  const [language, setLanguage] = useState("english");
  const [selectedImage, setSelectedImage] = useState(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please upload a prescription image");
      return;
    }

    setLoading(true);
    setError("");
    setExplanation("");

    try {
      const result = await api.explainRx(selectedImage, language);
      setExplanation(result);
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
          Understand Your Prescription
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Upload a photo of your prescription
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <LanguageToggle language={language} setLanguage={setLanguage} />

          <ImageUpload onImageSelect={handleImageSelect} />

          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedImage}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0A2463',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '500',
              border: 'none',
              cursor: (loading || !selectedImage) ? 'not-allowed' : 'pointer',
              opacity: (loading || !selectedImage) ? 0.5 : 1,
            }}
          >
            {loading ? "Analyzing..." : "Explain My Prescription"}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {explanation && (
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <RxExplanation explanation={explanation} language={language} />
        </div>
      )}
    </div>
  );
}
