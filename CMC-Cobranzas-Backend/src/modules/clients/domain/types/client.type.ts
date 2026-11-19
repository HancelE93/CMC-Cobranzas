export type ClientStatus = 'ACTIVO' | 'INACTIVO';

export interface ClientEntity {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  estado: ClientStatus;
  notas?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

