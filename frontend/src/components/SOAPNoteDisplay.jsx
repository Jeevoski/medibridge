const parseSoapNote = (text) => {
  const sections = {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  };

  const subjPattern = /(?:\*\*|###)?\s*SUBJECTIVE\s*(?:\*\*|:)?\s*\n?([\s\S]*?)(?=(?:\*\*|###)?\s*OBJECTIVE\b|$)/is;
  const objPattern = /(?:\*\*|###)?\s*OBJECTIVE\s*(?:\*\*|:)?\s*\n?([\s\S]*?)(?=(?:\*\*|###)?\s*ASSESSMENT\b|$)/is;
  const assPattern = /(?:\*\*|###)?\s*ASSESSMENT\s*(?:\*\*|:)?\s*\n?([\s\S]*?)(?=(?:\*\*|###)?\s*PLAN\b|$)/is;
  const planPattern = /(?:\*\*|###)?\s*PLAN\s*(?:\*\*|:)?\s*\n?([\s\S]*?)$/is;

  const subjMatch = text.match(subjPattern);
  const objMatch = text.match(objPattern);
  const assMatch = text.match(assPattern);
  const planMatch = text.match(planPattern);

  if (subjMatch) sections.subjective = subjMatch[1].trim();
  if (objMatch) sections.objective = objMatch[1].trim();
  if (assMatch) sections.assessment = assMatch[1].trim();
  if (planMatch) sections.plan = planMatch[1].trim();

  // Fallback: If parsing fails to separate sections, place all text in subjective
  if (!sections.subjective && !sections.objective && !sections.assessment && !sections.plan) {
    sections.subjective = text;
  }

  return sections;
};

const contentByLanguage = {
  english: {
    resultTitle: "Clinical Note Result",
    resultLabel: "Generated in English",
    titles: {
      subjective: "Subjective",
      objective: "Objective",
      assessment: "Assessment",
      plan: "Plan",
    },
    empty: {
      subjective: "No subjective data extracted",
      objective: "No objective data extracted",
      assessment: "No assessment data extracted",
      plan: "No plan data extracted",
    },
  },
  hindi: {
    resultTitle: "क्लिनिकल नोट",
    resultLabel: "हिंदी में जनरेट किया गया",
    titles: {
      subjective: "सब्जेक्टिव",
      objective: "ऑब्जेक्टिव",
      assessment: "असेसमेंट",
      plan: "प्लान",
    },
    empty: {
      subjective: "कोई सब्जेक्टिव डेटा नहीं मिला",
      objective: "कोई ऑब्जेक्टिव डेटा नहीं मिला",
      assessment: "कोई असेसमेंट डेटा नहीं मिला",
      plan: "कोई प्लान डेटा नहीं मिला",
    },
  },
  malayalam: {
    resultTitle: "ക്ലിനിക്കൽ നോട്ട് ഫലം",
    resultLabel: "മലയാളത്തിൽ തയാറാക്കിയത്",
    titles: {
      subjective: "സബ്ജക്ടീവ്",
      objective: "ഒബ്ജക്ടീവ്",
      assessment: "അസസ്മെന്റ്",
      plan: "പ്ലാൻ",
    },
    empty: {
      subjective: "വിവരങ്ങൾ ലഭ്യമല്ല",
      objective: "വിവരങ്ങൾ ലഭ്യമല്ല",
      assessment: "വിവരങ്ങൾ ലഭ്യമല്ല",
      plan: "വിവരങ്ങൾ ലഭ്യമല്ല",
    },
  },
};

const SoapSection = ({ title, content, borderColor, icon }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      borderLeft: `4px solid ${borderColor}`,
      marginBottom: '1rem',
    }}
  >
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>{icon}</span> {title}
    </h3>
    <p style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.625' }}>
      {content}
    </p>
  </div>
);

export default function SOAPNoteDisplay({ soap, language = "english" }) {
  const sections = parseSoapNote(soap);
  const copy = contentByLanguage[language] || contentByLanguage.english;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#dbeafe',
          color: '#0A2463',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
        }}
      >
        {copy.resultLabel}
      </div>

      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1.5rem' }}>
        {copy.resultTitle}
      </h2>

      <SoapSection
        title={copy.titles.subjective}
        content={sections.subjective || copy.empty.subjective}
        borderColor="#3b82f6"
        icon="S"
      />

      <SoapSection
        title={copy.titles.objective}
        content={sections.objective || copy.empty.objective}
        borderColor="#22c55e"
        icon="O"
      />

      <SoapSection
        title={copy.titles.assessment}
        content={sections.assessment || copy.empty.assessment}
        borderColor="#f97316"
        icon="A"
      />

      <SoapSection
        title={copy.titles.plan}
        content={sections.plan || copy.empty.plan}
        borderColor="#a855f7"
        icon="P"
      />
    </div>
  );
}
