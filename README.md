# Medibridge

## Problem Statement
In the modern healthcare landscape, doctors are frequently overwhelmed by administrative burdens, spending up to **30–40% of their time writing clinical notes** rather than interacting directly with patients. On the other side, patients often leave clinics with handwritten prescriptions that are difficult to read, leading to poor treatment adherence and misunderstandings about medication usage, side effects, and warnings. Additionally, language barriers and illiteracy in diverse populations worsen these issues, as medical information is rarely accessible in native dialects like Malayalam or Hindi or spoken format.

Medibridge solves these problems by streamlining clinical note creation for doctors and providing clear, localized, multi-language, voice-assisted health services for patients.

---

## Project Description
**Medibridge** is a modular, AI-powered community healthcare platform offering six main features:
1. **Clinical Note Generator (Doctor Mode)**: Translates verbal or typed patient consultation summaries into structured **Clinical Notes** (Subjective, Objective, Assessment, Plan). This automates documentation and saves doctors valuable time.
2. **Prescription Explainer (Patient Mode)**: Reads uploaded prescription images, identifies the prescribed medicines, and explains their purpose, side effects, and precautions in plain, understandable language.
3. **Hospital Finder**: Uses interactive OpenStreetMap Leaflet layers to track current location, query nearby hospitals within a 5km radius (via Overpass API), and trace driving route directions (via OSRM API) showing time and distance.
4. **Voice Assistant**: Speech-to-text voice recognition and text-to-speech audio readout for medicine details—designed specifically to assist illiterate or visually impaired patients in their native languages (Malayalam, Hindi, English).
5. **Community Health**: Regional healthcare worker directory focused on the **Chengannur area** with clickable phone dial links (`tel:`) and maps coordinates.
6. **Medical Events**: Live schedule of local diagnostic camps, blood drives, and nutrition drives in the Chengannur region with route directions.

To ensure global and local accessibility, Medibridge supports full translation across **17 major languages**, including Malayalam (മലയാളം), Hindi (हिंदी), Spanish, French, and more.

---

## Google AI Usage

### Tools / Models Used
- **Google Gemma 4 (`models/gemma-4-31b-it`)**: Main instruction-tuned language and vision model used via the Google Generative Language API.

### Tech Stack Used
- **Frontend**: React.js (Vite), CSS (Tailwind)
- **Backend**: Node.js, Express.js
- **Voice Recognition**: Web Speech API (native browser-based speech-to-text)
- **Speech Output**: Web Speech Synthesis API (text-to-speech)
- **Map & Routing**: OpenStreetMap, Leaflet.js, Overpass API, OSRM API
- **PDF Generation**: jsPDF
- **Image Uploads**: Multer
- **API Communication**: Axios, `@google/generative-ai` SDK

### How Google AI Was Used
Google's Gemma 4 is integrated into the core endpoints of the Medibridge Express backend:
- **Clinical Note Synthesis**: Gemma 4 takes clinical transcripts, structure instructions, and the doctor's language preference. It reformats the transcript into standard medical sections while translating the text dynamically.
- **Prescription Vision & Extraction**: Gemma 4's multimodal capabilities are used to analyze uploaded prescription images, extract the medicine names, and generate structured explanations in the selected language.
- **Voice Medicine Finder API**: Gemma 4 powers the voice medicine assistant search. When a patient speaks the medicine name, Gemma 4 is queried to summarize the medicine's usage, side effects, and warnings in the patient's language.
- **Thought / Reasoning Cleanup**: A custom regex parser strips out Gemma 4's internal thinking traces (`<think>...</think>`) before returning the final response to ensure a clean user interface.

---

## GitHub Repo Link of the Project
[https://github.com/Jeevoski/medibridge.git](https://github.com/Jeevoski/medibridge.git)

---

## Proof of Google AI Usage
Proof documents, logs, and verification outputs are located in the `/proofs` folder.

---

## Screenshots
Below are screenshots demonstrating the application's interface:

<!-- [Insert Clinical Note Generator Screenshot Here] -->
<!-- [Insert Prescription Explainer Malayalam Output Screenshot Here] -->

*(Please add screenshot image links in the `/screenshots` folder)*

---

## Demo Video
[Click here to watch the Demo Video](https://drive.google.com/drive/folders/your-google-drive-link)

---

## Installation Steps

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- A Google AI Studio API Key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Jeevoski/medibridge.git
cd medibridge
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, configure environment variables, and start the server:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

Start the backend:
```bash
npm start
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Vite development server:
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this URL in your web browser.

---

## Team Info
Developed with ❤️ by team **Solo**
