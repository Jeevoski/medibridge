import React, { useState } from 'react';

const doctorsList = [
  {
    name: "Dr. Jacob Koshy",
    specialty: "General Medicine",
    phone: "+91 94460 12345",
    address: "Chengannur Clinic, MC Road, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Chengannur+Clinic+MC+Road+Chengannur"
  },
  {
    name: "Dr. Priya Nair",
    specialty: "Pediatrics (Child Specialist)",
    phone: "+91 94470 54321",
    address: "Nair Healthcare, Near KSRTC Bus Stand, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Chengannur"
  },
  {
    name: "Dr. Anand Krishna",
    specialty: "Cardiology (Heart Specialist)",
    phone: "+91 98460 98765",
    address: "Krishna Heart Care, Bypass Junction, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Bypass+Junction+Chengannur"
  },
  {
    name: "Dr. Merin Mathew",
    specialty: "Gynecology & Obstetrics",
    phone: "+91 94451 22334",
    address: "St. Thomas Medical Centre, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=St.+Thomas+Medical+Centre+Chengannur"
  }
];

const eventsList = [
  {
    title: "Free Cardiological Screening Camp",
    host: "Krishna Heart Care & Town Council",
    date: "Next Sunday",
    time: "9:00 AM - 1:00 PM",
    venue: "Chengannur Town Hall, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Town+Hall+Chengannur"
  },
  {
    title: "Community Blood Donation Drive",
    host: "Red Cross Society Chengannur",
    date: "Next Saturday",
    time: "10:00 AM - 4:00 PM",
    venue: "Christian College, Chengannur, Kerala 689122",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Christian+College+Chengannur"
  },
  {
    title: "Diabetes & Hypertension Diagnostic Camp",
    host: "Government Hospital Chengannur",
    date: "25th of this Month",
    time: "8:00 AM - 12:00 PM",
    venue: "Government District Hospital, Chengannur, Kerala 689121",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Government+Hospital+Chengannur"
  },
  {
    title: "Child Nutrition & Immunization Camp",
    host: "Primary Health Center & Anganwadi Board",
    date: "28th of this Month",
    time: "9:30 AM - 2:30 PM",
    venue: "Anganwadi Centre, Mundancavu, Chengannur, Kerala 689110",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Mundancavu+Chengannur"
  }
];

export default function CommunityMode() {
  const [activeSubTab, setActiveSubTab] = useState("doctors");

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
            Chengannur Community Health
          </h2>
          <p style={{ color: '#4b5563' }}>
            Directory of local health practitioners and upcoming medical support programs.
          </p>
        </div>

        {/* Sub Navigation Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveSubTab("doctors")}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: activeSubTab === "doctors" ? '#0A2463' : '#f3f4f6',
              color: activeSubTab === "doctors" ? 'white' : '#4b5563',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Doctors & Health Workers
          </button>
          <button
            onClick={() => setActiveSubTab("events")}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: activeSubTab === "events" ? '#0A2463' : '#f3f4f6',
              color: activeSubTab === "events" ? 'white' : '#4b5563',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Nearby Medical Events
          </button>
        </div>

        {/* Content list panels */}
        {activeSubTab === "doctors" ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {doctorsList.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                    {doc.name}
                  </h4>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.5rem',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '0.25rem',
                    marginBottom: '0.75rem'
                  }}>
                    {doc.specialty}
                  </span>
                  
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '0.5rem 0', lineHeight: '1.5' }}>
                    📍 {doc.address}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <a
                    href={`tel:${doc.phone.replace(/\s+/g, '')}`}
                    style={{
                      flex: '1',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      backgroundColor: '#3E9B6E',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '0.375rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    Call: {doc.phone}
                  </a>
                  <a
                    href={doc.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      textDecoration: 'none',
                      borderRadius: '0.375rem',
                      fontWeight: '600',
                      border: '1px solid #d1d5db',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {eventsList.map((ev, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.25rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>
                    {ev.title}
                  </h4>
                  
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    Hosted by: <span style={{ fontWeight: '500', color: '#4b5563' }}>{ev.host}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#4b5563', margin: '0.75rem 0' }}>
                    <div>📅 {ev.date}</div>
                    <div>🕒 {ev.time}</div>
                    <div style={{ lineHeight: '1.4', marginTop: '0.25rem' }}>📍 {ev.venue}</div>
                  </div>
                </div>

                <a
                  href={ev.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.5rem',
                    marginTop: '1.25rem',
                    fontSize: '0.85rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  Get Directions
                </a>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
