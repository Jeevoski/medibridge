import { useState } from 'react'
import Navbar from './components/Navbar'
import DoctorMode from './components/DoctorMode'
import PatientMode from './components/PatientMode'
import MapMode from './components/MapMode'
import VoiceAssistMode from './components/VoiceAssistMode'
import CommunityMode from './components/CommunityMode'

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {activeTab === 'doctor' && <DoctorMode />}
        {activeTab === 'patient' && <PatientMode />}
        {activeTab === 'map' && <MapMode />}
        {activeTab === 'voice-assist' && <VoiceAssistMode />}
        {activeTab === 'community' && <CommunityMode />}
      </main>
    </div>
  )
}
