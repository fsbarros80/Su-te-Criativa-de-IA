import React from 'react';
import XCircleIcon from './icons/XCircleIcon';
import DownloadIcon from './icons/DownloadIcon';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';

interface ShareModalProps {
  platform: 'Facebook' | 'Instagram' | string;
  onClose: () => void;
  onDownloadAndShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ platform, onClose, onDownloadAndShare }) => {
  const platformDetails = {
    Facebook: {
      icon: <FacebookIcon className="w-8 h-8 text-white" />,
      color: "bg-[#1877F2]",
      instructions: "Para compartilhar no Facebook, primeiro baixe a imagem e depois a envie em uma nova postagem."
    },
    Instagram: {
      icon: <InstagramIcon className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
      instructions: "Para compartilhar no Instagram, baixe a imagem, transfira-a para o seu celular, se necessário, e crie uma nova postagem no aplicativo."
    }
  };

  const details = platformDetails[platform as keyof typeof platformDetails];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md text-center shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <XCircleIcon className="w-6 h-6" />
        </button>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${details.color}`}>
          {details.icon}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Compartilhar no {platform}</h2>
        <p className="text-gray-400 mb-6">
          {details.instructions}
        </p>
        <button
          onClick={onDownloadAndShare}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <DownloadIcon className="w-5 h-5" />
          Baixar Imagem e Continuar
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
