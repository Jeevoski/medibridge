## 🧠 Problem Statement

In rural and semi-urban India (and globally):
- Doctors in understaffed clinics spend **30–40% of their time writing patient notes** instead of seeing patients.
- Patients receive prescriptions but **don't understand** what medicines are for, dosages, or side effects.
- Most AI health tools require cloud connectivity and don't respect **data privacy**.

MedScribe AI solves both problems in one tool.

---

## ✨ Features

### Mode 1 — Doctor: SOAP Note Generator
- Doctor types or speaks a patient consultation summary
- Gemma 4 converts it to a structured **SOAP note** (Subjective, Objective, Assessment, Plan)
- One-click **PDF export** of the note
- Voice input via Web Speech API (no extra setup)

### Mode 2 — Patient: Prescription Explainer
- Patient uploads a **photo of their prescription**
- Gemma 4 vision reads the medicines and dosages from the image
- Returns plain-language explanation: purpose, side effects, warnings
- **Hindi / English language toggle**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| AI Model | Gemma 4 27B via Google AI Studio API (`@google/generative-ai`) |
| Image Handling | Multer (multipart upload) |
| Voice Input | Web Speech API (browser-native) |
| PDF Export | jsPDF |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
medscribe-ai/
├── backend/
│   ├── index.js              # Express server, all API routes
│   ├── .env                  # GEMINI_API_KEY, PORT (never commit this)
│   ├── .env.example          # Template for env vars
│   ├── package.json
│   └── uploads/              # Temp folder for image uploads (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Root component, tab routing
│   │   ├── main.jsx          # React entry point
│   │   ├── index.css         # Global styles + Tailwind imports
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navigation with logo and tab switcher
│   │   │   ├── DoctorMode.jsx        # SOAP note generator UI
│   │   │   ├── PatientMode.jsx       # Prescription explainer UI
│   │   │   ├── SOAPNoteDisplay.jsx   # Formatted SOAP note result card
│   │   │   ├── RxExplanation.jsx     # Medicine explanation result cards
│   │   │   ├── VoiceInput.jsx        # Mic button + Web Speech API logic
│   │   │   ├── ImageUpload.jsx       # Drag-and-drop image upload component
│   │   │   ├── LanguageToggle.jsx    # Hindi/English switcher
│   │   │   ├── LoadingSpinner.jsx    # Loading state component
│   │   │   └── PDFExportButton.jsx   # jsPDF export trigger
│   │   └── utils/
│   │       ├── api.js        # Axios calls to backend (all API logic here)
│   │       └── pdfExport.js  # jsPDF formatting logic
│   ├── public/
│   │   └── logo.svg          # MedScribe AI logo
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- Google AI Studio API Key (free at [aistudio.google.com](https://aistudio.google.com))

---

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/medscribe-ai.git
cd medscribe-ai
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
PORT=5000
```

Start backend:
```bash
node index.js
# Output: Server running on port 5000
```

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Output: Local: http://localhost:5173
```

---

## 🔌 API Routes

### POST `/soap-note`
Converts a plain consultation summary into a structured SOAP note.

**Request Body:**
```json
{
  "summary": "35 year old male, fever 102F, dry cough, body ache for 3 days. No known allergies."
}
```

**Response:**
```json
{
  "soap": "SUBJECTIVE:\nPatient reports fever of 102F...\n\nOBJECTIVE:\n...\n\nASSESSMENT:\n...\n\nPLAN:\n..."
}
```

---

### POST `/explain-rx`
Accepts a prescription image and returns plain-language medicine explanations.

**Request:** `multipart/form-data`
- `image` — prescription photo (jpg/png)
- `language` — `"english"` or `"hindi"`

**Response:**
```json
{
  "explanation": "1. Paracetamol 500mg\n   Used for: Fever and pain relief\n   Side effects: Rare at normal doses..."
}
```

---

## 💻 Component Specifications

### `App.jsx`
- Renders `<Navbar />` at top
- State: `activeTab` — either `"doctor"` or `"patient"`
- Conditionally renders `<DoctorMode />` or `<PatientMode />` based on `activeTab`
- Pass `setActiveTab` down to `<Navbar />`

---

### `Navbar.jsx`
- Logo on left: stethoscope icon + "MedScribe AI" text
- Two tab buttons: "Doctor Mode" and "Patient Mode"
- Active tab has highlighted style (blue border bottom or filled background)
- Tagline below: "Powered by Gemma 4"

---

### `DoctorMode.jsx`
- Heading: "Generate SOAP Note"
- Subheading: "Speak or type your patient consultation summary"
- `<VoiceInput />` component — mic button that fills text area via Web Speech API
- Large `<textarea>` for consultation summary (min 4 rows)
- "Generate SOAP Note" submit button
- On submit: call `api.generateSOAP(summary)` → show loading → display `<SOAPNoteDisplay />`
- `<PDFExportButton />` shown only after result is loaded

---

### `PatientMode.jsx`
- Heading: "Understand Your Prescription"
- Subheading: "Upload a photo of your prescription"
- `<LanguageToggle />` — toggle between English and Hindi
- `<ImageUpload />` — drag and drop or click to upload (accepts jpg, jpeg, png)
- Preview of uploaded image (small thumbnail)
- "Explain My Prescription" submit button
- On submit: call `api.explainRx(imageFile, language)` → show loading → display `<RxExplanation />`

---

### `SOAPNoteDisplay.jsx`
- Props: `{ soap: string }`
- Parse the SOAP string into 4 sections: Subjective, Objective, Assessment, Plan
- Each section rendered as a card with colored left border:
  - Subjective → blue
  - Objective → green
  - Assessment → orange
  - Plan → purple
- Clean, readable font (medical feel)

---

### `RxExplanation.jsx`
- Props: `{ explanation: string }`
- Parse explanation into individual medicine blocks
- Each medicine rendered as a card with:
  - Medicine name as heading
  - "Used for", "Side effects", "Warnings" as labeled rows
  - Warning row uses red/amber color

---

### `VoiceInput.jsx`
- Mic button (uses browser `window.SpeechRecognition` or `webkitSpeechRecognition`)
- Props: `{ onTranscript: (text) => void }`
- Shows red pulsing indicator when recording
- On stop: calls `onTranscript(text)` to fill parent textarea
- If browser doesn't support speech: show tooltip "Voice not supported in this browser"

---

### `ImageUpload.jsx`
- Props: `{ onImageSelect: (file) => void }`
- Drag-and-drop zone with dashed border
- Click to open file picker
- Accepts: `image/jpeg`, `image/png`
- On file select: show thumbnail preview + filename
- "Remove" button to clear selection

---

### `LanguageToggle.jsx`
- Props: `{ language, setLanguage }`
- Two pill buttons: "English" | "हिंदी"
- Active pill filled, inactive outlined

---

### `LoadingSpinner.jsx`
- Centered spinner with message: "Gemma 4 is thinking..."
- Use Tailwind `animate-spin` or CSS keyframe

---

### `PDFExportButton.jsx`
- Props: `{ soapNote: string }`
- Button: "Export as PDF"
- On click: calls `pdfExport.generatePDF(soapNote)` from utils

---

### `utils/api.js`
```js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const generateSOAP = async (summary) => {
  const res = await axios.post(`${BASE_URL}/soap-note`, { summary });
  return res.data.soap;
};

export const explainRx = async (imageFile, language) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("language", language);
  const res = await axios.post(`${BASE_URL}/explain-rx`, formData);
  return res.data.explanation;
};
```

---

### `utils/pdfExport.js`
```js
import jsPDF from "jspdf";

export const generatePDF = (soapText) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("MedScribe AI — SOAP Note", 20, 20);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(soapText, 170);
  doc.text(lines, 20, 35);
  doc.save(`soap-note-${Date.now()}.pdf`);
};
```

---

## 🎨 UI Design Guidelines

- **Color palette:** Medical clean — white background, deep blue (`#0A2463`) primary, soft green (`#3E9B6E`) accent
- **Font:** Use Google Fonts — `DM Sans` for body, `DM Serif Display` for headings
- **Cards:** Rounded corners (`rounded-xl`), subtle shadow (`shadow-md`), white background
- **Buttons:** Rounded pill style, blue fill for primary actions
- **Overall feel:** Professional, trustworthy, clean — like a real health tool, not a student project
- **Responsive:** Works on mobile (single column) and desktop (max-width 900px centered)

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_key_here
PORT=5000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

For production, change `VITE_API_URL` to your deployed backend URL on Render.

---

## 🚢 Deployment

### Frontend → Vercel
1. Push `frontend/` folder to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` in Vercel environment variables (your Render backend URL)
4. Deploy

### Backend → Render
1. Push `backend/` folder to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set `GEMINI_API_KEY` and `PORT=5000` as environment variables
4. Build command: `npm install`
5. Start command: `node index.js`

---

## 📝 Technical Write-Up Outline (for Kaggle submission)

1. **Problem** — Healthcare gap in rural/semi-urban regions
2. **Solution** — MedScribe AI: dual-mode health assistant
3. **Gemma 4 Usage** — Text generation for SOAP notes + Vision API for prescription reading
4. **Architecture** — React frontend, Node/Express backend, Google AI Studio API
5. **Privacy Design** — Images processed server-side and deleted immediately after response
6. **Impact** — Estimated time saved per doctor per day, language accessibility via Hindi mode
7. **Future Scope** — Offline mode via Ollama E4B, EHR integration, WhatsApp bot interface

---

## .gitignore
```
node_modules/
.env
backend/uploads/
dist/
.DS_Store
```

---

## 👤 Author

**Phulkeshwar Mahto**
B.Tech Computer Engineering, NIAMT Ranchi
---

*Built with ❤️ using Gemma 4 for the Gemma 4 Good Hackathon — Kaggle × Google DeepMind, April 2026*
