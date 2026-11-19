import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateClientDto } from '../../api/dtos/create-client.dto';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../domain/interfaces/client-repository.port';
import { ClientEntity } from '../../domain/types/client.type';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_PORT)
    private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(dto: CreateClientDto): Promise<ClientEntity> {
    const existing = await this.clientRepo.findByCedula(dto.cedula);
    if (existing) {
      throw new ConflictException(`Ya existe un cliente con la cédula ${dto.cedula}`);
    }

    return this.clientRepo.create({
      cedula: dto.cedula,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      correo: dto.correo,
      estado: dto.estado ?? 'ACTIVO',
      notas: dto.notas ?? null,
    });
  }
}

