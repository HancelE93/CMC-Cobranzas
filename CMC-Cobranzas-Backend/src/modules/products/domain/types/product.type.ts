export type ProductStatus = 'ACTIVO' | 'INACTIVO';

export interface ProductEntity {
  id: string;
  nombre: string;
  descripcion: string;
  precioNominal: number;
  estado: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

