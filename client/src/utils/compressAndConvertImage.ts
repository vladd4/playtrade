import imageCompression from "browser-image-compression";
import { EImageType, compress } from "image-conversion";

export const compressAndConvert = async (file: File) => {
  if (file) {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const jpgBlob = await compress(compressedFile, {
        quality: 0.9,
        type: EImageType.JPEG,
      });
      const newFileName = `${compressedFile.name.split(".")[0]}.jpg`;
      const jpgFile = new File([jpgBlob], newFileName, { type: "image/jpeg" });

      return jpgFile;
    } catch (error) {
      console.error("Error compressing or converting image:", error);
    }
  }
};
