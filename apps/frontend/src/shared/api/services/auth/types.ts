export type AuthUser = {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
};
