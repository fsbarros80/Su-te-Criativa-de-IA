import React from 'react';
import Spinner from './Spinner';
import FilmIcon from './icons/FilmIcon';

interface AnimationPanelProps {
  onAnimate: () => void;
  isLoading: boolean;
  hasAnimation: boolean;
}

const AnimationPanel: React.FC<AnimationPanelProps> = ({ onAnimate, isLoading, hasAnimation }) => {
  return (
    <div className="space-y-4 border-t border-gray-700/50 pt-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-200">3. Animar Imagem</h3>
      <p className="text-sm text-gray-400">
        Dê vida à sua imagem! A geração de vídeo pode levar alguns minutos.
      </p>
      <button
        onClick={onAnimate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 transition-colors"
      >
        {isLoading ? <Spinner /> : <FilmIcon className="w-5 h-5" />}
        {hasAnimation ? 'Gerar Novamente' : 'Gerar Animação'}
      </button>
    </div>
  );
};

export default AnimationPanel;