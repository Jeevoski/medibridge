const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || "models/gemma-4-31b-it";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to generate dynamic mock SOAP notes in multiple languages
function generateMockSOAP(summary, lang) {
  let age = "Adult";
  const ageMatch = summary.match(/(\d+)\s*(year|yr)s?/i);
  if (ageMatch) {
    age = `${ageMatch[1]}-year-old`;
  }

  let gender = "patient";
  const genderMatch = summary.match(/\b(male|female|man|woman|boy|girl)\b/i);
  if (genderMatch) {
    gender = genderMatch[1].toLowerCase();
  }

  const symptoms = [];
  const commonSymptoms = ["fever", "cough", "body ache", "headache", "pain", "rash", "diarrhea", "nausea", "vomiting", "sore throat", "fatigue", "weakness", "back pain"];
  commonSymptoms.forEach(s => {
    if (new RegExp(`\\b${s}s?\\b`, "i").test(summary)) {
      symptoms.push(s);
    }
  });
  if (symptoms.length === 0) {
    symptoms.push("general symptoms");
  }

  let temp = "98.6°F";
  const tempMatch = summary.match(/(\d+(\.\d+)?)\s*(F|C|°F|°C|degree|degrees)/i) || summary.match(/fever\s*(of\s*)?(\d+(\.\d+)?)/i);
  if (tempMatch) {
    temp = tempMatch[0];
  }

  let allergies = "No known drug allergies";
  const allergyMatch = summary.match(/(?:allergies|allergy|allergic)\s*to\s*([^.,\n]+)/i);
  if (allergyMatch) {
    allergies = `Allergic to ${allergyMatch[1].trim()}`;
  }

  const translations = {
    hindi: {
      fever: "बुखार (Fever)",
      cough: "खांसी (Cough)",
      "body ache": "शरीर में दर्द (Body ache)",
      headache: "सिरदर्द (Headache)",
      pain: "दर्द (Pain)",
      rash: "चकत्ते (Rash)",
      diarrhea: "दस्त (Diarrhea)",
      nausea: "जी मिचलाना (Nausea)",
      vomiting: "उल्टी (Vomiting)",
      "sore throat": "गले में खराश (Sore throat)",
      fatigue: "थकान (Fatigue)",
      weakness: "कमजोरी (Weakness)",
      "back pain": "पीठ दर्द (Back pain)",
      "general symptoms": "सामान्य लक्षण (General symptoms)"
    },
    malayalam: {
      fever: "പനി (Fever)",
      cough: "ചുമ (Cough)",
      "body ache": "ശരീരവേദന (Body ache)",
      headache: "തലവേദന (Headache)",
      pain: "വേദന (Pain)",
      rash: "തിണർപ്പ് (Rash)",
      diarrhea: "വയറിളക്കം (Diarrhea)",
      nausea: "ഓക്കാനം (Nausea)",
      vomiting: "ഛർദ്ദി (Vomiting)",
      "sore throat": "തൊണ്ടവേദന (Sore throat)",
      fatigue: "ക്ഷീണം (Fatigue)",
      weakness: "തളർച്ച (Weakness)",
      "back pain": "നടുവേദന (Back pain)",
      "general symptoms": "സാധാരണ ലക്ഷണങ്ങൾ (General symptoms)"
    },
    spanish: {
      fever: "fiebre",
      cough: "tos",
      "body ache": "dolor corporal",
      headache: "dolor de cabeza",
      pain: "dolor",
      rash: "erupción",
      diarrhea: "diarrea",
      nausea: "náuseas",
      vomiting: "vómitos",
      "sore throat": "dolor de garganta",
      fatigue: "fatiga",
      weakness: "debilidad",
      "back pain": "dolor de espalda",
      "general symptoms": "síntomas generales"
    },
    french: {
      fever: "fièvre",
      cough: "toux",
      "body ache": "courbatures",
      headache: "mal de tête",
      pain: "douleur",
      rash: "éruption cutanée",
      diarrhea: "diarrhée",
      nausea: "nausée",
      vomiting: "vomissement",
      "sore throat": "mal de gorge",
      fatigue: "fatigue",
      weakness: "faiblesse",
      "back pain": "mal de dos",
      "general symptoms": "symptômes généraux"
    }
  };

  const tSymptom = (s, l) => {
    return translations[l] && translations[l][s] ? translations[l][s] : s;
  };

  const lowercaseLang = lang.toLowerCase();
  
  if (lowercaseLang.includes("hindi") || lowercaseLang.includes("हिंदी")) {
    return `SUBJECTIVE:
- रोगी एक ${age === "Adult" ? "वयस्क" : age} ${gender === "male" ? "पुरुष" : gender === "female" ? "महिला" : "रोगी"} है जो रिपोर्ट करता है: "${summary}"।
- मुख्य शिकायतें: ${symptoms.map(s => tSymptom(s, "hindi")).join(", ")}।

OBJECTIVE:
- शरीर का तापमान: ${temp}।
- शारीरिक परीक्षण: रोगी सचेत और सक्रिय है। हृदय गति और श्वसन सामान्य हैं।

ASSESSMENT:
- नैदानिक ​​प्रभाव: ${symptoms.map(s => tSymptom(s, "hindi")).join(" और ")} के लक्षण। प्राथमिक निदान: वायरल सिंड्रोम या सामान्य अस्वस्थता।

PLAN:
- उपचार योजना: पर्याप्त आराम करें और तरल पदार्थों का सेवन बढ़ाएं।
- दवाओं की प्रतिक्रिया: ${allergies === "No known drug allergies" ? "कोई ज्ञात दवा एलर्जी नहीं है" : allergies}।
- डॉक्टर के साथ अनुवर्ती संपर्क करें यदि लक्षण 3 दिनों से अधिक समय तक बने रहें।
- [नोट: यह एक लाइव-मॉक सोप नोट है जो बिना API कुंजी के चल रहा है]`;
  }

  if (lowercaseLang.includes("malayalam") || lowercaseLang.includes("മലയാളം")) {
    return `SUBJECTIVE:
- രോഗിയുടെ വിവരങ്ങൾ: "${summary}"
- രോഗലക്ഷണങ്ങൾ മോക്ക് മോഡിലാണ് പ്രോസസ്സ് ചെയ്തിരിക്കുന്നത്.

OBJECTIVE:
- ശരീര താപനില: ${temp}
- ശാരീരിക പരിശോധന: രോഗി ബോധവാനും പ്രതികരിക്കുന്നവനുമാണ്. ഹൃദയമിടിപ്പും ശ്വസനവും സാധാരണ നിലയിലാണ്.

ASSESSMENT:
- രോഗനിർണ്ണയം: ${symptoms.map(s => tSymptom(s, "malayalam")).join(", ")} ലക്ഷണങ്ങൾ. പ്രാഥമിക നിഗമനം: വൈറൽ പനി അല്ലെങ്കിൽ സാധാരണ അസ്വസ്ഥത.

PLAN:
- ചികിത്സാ പദ്ധതി: വിശ്രമിക്കുക, ധാരാളം വെള്ളം കുടിക്കുക.
- അലർജി: ${allergies === "No known drug allergies" ? "മരുന്ന് അലർജികൾ ഒന്നും കണ്ടെത്തിയിട്ടില്ല" : allergies}
- ലക്ഷണങ്ങൾ കൂടുതൽ വഷളാകുകയാണെങ്കിൽ ഡോക്ടറെ സമീപിക്കുക.
- [ശ്രദ്ധിക്കുക: GEMINI_API_KEY ലഭ്യമല്ലാത്തതിനാൽ ഇത് ഒരു മോക്ക് സോപ്പ് നോട്ടാണ്]`;
  }

  if (lowercaseLang.includes("spanish") || lowercaseLang.includes("español")) {
    return `SUBJECTIVE:
- El paciente es un ${gender === "male" ? "hombre" : gender === "female" ? "mujer" : "paciente"} de ${age === "Adult" ? "edad adulta" : age} que refiere: "${summary}".
- Síntomas principales: ${symptoms.map(s => tSymptom(s, "spanish")).join(", ")}.

OBJECTIVE:
- Temperatura corporal: ${temp}.
- Examen físico: El paciente está alerta y orientado. Frecuencia cardíaca y respiratoria normales.

ASSESSMENT:
- Impresión clínica: Síntomas de ${symptoms.map(s => tSymptom(s, "spanish")).join(" y ")}. Diagnóstico probable: Síndrome viral agudo.

PLAN:
- Indicaciones: Reposo absoluto e hidratación adecuada.
- Alergias: ${allergies === "No known drug allergies" ? "Sin alergias farmacológicas conocidas" : allergies}.
- Control médico si los síntomas empeoran en 48 horas.
- [Nota: Esta es una nota SOAP simulada dinámicamente porque GEMINI_API_KEY no está configurada]`;
  }

  if (lowercaseLang.includes("french") || lowercaseLang.includes("français")) {
    return `SUBJECTIVE:
- Le patient est un ${gender === "male" ? "homme" : gender === "female" ? "femme" : "patient"} de ${age === "Adult" ? "âge adulte" : age} qui rapporte: "${summary}".
- Symptômes principaux: ${symptoms.map(s => tSymptom(s, "french")).join(", ")}.

OBJECTIVE:
- Température corporelle: ${temp}.
- Examen physique: Patient alerte et orienté. Constantes vitales dans les limites normales.

ASSESSMENT:
- Impression clinique: Symptômes de ${symptoms.map(s => tSymptom(s, "french")).join(" et ")}. Diagnostic suspecté: Syndrome viral aigu.

PLAN:
- Directives: Repos et hydratation abondante.
- Allergies: ${allergies === "No known drug allergies" ? "Pas d'allergies médicamenteuses connues" : allergies}.
- Consulter à nouveau si les symptômes persistent au-delà de 3 jours.
- [Note: Ceci est une note SOAP simulée dynamiquement car GEMINI_API_KEY n'est pas configurée]`;
  }

  const isEnglish = lowercaseLang.includes("english");
  const prefix = isEnglish ? "" : `[Mock Mode Notice: Output translated dynamically to English for "${lang}"]\n\n`;

  return `${prefix}SUBJECTIVE:
- Patient is a ${age} ${gender} who reports: "${summary}".
- Key complaints: ${symptoms.join(", ")}.

OBJECTIVE:
- Body temperature: ${temp}.
- Physical exam: Patient is alert, cooperative, and well-oriented. Cardiorespiratory examination is normal.

ASSESSMENT:
- Clinical impression: Symptoms of ${symptoms.join(" and ")}. Primary diagnosis is acute viral syndrome / non-specific illness.

PLAN:
- Conservative management: Rest, increase fluid intake.
- Allergies noted: ${allergies}.
- Follow up if symptoms worsen or fail to improve within 3-5 days.
- [Note: This is a dynamic Mock SOAP Note generated because GEMINI_API_KEY is not set]`;
}

