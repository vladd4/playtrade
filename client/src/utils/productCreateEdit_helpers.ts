import imageCompression from 'browser-image-compression';

import { Dispatch, RefObject, SetStateAction } from 'react';

import { compressAndConvert } from './compressAndConvertImage';

export const handleImageClick = (fileInputRef: RefObject<HTMLInputElement>) => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

export const handleFileChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setUploadedImages: Dispatch<SetStateAction<File[]>>,
) => {
  const files = e.target.files;
  if (!files) return;

  const compressedFiles: File[] = [];

  for (const file of Array.from(files)) {
    const convertedFile = await compressAndConvert(file);
    if (convertedFile) {
      compressedFiles.push(convertedFile as File);
    }
  }
  setUploadedImages((prev) => [...prev, ...compressedFiles]);
};

export const handleCreateFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  setForm: Dispatch<
    SetStateAction<{
      name: string;
      game: string;
      productType: string;
      server: string;
      region: string;
      platform: string;
      description: string;
      fullDescription: string;
      price: string;
    }>
  >,
) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

export const handleEditFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  setForm: Dispatch<
    SetStateAction<{
      name: string;
      description: string;
      detailDescription: string;
      price: string;
    }>
  >,
) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};

export const resetCreateFormState = (
  setForm: Dispatch<
    SetStateAction<{
      name: string;
      game: string;
      productType: string;
      server: string;
      region: string;
      platform: string;
      description: string;
      fullDescription: string;
      price: string;
    }>
  >,
) => {
  setForm({
    name: '',
    game: '',
    productType: '',
    server: '',
    region: '',
    platform: '',
    description: '',
    fullDescription: '',
    price: '',
  });
};

export const resetEditFormState = (
  setForm: Dispatch<
    SetStateAction<{
      name: string;
      description: string;
      fullDescription: string;
      price: string;
    }>
  >,
) => {
  setForm({
    name: '',
    description: '',
    fullDescription: '',
    price: '',
  });
};
