import { GoogleGenAI, Modality } from "@google/genai";

// A chave de API é injetada pelo ambiente.
const getApiKey = () => process.env.API_KEY;

export const generateImageWithImagen = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Chave de API não encontrada");
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("A geração da imagem falhou.");
    }

    return response.generatedImages[0].image.imageBytes;
};

export const editImageWithGemini = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{mimeType: string, data: string}> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Chave de API não encontrada");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
        return {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data
        };
    }
    
    throw new Error("A edição da imagem não conseguiu produzir uma imagem.");
};