// Helper function to generate dynamic prescription explanations in multiple languages
function generateMockExplanation(lang) {
  const lowercaseLang = lang.toLowerCase();

  if (lowercaseLang.includes("hindi") || lowercaseLang.includes("हिंदी")) {
    return `1. Amoxicillin (एमोक्सिसिलिन) 500mg
   काम: जीवाणु संक्रमण (जैसे गले, कान, या मूत्र मार्ग का संक्रमण) के इलाज के लिए।
   दुष्प्रभाव: दस्त, जी मिचलाना, पेट में हल्का दर्द।
   चेतावनी: यदि आपको पेनिसिलिन समूह से एलर्जी है तो इस दवा का सेवन न करें। डॉक्टर द्वारा निर्धारित पूरा कोर्स पूरा करें।

2. Paracetamol (पैरासिटामोल) 650mg
   काम: बुखार कम करने और शरीर के दर्द से राहत के लिए।
   दुष्प्रभाव: यदि सही खुराक में लिया जाए तो बहुत कम दुष्प्रभाव होते हैं। अत्यधिक मात्रा में लेने पर लिवर को नुकसान पहुंच सकता है।
   चेतावनी: 24 घंटे में 4 ग्राम से अधिक न लें। शराब के सेवन से बचें।

[नोट: यह एक मॉक नुस्खा स्पष्टीकरण है क्योंकि GEMINI_API_KEY कॉन्फ़िगर नहीं है]`;
  }

  if (lowercaseLang.includes("malayalam") || lowercaseLang.includes("മലയാളം")) {
    return `1. Amoxicillin (അമോക്സിസില്ലിൻ) 500mg
   ഉപയോഗം: ബാക്ടീരിയൽ അണുബാധകൾക്ക് (തൊണ്ടവേദന, ചെവിയിലെ അണുബാധ മുതലായവ).
   പാർശ്വഫലങ്ങൾ: വയറിളക്കം, ഓക്കാനം, നേരിയ വയറുവേദന.
   മുന്നറിയിപ്പുകൾ: ഡോക്ടർ നിർദ്ദേശിച്ച കാലാവധി പൂർത്തിയാക്കുക. പെൻസിലിൻ അലർജിയുണ്ടെങ്കിൽ കഴിക്കരുത്.

2. Paracetamol (പാരസിറ്റമോൾ) 650mg
   ഉപയോഗം: പനിയും ശരീരവേദനയും കുറയ്ക്കാൻ.
   പാർശ്വഫലങ്ങൾ: നിർദ്ദേശിച്ച അളവിൽ കഴിച്ചാൽ പാർശ്വഫലങ്ങൾ കുറവാണ്. അമിതമായ അളവ് കരളിനെ ബാധിക്കാം.
   മുന്നറിയിപ്പുകൾ: 24 മണിക്കൂറിനുള്ളിൽ 4 ഗ്രാമിൽ കൂടുതൽ കഴിക്കരുത്. മദ്യപാനം ഒഴിവാക്കുക.

[ശ്രദ്ധിക്കുക: GEMINI_API_KEY ലഭ്യമല്ലാത്തതിനാൽ ഇത് ഒരു മോക്ക് വിശദീകരണമാണ്]`;
  }

  if (lowercaseLang.includes("spanish") || lowercaseLang.includes("español")) {
    return `1. Amoxicilina 500mg
   Utilizado para: Infecciones bacterianas (garganta, oídos, tracto urinario, etc.).
   Efectos secundarios: Diarrea, náuseas, dolor abdominal leve.
   Advertencias: Complete el tratamiento completo incluso si se siente mejor. No tomar si es alérgico a la penicilina.

2. Paracetamol 650mg
   Utilizado para: Aliviar el dolor y reducir la fiebre.
   Efectos secundarios: Poco comunes si se toma según las indicaciones. Dosis muy altas pueden dañar el hígado.
   Advertencias: No exceda los 4g (4000mg) en 24 horas. Evite consumir alcohol durante el tratamiento.

[Nota: Esta es una explicación de medicamentos simulada porque GEMINI_API_KEY no está configurada]`;
  }

  if (lowercaseLang.includes("french") || lowercaseLang.includes("français")) {
    return `1. Amoxicilline 500mg
   Utilisé pour: Infections bactériennes (gorge, oreilles, voies urinaires, etc.).
   Effets secondaires: Diarrhée, nausées, légers maux d'estomac.
   Avertissements: Terminez tout le traitement même si vous vous sentez mieux. Ne pas prendre en cas d'allergie à la pénicilline.

2. Paracétamol 650mg
   Utilisé pour: Soulager la douleur et réduire la fièvre.
   Effets secondaires: Rares si pris conformément aux instructions. Des doses très élevées peuvent endommager le foie.
   Avertissements: Ne pas dépasser 4g (4000mg) par 24 heures. Éviter la consommation d'alcool.

[Note: Ceci est une explication simulée de prescription car GEMINI_API_KEY n'est pas configurée]`;
  }

  return `1. Amoxicillin 500mg
   Used for: Bacterial infections (throat, ear, urinary tract, etc.).
   Side effects: Diarrhea, nausea, mild stomach discomfort.
   Warnings: Complete the full course even if you feel better. Do not take if allergic to penicillin.

2. Paracetamol 650mg
   Used for: Pain relief and reducing fever.
   Side effects: Rare when taken as directed. High doses can cause liver damage.
   Warnings: Do not exceed 4g (4000mg) in 24 hours. Avoid other paracetamol-containing products.

[Note: This is a Mock Explanation generated in English because GEMINI_API_KEY is not set]`;
}

