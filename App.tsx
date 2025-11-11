import React, { useState, useCallback, useRef } from 'react';
import { LoadingState } from './types';
import { fileToBase64 } from './utils/fileUtils';
import { generateImageWithImagen, editImageWithGemini } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import UploadIcon from './components/icons/UploadIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import FacebookIcon from './components/icons/FacebookIcon';
import InstagramIcon from './components/icons/InstagramIcon';
import ShareModal from './components/ShareModal';
import UndoIcon from './components/icons/UndoIcon';
import RedoIcon from './components/icons/RedoIcon';

const ImagePromptInput: React.FC<{
    onGenerate: (prompt: string) => void;
    isLoading: boolean;
}> = ({ onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('Uma imagem fotorrealista de uma paisagem urbana futurista ao pôr do sol');

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">1. Gerar com um Prompt</h3>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="ex: Um gato usando traje espacial"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                rows={3}
            />
            <button
                onClick={() => onGenerate(prompt)}
                disabled={isLoading || !prompt}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
                Gerar Imagem
            </button>
        </div>
    );
};

const ImageUpload: React.FC<{
    onUpload: (file: File) => void;
    isLoading: boolean;
}> = ({ onUpload, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">2. Ou Envie uma Imagem</h3>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 transition-colors"
            >
                 <UploadIcon className="w-5 h-5" />
                Escolher Arquivo
            </button>
        </div>
    );
};

