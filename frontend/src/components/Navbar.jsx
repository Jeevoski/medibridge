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

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
          <button
            onClick={() => setActiveTab("doctor")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "doctor" ? '#0A2463' : 'transparent',
              color: activeTab === "doctor" ? 'white' : '#374151',
              border: activeTab === "doctor" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Doctor Mode
          </button>
          <button
            onClick={() => setActiveTab("patient")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "patient" ? '#0A2463' : 'transparent',
              color: activeTab === "patient" ? 'white' : '#374151',
              border: activeTab === "patient" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Patient Mode
          </button>
          <button
            onClick={() => setActiveTab("map")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "map" ? '#0A2463' : 'transparent',
              color: activeTab === "map" ? 'white' : '#374151',
              border: activeTab === "map" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Hospital Finder
          </button>
          <button
            onClick={() => setActiveTab("voice-assist")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "voice-assist" ? '#0A2463' : 'transparent',
              color: activeTab === "voice-assist" ? 'white' : '#374151',
              border: activeTab === "voice-assist" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Voice Assistant
          </button>
          <button
            onClick={() => setActiveTab("community")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "community" ? '#0A2463' : 'transparent',
              color: activeTab === "community" ? 'white' : '#374151',
              border: activeTab === "community" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Community Health
          </button>
          <button
            onClick={() => setActiveTab("events")}
            style={{
              flex: '1',
              minWidth: '130px',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              backgroundColor: activeTab === "events" ? '#0A2463' : 'transparent',
              color: activeTab === "events" ? 'white' : '#374151',
              border: activeTab === "events" ? 'none' : '1px solid #d1d5db',
              cursor: 'pointer',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            Medical Events
          </button>
        </div>
      </div>
    </nav>
  );
}
