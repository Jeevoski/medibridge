import React from 'react';

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

export default function CommunityMode() {
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
            Chengannur Community Health
          </h2>
          <p style={{ color: '#4b5563' }}>
            Directory of local doctors and healthcare workers in the Chengannur region.
          </p>
        </div>

        {/* Doctors Grid */}
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

      </div>
    </div>
  );
}
