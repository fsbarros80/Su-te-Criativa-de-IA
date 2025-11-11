
export const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeTypePart, data] = result.split(',');
      const mimeType = mimeTypePart.split(':')[1].split(';')[0];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};
