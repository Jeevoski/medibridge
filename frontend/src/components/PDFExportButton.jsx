import { generatePDF } from "../utils/pdfExport";

export default function PDFExportButton({ soapNote, language = "english" }) {
  const isEnglish = language === "english";

  const handleExport = () => {
    if (!isEnglish) {
      return;
    }

    generatePDF(soapNote, language);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!isEnglish}
      title={!isEnglish ? "PDF export currently supports English Clinical notes only." : "Export as PDF"}
      style={{
        marginTop: '1.5rem',
        padding: '0.5rem 1.5rem',
        backgroundColor: '#3E9B6E',
        color: 'white',
        borderRadius: '0.5rem',
        fontWeight: '500',
        border: 'none',
        cursor: !isEnglish ? 'not-allowed' : 'pointer',
        opacity: !isEnglish ? 0.6 : 1,
      }}
    >
      {!isEnglish ? "PDF export for this language coming soon" : "Export as PDF"}
    </button>
  );
}