const EditPanel: React.FC<{
    onEdit: (prompt: string, presetLabel?: string) => void;
    onReset: () => void;
    onClearEdits: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canClearEdits: boolean;
    canUndo: boolean;
    canRedo: boolean;
    isLoading: boolean;
    loadingPreset: string | null;
}> = ({ onEdit, onReset, onClearEdits, onUndo, onRedo, canClearEdits, canUndo, canRedo, isLoading, loadingPreset }) => {
    const [editPrompt, setEditPrompt] = useState('');
    
    const stylePresets = [
        // Artistic Styles
        { label: "Aquarela", prompt: "Transformar a imagem em uma pintura de aquarela, com pinceladas suaves e cores misturadas." },
        { label: "Desenho Animado", prompt: "Transformar a imagem em um estilo de desenho animado, com contornos ousados e cores planas." },
        { label: "Impressionismo", prompt: "Transformar a imagem em uma pintura impressionista, com pinceladas visíveis, foco na luz e cores vibrantes." },
        { label: "Estilo Van Gogh", prompt: "Reimaginar a imagem no estilo de Van Gogh, com pinceladas espessas e arremolinadas e cores vibrantes." },
        { label: "Cubismo", prompt: "Transformar a imagem em um estilo cubista, com formas geométricas e múltiplos pontos de vista." },
        { label: "Art Nouveau", prompt: "Aplicar um estilo Art Nouveau, com linhas fluidas e orgânicas, padrões decorativos e uma paleta de cores terrosas." },
        { label: "Ukiyo-e", prompt: "Converter a imagem em uma impressão de xilogravura japonesa Ukiyo-e, com contornos nítidos e cores planas." },
        { label: "Steampunk", prompt: "Reimaginar a imagem em um estilo steampunk, adicionando engrenagens, cobre, tubos e uma estética vitoriana industrial." },
        { label: "Pixel Art", prompt: "Transformar a imagem em pixel art, com um visual de 8 bits em blocos." },
        { label: "Esboço a Lápis", prompt: "Converter a imagem em um esboço a lápis de grafite, com linhas finas e sombreamento." },
        { label: "Arte Pop", prompt: "Aplicar um estilo de arte pop inspirado em Andy Warhol, com cores ousadas e contrastantes e um efeito de meio-tom." },
        // Color Styles
        { label: "Preto e Branco", prompt: "Converter a imagem para preto e branco, com alto contraste." },
        { label: "Sépia", prompt: "Aplicar um tom sépia à imagem para um visual antigo e quente." },
        { label: "Monocromático", prompt: "Aplicar um filtro monocromático à imagem, usando tons de uma única cor." },
        { label: "Pastel", prompt: "Converter a imagem para usar uma paleta de cores pastel suaves, com tons claros e sonhadores." },
        // Thematic Styles
        { label: "Vintage", prompt: "Aplicar um filtro de estilo vintage, com cores desbotadas e granulação de filme." },
        { label: "Gótico", prompt: "Transformar a imagem em um estilo gótico, com tons escuros, iluminação dramática e atmosfera melancólica." },
        { label: "Neon Cyberpunk", prompt: "Adicionar um brilho neon de estilo cyberpunk à imagem, com cores vibrantes e iluminação futurista." },
        { label: "Synthwave", prompt: "Aplicar uma estética synthwave, com grades de neon, um pôr do sol e elementos retrofuturistas dos anos 80." },
        { label: "Fantasia Sombria", prompt: "Reimaginar a imagem em um estilo de fantasia sombria, com iluminação de baixo contraste, tons de terra e uma atmosfera misteriosa." },
        { label: "Solarpunk", prompt: "Transformar a imagem em uma estética solarpunk, com arquitetura futurista integrada à natureza, energia renovável e uma visão otimista." },
        { label: "Film Noir", prompt: "Converter a imagem para um estilo de filme noir, com preto e branco de alto contraste, sombras fortes e uma atmosfera cinematográfica e sombria." },
        // Effects
        { label: "Arte Glitch", prompt: "Aplicar um efeito de arte glitch à imagem, com distorção digital, mudança de cor e artefatos visuais." },
        { label: "Exposição Longa", prompt: "Simular um efeito de fotografia de longa exposição, desfocando elementos em movimento como água ou luzes." },
        { label: "Papercraft", prompt: "Recriar a imagem em um estilo papercraft, como se fosse feita de camadas de papel colorido e dobrado." },
        { label: "Hora Dourada", prompt: "Ajustar a iluminação da imagem para simular a 'hora dourada', com uma luz quente, suave e dourada do final da tarde." },
        { label: "Dupla Exposição", prompt: "Criar um efeito de dupla exposição, mesclando a imagem com outra imagem de uma paisagem de floresta." },
        { label: "Foco Suave", prompt: "Aplicar um efeito de foco suave e sonhador, desfocando suavemente as bordas e realçando os destaques para um visual etéreo." },
        { label: "Anaglifo 3D", prompt: "Aplicar um efeito de anaglifo 3D retrô, criando uma imagem em camadas vermelha e ciano." },
        // Utility
        { label: "Remover Fundo", prompt: "Remover o fundo da imagem, deixando o objeto principal em um fundo branco." }
    ];

    const funnyFilters = [
        { label: "Olhos de Desenho", prompt: "Adicione olhos grandes e esbugalhados de desenho animado a quaisquer rostos na imagem." },
        { label: "Chapéu de Hélice", prompt: "Coloque um chapéu de hélice colorido no assunto principal." },
        { label: "Bigode Gigante", prompt: "Adicione um bigode gigante e enrolado no assunto." },
        { label: "Unicórnio", prompt: "Transforme o assunto principal em um unicórnio, adicionando um chifre e elementos de arco-íris." },
        { label: "Efeito Peixe", prompt: "Aplique um efeito de lente olho de peixe na imagem para uma aparência distorcida e cômica." },
        { label: "Cabeça de Abóbora", prompt: "Substitua a cabeça do assunto principal por uma abóbora esculpida." }
    ];

    const backgroundPresets = [
        { label: "Praia Tropical", prompt: "Altere o fundo para uma praia tropical serena com palmeiras e águas azul-turquesa." },
        { label: "Floresta Mística", prompt: "Altere o fundo para uma floresta mística encantada com raios de sol passando pelas árvores." },
        { label: "Espaço Sideral", prompt: "Coloque o assunto no espaço sideral, com estrelas, nebulosas e planetas distantes no fundo." },
        { label: "Paisagem Urbana Neon", prompt: "Altere o fundo para uma paisagem urbana cyberpunk à noite, com luzes de neon brilhantes e edifícios futuristas." },
        { label: "Montanhas Nevadas", prompt: "Altere o fundo para um majestoso pico de montanha coberto de neve sob um céu azul claro." },
        { label: "Fundo Abstrato", prompt: "Substitua o fundo por um padrão abstrato e colorido de redemoinhos e formas." }
    ];

    return (
         <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Editar Imagem</h3>
                <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="ex: Adicione um chapéu ao objeto principal"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    rows={2}
                />
                 <button
                    onClick={() => onEdit(editPrompt)}
                    disabled={isLoading || !editPrompt}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 transition-colors"
                >
                    {isLoading && !loadingPreset ? <Spinner /> : 'Aplicar Edição'}
                </button>
                <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">Estilos Rápidos</h4>
                    <div className="flex flex-wrap gap-2">
                        {stylePresets.map(preset => (
                            <button 
                                key={preset.label} 
                                onClick={() => onEdit(preset.prompt, preset.label)} 
                                disabled={isLoading}
                                className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                            >
                            {loadingPreset === preset.label ? <Spinner className="w-4 h-4" /> : preset.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">Filtros Engraçados</h4>
                    <div className="flex flex-wrap gap-2">
                        {funnyFilters.map(preset => (
                             <button 
                                key={preset.label} 
                                onClick={() => onEdit(preset.prompt, preset.label)} 
                                disabled={isLoading}
                                className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                            >
                               {loadingPreset === preset.label ? <Spinner className="w-4 h-4" /> : preset.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-300 mb-2">Fundos</h4>
                    <div className="flex flex-wrap gap-2">
                        {backgroundPresets.map(preset => (
                             <button 
                                key={preset.label} 
                                onClick={() => onEdit(preset.prompt, preset.label)} 
                                disabled={isLoading}
                                className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                            >
                               {loadingPreset === preset.label ? <Spinner className="w-4 h-4" /> : preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 border-t border-gray-700/50 pt-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo || isLoading}
                        className="p-2 rounded-md hover:bg-gray-700 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:bg-transparent"
                        aria-label="Desfazer"
                    >
                        <UndoIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo || isLoading}
                        className="p-2 rounded-md hover:bg-gray-700 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:bg-transparent"
                        aria-label="Refazer"
                    >
                        <RedoIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClearEdits}
                        disabled={!canClearEdits || isLoading}
                        className="text-center text-sm text-gray-400 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                        Limpar Edições
                    </button>
                    <button onClick={onReset} className="text-center text-sm text-gray-400 hover:text-white transition-colors">
                        Começar de Novo
                    </button>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [image, setImage] = useState<{mimeType: string, data: string} | null>(null);
    const [editHistory, setEditHistory] = useState<{mimeType: string, data: string}[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [loading, setLoading] = useState<LoadingState>({ image: false, edit: false });
    const [loadingPreset, setLoadingPreset] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showShareModal, setShowShareModal] = useState<string | null>(null);

    const handleError = (err: any) => {
        console.error("Application Error:", err);

        let message = "Ocorreu um erro desconhecido. Por favor, tente novamente.";
        if (err?.message) {
            message = err.message;
        } else if (typeof err === 'string') {
            message = err;
        }
    
        setError(message);
    };

    const resetState = useCallback(() => {
        setImage(null);
        setEditHistory([]);
        setHistoryIndex(-1);
        setError(null);
    }, []);

    const handleGenerateImage = async (prompt: string) => {
        resetState();
        setLoading(prev => ({ ...prev, image: true }));
        try {
            const base64Data = await generateImageWithImagen(prompt);
            const newImage = { mimeType: 'image/jpeg', data: base64Data };
            setImage(newImage);
            setEditHistory([newImage]);
            setHistoryIndex(0);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(prev => ({ ...prev, image: false }));
        }
    };

    const handleUploadImage = async (file: File) => {
        resetState();
        setLoading(prev => ({ ...prev, image: true }));
        try {
            const { mimeType, data } = await fileToBase64(file);
            const newImage = { mimeType, data };
            setImage(newImage);
            setEditHistory([newImage]);
            setHistoryIndex(0);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(prev => ({ ...prev, image: false }));
        }
    };

    const handleEditImage = async (prompt: string, presetLabel?: string) => {
        if (!image) return;
        setError(null);
        setLoading(prev => ({ ...prev, edit: true }));
        if (presetLabel) {
            setLoadingPreset(presetLabel);
        }
        try {
            const editedImageData = await editImageWithGemini(image.data, image.mimeType, prompt);
            const newHistory = editHistory.slice(0, historyIndex + 1);
            newHistory.push(editedImageData);

            setEditHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            setImage(editedImageData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(prev => ({ ...prev, edit: false }));
            setLoadingPreset(null);
        }
    };

    const handleClearEdits = useCallback(() => {
        if (editHistory.length > 0) {
            const original = editHistory[0];
            setImage(original);
            setEditHistory([original]);
            setHistoryIndex(0);
            setError(null);
        }
    }, [editHistory]);
    
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setImage(editHistory[newIndex]);
        }
    }, [historyIndex, editHistory]);

    const handleRedo = useCallback(() => {
        if (historyIndex < editHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setImage(editHistory[newIndex]);
        }
    }, [historyIndex, editHistory]);

    const handleDownloadImage = useCallback(() => {
        if (!image) return;
    
        const link = document.createElement('a');
        link.href = `data:${image.mimeType};base64,${image.data}`;
        const extension = image.mimeType.split('/')[1] || 'jpeg';
        link.download = `criacao-ia.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, [image]);

    const handleDownloadAndShare = useCallback(() => {
        handleDownloadImage();
        setShowShareModal(null);
    }, [handleDownloadImage]);
    
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < editHistory.length - 1;
    const canClearEdits = historyIndex > 0;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 shadow-lg">
                    {!image ? (
                       <div className="space-y-8">
                            <ImagePromptInput onGenerate={handleGenerateImage} isLoading={loading.image} />
                            <div className="relative text-center">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
                                <span className="relative bg-gray-800/50 px-2 text-sm text-gray-400">OU</span>
                            </div>
                            <ImageUpload onUpload={handleUploadImage} isLoading={loading.image} />
                       </div>
                    ) : (
                        <>
                            <EditPanel 
                                onEdit={handleEditImage} 
                                onReset={resetState} 
                                onClearEdits={handleClearEdits}
                                onUndo={handleUndo}
                                onRedo={handleRedo}
                                canClearEdits={canClearEdits}
                                canUndo={canUndo}
                                canRedo={canRedo}
                                isLoading={loading.edit} 
                                loadingPreset={loadingPreset} 
                            />
                        </>
                    )}
                </div>
                
                <div className="space-y-6">
                    <div className="bg-gray-800/50 aspect-square rounded-lg border border-gray-700/50 shadow-lg flex items-center justify-center relative overflow-hidden">
                        {image ? (
                            <div className="w-full h-full relative group bg-black/20">
                                <img src={`data:${image.mimeType};base64,${image.data}`} alt="Conteúdo gerado ou enviado" className="w-full h-full object-contain" />
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <button
                                        onClick={handleDownloadImage}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2 shadow-lg"
                                        aria-label="Baixar Imagem"
                                    >
                                        <DownloadIcon className="w-5 h-5" />
                                        Baixar
                                    </button>
                                    <button
                                        onClick={() => setShowShareModal('Facebook')}
                                        className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold p-3 rounded-md transition-colors shadow-lg"
                                        aria-label="Compartilhar no Facebook"
                                    >
                                        <FacebookIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowShareModal('Instagram')}
                                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-bold p-3 rounded-md transition-colors shadow-lg"
                                        aria-label="Compartilhar no Instagram"
                                    >
                                        <InstagramIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <SparklesIcon className="w-16 h-16 mx-auto mb-2" />
                                <p>Sua criação aparecerá aqui</p>
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="lg:col-span-2 bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg">
                        <p><strong>Erro:</strong> {error}</p>
                    </div>
                )}
            </main>

            {showShareModal && (
                <ShareModal
                    platform={showShareModal}
                    onClose={() => setShowShareModal(null)}
                    onDownloadAndShare={handleDownloadAndShare}
                />
            )}
        </div>
    );
};

export default App;