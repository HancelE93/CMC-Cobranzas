import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClientDto } from '../../api/dtos/update-client.dto';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../domain/interfaces/client-repository.port';
import { ClientEntity } from '../../domain/types/client.type';

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_PORT)
    private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateClientDto): Promise<ClientEntity> {
    const existing = await this.clientRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return this.clientRepo.update(id, dto);
  }
}

