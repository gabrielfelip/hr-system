import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa o seu componente principal App

// Seleciona o elemento HTML com id="root" onde a aplicação React será montada
const rootElement = document.getElementById('root');

if (rootElement) {
  // Cria um "root" do React e renderiza o componente App dentro dele
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Emite um erro se o elemento #root não for encontrado (importante para depuração)
  console.error('Element with ID "root" not found in the document.');
}
