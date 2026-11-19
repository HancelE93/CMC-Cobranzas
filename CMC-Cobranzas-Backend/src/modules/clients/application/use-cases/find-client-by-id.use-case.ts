import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../domain/interfaces/client-repository.port';
import { ClientEntity } from '../../domain/types/client.type';

@Injectable()
export class FindClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY_PORT)
    private readonly clientRepo: ClientRepositoryPort,
  ) {}

  async execute(id: string): Promise<ClientEntity> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return client;
  }
}

