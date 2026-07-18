import React from 'react';

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

export default function EventsMode() {
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
            Nearby Medical Events
          </h2>
          <p style={{ color: '#4b5563' }}>
            Schedule and locations of local diagnostic camps, blood drives, and immunization programs in Chengannur.
          </p>
        </div>

        {/* Events Grid */}
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

      </div>
    </div>
  );
}
