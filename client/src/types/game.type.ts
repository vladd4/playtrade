export type Game = {
  id: string;
  name: string;
  description: string;
  photoPath: string;
  platforms: string[];
  servers: string[];
  region: string[];
};

export type CreateGameBody = {
  name: string;
  description: string;
  platforms: string[];
  servers: string[];
  region: string[];
  photo: string;
};
