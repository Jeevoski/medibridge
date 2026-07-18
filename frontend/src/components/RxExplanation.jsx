const parseMedicines = (text) => {
  const medicines = [];
  const lines = text.split("\n");

  let currentMedicine = null;
  let introLines = [];
  let footerLines = [];
  let inFooter = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    // Check if line marks a medicine block start (e.g. "1. Dextrose" or "**1. Dextrose**" or "1) Dextrose")
    const medHeaderMatch = trimmed.match(/^(?:\*\*|###)?\s*(\d+)[\.\)]\s*(.*?)(?:\*\*|:)?\s*$/i);
    
    if (medHeaderMatch) {
      if (currentMedicine) {
        medicines.push(currentMedicine);
      }
      currentMedicine = {
        name: medHeaderMatch[2].trim(),
        usedFor: "",
        sideEffects: "",
        warnings: "",
      };
      inFooter = false;
    } else if (currentMedicine) {
      // Check if we hit footer or other instructions (e.g., "---" or "Other advice" or "നിർദ്ദേശങ്ങൾ" or "ശ്രദ്ധിക്കുക")
      if (trimmed.startsWith("---") || /^(?:other|advice|directions|note|attention|മറ്റ്|പ്രത്യേകം)/i.test(trimmed)) {
        inFooter = true;
      }

      if (inFooter) {
        footerLines.push(trimmed);
      } else {
        const lower = trimmed.toLowerCase();
        
        // Match sub-properties
        if (
          lower.includes("used for") ||
          lower.includes("purpose") ||
          lower.includes("ഉപയോഗം") ||
          lower.includes("उपयोग") ||
          lower.includes("काम") ||
          lower.includes("utilis") ||
          lower.includes("utiliz")
        ) {
          currentMedicine.usedFor = trimmed.replace(/^(?:\*|-)?\s*(?:\*\*|###)?\s*(?:used for|purpose|ഉപയോഗം|उपयोग|काम|utilisé pour|utilizado para|utilis|utiliz)\s*\(.*?\)?\s*:\s*(?:\*\*|###)?/i, "").trim();
        } else if (
          lower.includes("side effect") ||
          lower.includes("adverse") ||
          lower.includes("പാർശ്വഫലങ്ങൾ") ||
          lower.includes("दुष्प्रभाव") ||
          lower.includes("effet") ||
          lower.includes("efecto")
        ) {
          currentMedicine.sideEffects = trimmed.replace(/^(?:\*|-)?\s*(?:\*\*|###)?\s*(?:side effects?|adverse|പാർശ്വഫലങ്ങൾ|दुष्प्रभाव|effet|efecto)\s*\(.*?\)?\s*:\s*(?:\*\*|###)?/i, "").trim();
        } else if (
          lower.includes("warning") ||
          lower.includes("precaution") ||
          lower.includes("മുന്നറിയിപ്പുകൾ") ||
          lower.includes("चेतावनी") ||
          lower.includes("avertisse") ||
          lower.includes("advertencia")
        ) {
          currentMedicine.warnings = trimmed.replace(/^(?:\*|-)?\s*(?:\*\*|###)?\s*(?:warnings?|precautions?|മുന്നറിയിപ്പുകൾ|चेतावनी|avertisse|advertencia)\s*\(.*?\)?\s*:\s*(?:\*\*|###)?/i, "").trim();
        } else {
          // If it doesn't match any, append it to the last active section
          if (currentMedicine.warnings) {
            currentMedicine.warnings += "\n" + trimmed;
          } else if (currentMedicine.sideEffects) {
            currentMedicine.sideEffects += "\n" + trimmed;
          } else if (currentMedicine.usedFor) {
            currentMedicine.usedFor += "\n" + trimmed;
          } else {
            currentMedicine.usedFor = trimmed;
          }
        }
      }
    } else {
      // Intro lines before the first medicine block
      introLines.push(trimmed);
    }
  }

  if (currentMedicine) {
    medicines.push(currentMedicine);
  }

  if (medicines.length === 0) {
    return {
      intro: "",
      medicines: [{
        name: "Clinical Guidance",
        usedFor: text,
        sideEffects: "",
        warnings: ""
      }],
      footer: ""
    };
  }

  return {
    intro: introLines.join("\n"),
    medicines,
    footer: footerLines.join("\n")
  };
};

const labelsByLanguage = {
  english: {
    title: "Prescription Explanation",
    usedFor: "Used for",
    sideEffects: "Side effects",
    warnings: "Warnings",
  },
  hindi: {
    title: "दवा की जानकारी (Prescription Explanation)",
    usedFor: "काम / उपयोग (Used for)",
    sideEffects: "दुष्प्रभाव (Side effects)",
    warnings: "चेतावनी (Warnings)",
  },
  malayalam: {
    title: "മരുന്ന് വിവരണം (Prescription Explanation)",
    usedFor: "ഉപയോഗം (Used for)",
    sideEffects: "പാർശ്വഫലങ്ങൾ (Side effects)",
    warnings: "മുന്നറിയിപ്പുകൾ (Warnings)",
  }
};

const MedicineCard = ({ medicine, labels }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    marginBottom: '1rem',
    borderLeft: '4px solid #0A2463',
  }}>
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1rem' }}>
      💊 {medicine.name}
    </h3>

    {medicine.usedFor && (
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontWeight: '500', color: '#1f2937' }}>{labels.usedFor}:</p>
        <p style={{ color: '#374151', marginLeft: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{medicine.usedFor}</p>
      </div>
    )}

    {medicine.sideEffects && (
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontWeight: '500', color: '#1f2937' }}>{labels.sideEffects}:</p>
        <p style={{ color: '#374151', marginLeft: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{medicine.sideEffects}</p>
      </div>
    )}

    {medicine.warnings && (
      <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #dc2626', padding: '0.75rem', borderRadius: '0.25rem' }}>
        <p style={{ fontWeight: '500', color: '#991b1b' }}>⚠️ {labels.warnings}:</p>
        <p style={{ color: '#b91c1c', marginLeft: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{medicine.warnings}</p>
      </div>
    )}
  </div>
);

export default function RxExplanation({ explanation, language = "english" }) {
  const { intro, medicines, footer } = parseMedicines(explanation);
  const labels = labelsByLanguage[language] || labelsByLanguage.english;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '1.5rem' }}>
        {labels.title}
      </h2>

      {intro && (
        <div style={{
          backgroundColor: '#eff6ff',
          borderLeft: '4px solid #3b82f6',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          color: '#1e3a8a',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {intro}
        </div>
      )}

      {medicines.map((medicine, index) => (
        <MedicineCard key={index} medicine={medicine} labels={labels} />
      ))}

      {footer && (
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          marginTop: '1.5rem',
          color: '#4b5563',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap'
        }}>
          {footer.replace(/^---+/gm, "").trim()}
        </div>
      )}
    </div>
  );
}
