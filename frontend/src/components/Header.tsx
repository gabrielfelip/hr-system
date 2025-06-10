import React from 'react';

const Header: React.FC = () => {
  

  

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 40px',
      backgroundColor: '#2c3e50', 
      color: 'white',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 999,
      boxSizing: 'border-box'
      
    }}>
        
      <div style={{ flexGrow: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card" style={{ color: '#ffffff', marginRight: '10px' }}>
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M10 12h4"/>
            <path d="M12 15v-6"/>
            <path d="M7 12h.01"/>
            <path d="M17 12h.01"/>
        </svg>      
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sistema RH</span>
      </div>

      

      <div style={{ flexShrink: 0, width: '40px' }}>
        {     }
      </div>

    </header>
  );
};

export default Header;