// Helper function to clean reasoning traces and think tags from the model's response
function cleanModelResponse(text, type = "soap") {
  if (!text) return "";
  
  // Remove XML-like think tags
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  cleaned = cleaned.replace(/<\|channel>thought[\s\S]*?<channel\|>/gi, "");

  // For SOAP notes, extract final note starting from the last occurrence of SUBJECTIVE:
  if (type === "soap") {
    const subIndex = cleaned.lastIndexOf("SUBJECTIVE:");
    if (subIndex !== -1) {
      cleaned = cleaned.substring(subIndex);
    }
  } else if (type === "rx") {
    // Strip bullet thinking lines at the beginning
    const lines = cleaned.split("\n");
    let startIndex = 0;
    while (startIndex < lines.length) {
      const line = lines[startIndex].trim();
      if (line.startsWith("*") || line.toLowerCase().startsWith("role:") || line.toLowerCase().startsWith("task:") || line === "") {
        startIndex++;
      } else {
        break;
      }
    }
    if (startIndex < lines.length) {
      cleaned = lines.slice(startIndex).join("\n");
    }
  }

  return cleaned.trim();
}

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for image uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Medibridge Backend is running" });
});

// POST /soap-note - Generate SOAP note from consultation summary
app.post("/soap-note", async (req, res) => {
  try {
    const { summary, language } = req.body;

    if (!summary || summary.trim() === "") {
      return res.status(400).json({ error: "Summary is required" });
    }

    const lang = (language || "english").toLowerCase();

    const isMock = !GEMINI_API_KEY || GEMINI_API_KEY.includes("your_google_ai_studio") || GEMINI_API_KEY === "mock";
    if (isMock) {
      console.warn("⚠️ GEMINI_API_KEY is not configured. Running in Mock Mode for SOAP note.");
      const soapNote = generateMockSOAP(summary, lang);
      return res.json({ soap: soapNote });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const languageInstructions = `Write the content of each section in ${lang}, but keep the section headers exactly as SUBJECTIVE, OBJECTIVE, ASSESSMENT, and PLAN.`;

    const prompt = `You are a medical assistant. Convert the following clinical consultation summary into a structured SOAP note.

${languageInstructions}

SOAP Format:
SUBJECTIVE: Patient's symptoms and complaints as reported
OBJECTIVE: Observable findings, vital signs, test results
ASSESSMENT: Clinical diagnosis or impression
PLAN: Treatment plan, medications, follow-up

Clinical Summary:
"${summary}"

Return only the SOAP note with no extra introduction.

Generate the SOAP note now:`;

    let soapNote = "";
    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text() || "";
      soapNote = cleanModelResponse(rawText, "soap") || "Unable to generate SOAP note";
    } catch (e) {
      console.error("Model generateContent error:", e);
      if (e.message && e.message.includes("not found")) {
        return res.status(502).json({
          error: `Model \"${MODEL_NAME}\" not found for this API version. Run the models list (see Google AI Studio) or set the correct MODEL_NAME in backend/.env.`,
        });
      }
      throw e;
    }

    res.json({ soap: soapNote });
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /explain-rx - Explain prescription from image
app.post("/explain-rx", upload.single("image"), async (req, res) => {
  let imagePath = null;
  try {
    const { language } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const lang = (language || "english").toLowerCase();

    const isMock = !GEMINI_API_KEY || GEMINI_API_KEY.includes("your_google_ai_studio") || GEMINI_API_KEY === "mock";
    if (isMock) {
      console.warn("⚠️ GEMINI_API_KEY is not configured. Running in Mock Mode for Prescription Explainer.");
      const explanation = generateMockExplanation(lang);
      return res.json({ explanation: explanation });
    }

    imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const languageInstructions = `Respond in ${lang}`;

    const prompt = `You are a pharmacist. Analyze this prescription image and explain the medicines. ${languageInstructions}

For each medicine, provide:
1. Medicine name
2. Used for: [condition/purpose]
3. Side effects: [common side effects]
4. Warnings: [any important warnings or precautions]

Format the output clearly with each medicine as a separate block.

Prescription Image Analysis:`;

    let explanation = "";
    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        prompt,
      ]);

      const rawText = result.response.text() || "";
      explanation = cleanModelResponse(rawText, "rx") || "Unable to explain prescription";
    } catch (e) {
      console.error("Model generateContent error:", e);
      if (e.message && e.message.includes("not found")) {
        return res.status(502).json({
          error: `Model \"${MODEL_NAME}\" not found for this API version. Run the models list (see Google AI Studio) or set the correct MODEL_NAME in backend/.env.`,
        });
      }
      throw e;
    }

    res.json({ explanation: explanation });
  } catch (error) {
    console.error("Error explaining prescription:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Delete the uploaded file after processing
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
});

// GET /models - list available models from Google Generative Language API
app.get('/models', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('Models list fetch failed:', resp.status, text);
      return res.status(502).json({ error: 'Failed to fetch models list', detail: text });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error('Error listing models:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 Medibridge Backend running on port ${PORT}`);
});
