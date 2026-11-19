export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'COBRADOR' | 'AUDITOR';
export type UserStatus = 'ACTIVO' | 'INACTIVO';

export interface UserAdminEntity {
  id: string;
  username: string;
  email: string;
  nombre: string;
  cargo: string;
  rol: UserRole;
  estado: UserStatus;
  permisos?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPasswordEntity extends UserAdminEntity {
  passwordHash: string;
}

