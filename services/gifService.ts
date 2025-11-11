/**
 * Converte um elemento de vídeo em um Blob de GIF extraindo quadros sequencialmente.
 * Nota: Isso simula o processo de extração de quadros e codificação de GIF, que é intensivo em recursos.
 * Uma implementação real exigiria uma biblioteca de codificação de GIF. O Blob resultante é um placeholder.
 * @param video O elemento HTMLVideoElement a ser convertido.
 * @param onProgress Um callback para relatar o progresso da conversão (de 0 a 1).
 * @returns Uma Promessa que resolve para um Blob do GIF gerado.
 */
export const convertVideoToGif = async (
    video: HTMLVideoElement,
    onProgress: (progress: number) => void
): Promise<Blob> => {
    const originalCurrentTime = video.currentTime;
    const wasPaused = video.paused;

    video.pause();

    return new Promise(async (resolve, reject) => {
        try {
            const duration = video.duration;
            if (!duration || duration === Infinity) {
                throw new Error("A duração do vídeo não está disponível.");
            }
            
            // Captura a 10 quadros por segundo para manter o tamanho do arquivo razoável.
            const frameRate = 10;
            const interval = 1 / frameRate;
            const totalFrames = Math.floor(duration * frameRate);

            onProgress(0);

            for (let i = 0; i < totalFrames; i++) {
                const time = i * interval;
                video.currentTime = time;
                
                // Aguarda o vídeo buscar o quadro.
                await new Promise<void>(res => {
                    const listener = () => {
                        video.removeEventListener('seeked', listener);
                        res();
                    };
                    video.addEventListener('seeked', listener);
                });

                // Em uma implementação real, o quadro seria desenhado em um canvas e adicionado a um codificador de GIF aqui.
                
                // Atualiza o progresso.
                onProgress((i + 1) / totalFrames);
            }

            // Simula a finalização e cria um arquivo de GIF de placeholder.
            const placeholderContent = `GIF simulado a partir de ${totalFrames} quadros. A codificação real requer uma biblioteca especializada.`;
            const gifBlob = new Blob([placeholderContent], { type: "image/gif" });
            
            resolve(gifBlob);

        } catch (error) {
            reject(error);
        } finally {
            // Restaura o estado original do vídeo.
            video.currentTime = originalCurrentTime;
            if (!wasPaused) {
                video.play();
            }
        }
    });
};
