import React from 'react';

const LANGUAGES = [
  { code: 'english', name: 'English' },
  { code: 'hindi', name: 'Hindi (हिंदी)' },
  { code: 'malayalam', name: 'Malayalam (മലയാളം)' },
  { code: 'spanish', name: 'Spanish (Español)' },
  { code: 'french', name: 'French (Français)' },
  { code: 'german', name: 'German (Deutsch)' },
  { code: 'italian', name: 'Italian (Italiano)' },
  { code: 'portuguese', name: 'Portuguese (Português)' },
  { code: 'russian', name: 'Russian (Русский)' },
  { code: 'chinese', name: 'Chinese (中文)' },
  { code: 'japanese', name: 'Japanese (日本語)' },
  { code: 'bengali', name: 'Bengali (বাংলা)' },
  { code: 'telugu', name: 'Telugu (తెలుగు)' },
  { code: 'tamil', name: 'Tamil (தமிழ்)' },
  { code: 'marathi', name: 'Marathi (मराठी)' },
  { code: 'gujarati', name: 'Gujarati (ગુજરાતી)' },
  { code: 'arabic', name: 'Arabic (العربية)' },
  { code: 'turkish', name: 'Turkish (Türkçe)' }
];

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor="language-selector" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>
        Select Output Language (Gemma 4 Multilingual Support):
      </label>
      <div style={{ position: 'relative', width: '100%', maxWidth: '24rem' }}>
        <select
          id="language-selector"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 2.5rem 0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: '500',
            color: '#0A2463',
            backgroundColor: 'white',
            border: '2px solid #0A2463',
            borderRadius: '0.5rem',
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#0A2463',
          fontSize: '0.875rem'
        }}>
          ▼
        </div>
      </div>
    </div>
  );
}
