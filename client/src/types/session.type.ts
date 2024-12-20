import { UserRoles } from '@/utils/constants';

export type LoginSessionBody = {
  username: string;
  password: string;
  secret: string;
};

export type LoginSessionResponse = {
  access_token: string;
};

export type RefreshSessionBody = {
  secret: string;
};

export type RefreshUserResponse = {
  userId: string;
  message: string;
  role: UserRoles;
};
