import { UserAdminEntity, UserRole, UserStatus, UserWithPasswordEntity } from '../types/user-admin.type';

export interface FindUsersParams {
  search?: string;
  rol?: UserRole;
  estado?: UserStatus;
  skip?: number;
  take?: number;
}

export interface UserAdminRepositoryPort {
  create(data: Omit<UserWithPasswordEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserAdminEntity>;
  findById(id: string): Promise<UserAdminEntity | null>;
  findByUsernameOrEmail(identifier: string): Promise<UserAdminEntity | null>;
  findAll(params?: FindUsersParams): Promise<{ items: UserAdminEntity[]; total: number }>;
  update(id: string, data: Partial<UserWithPasswordEntity>): Promise<UserAdminEntity>;
}

export const USER_ADMIN_REPOSITORY_PORT = Symbol('UserAdminRepositoryPort');

