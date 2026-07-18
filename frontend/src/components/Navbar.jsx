export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.875rem' }}>🩺</span>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463' }}>
              Medibridge
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Powered by Gemma 4</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab("doctor")}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "doctor" ? '#0A2463' : 'transparent',
              color: activeTab === "doctor" ? 'white' : '#374151',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            👨‍⚕️ Doctor Mode
          </button>
          <button
            onClick={() => setActiveTab("patient")}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "patient" ? '#0A2463' : 'transparent',
              color: activeTab === "patient" ? 'white' : '#374151',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            👤 Patient Mode
          </button>
        </div>
      </div>
    </nav>
  );
}
