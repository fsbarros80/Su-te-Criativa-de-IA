import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => (
  <header className="text-center p-4 md:p-6 border-b border-gray-700/50">
    <div className="flex items-center justify-center gap-3">
      <SparklesIcon className="w-8 h-8 text-blue-400" />
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Suíte Criativa de IA
      </h1>
    </div>
    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
      Gere, edite e anime. Dê vida às suas ideias a partir de uma única imagem.
    </p>
  </header>
);

export default Header;