import { uploadChatImage, uploadSupportChatImage } from "@/http/chatController";
import { compressAndConvert } from "./compressAndConvertImage";
import { USER_PLACEHOLDER_ID } from "./constants";

export const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setUploadedImageUrl: (arg: string) => void
) => {
  const files = e.target.files;
  if (!files) return;

  const file = files[0];
  if (file) {
    try {
      const convertedFile = await compressAndConvert(file);
      if (convertedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", convertedFile);

        const result = await uploadChatImage({ fileFormData });

        if (result) {
          setUploadedImageUrl(result.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
};

export const handleSupportFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  senderId: string,
  adminId: string
) => {
  const files = e.target.files;
  if (!files) return;

  const file = files[0];
  if (file) {
    try {
      const convertedFile = await compressAndConvert(file);
      if (convertedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", convertedFile);
        fileFormData.append("senderId", senderId);
        fileFormData.append("adminId", adminId);

        await uploadSupportChatImage(fileFormData);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }
};
