// src/layouts/MainLayout.tsx
import React from 'react';
import Header from '../components/Header'; // Caminho para o seu Header

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* A main section aplica o padding top necessário para o fixed header */}
      <main style={{ flexGrow: 1, paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;