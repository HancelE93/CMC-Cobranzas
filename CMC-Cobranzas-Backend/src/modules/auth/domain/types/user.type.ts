export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  nombre: string;
  cargo: string;
  rol: string;
  estado: string;
  permisos?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  nombre: string;
  cargo: string;
  rol?: string;
}

