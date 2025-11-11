import React, { useEffect } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
  onKeyNotSelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected, onKeyNotSelected }) => {

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        onKeySelected();
      } else {
        onKeyNotSelected();
      }
    };
    checkKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race condition and let the user proceed.
        // If the key is invalid, the API call will fail and they will be prompted again.
        onKeySelected();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md text-center shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Chave de API Necessária para o Veo</h2>
        <p className="text-gray-400 mb-6">
          A geração de vídeo com o Veo requer que você selecione uma chave de API do Google AI. Este recurso é um serviço pago.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Selecione Sua Chave de API
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Para mais informações sobre preços, por favor, visite a{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            documentação oficial de faturamento
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySelector;