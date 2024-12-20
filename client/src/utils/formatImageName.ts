export const formatImageName = (name: string) => {
  const maxLength = 25;
  const extension = name.split('.').pop();
  const baseName = name.replace(`.${extension}`, '');

  if (name.length > maxLength) {
    const splitLength = maxLength - extension!.length - 3;
    return `${baseName.slice(0, splitLength)}...${extension}`;
  }

  return name;
};

export const formatMessages = (message: string) => {
  if (message) {
    const maxLength = 30;
    const baseMessage = message.split('&&imageUrl=').shift();

    if (message.length > maxLength) {
      const splitLength = maxLength - 3;
      return `${baseMessage!.slice(0, splitLength)}...`;
    }
  }

  return message;
};

export const formatImageFromServer = (image: string) => {
  // Remove all leading slashes
  const imagePath = image.replace(/^\/+/, '');

  // Remove 'api' prefix if present
  const cleanPath = imagePath.startsWith('api/') ? imagePath.slice(4) : imagePath;

  // Add a single leading slash
  return `/${cleanPath}`;
};
