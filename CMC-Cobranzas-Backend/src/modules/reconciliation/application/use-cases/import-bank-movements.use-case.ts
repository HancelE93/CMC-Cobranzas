import { Inject, Injectable } from '@nestjs/common';
import {
  BANK_MOVEMENT_REPOSITORY,
  BankMovementRepositoryPort,
} from '../../domain/interfaces/bank-movement-repository.port';
import { ImportMovementsDto } from '../../api/dtos/import-movements.dto';

export interface ImportResult {
  banco: string;
  totalReceived: number;
  inserted: number;
  duplicates: number;
}

@Injectable()
export class ImportBankMovementsUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly repo: BankMovementRepositoryPort,
  ) {}

  async execute(dto: ImportMovementsDto): Promise<ImportResult> {
    const dataToInsert = dto.movimientos.map((m) => ({
      fecha: new Date(m.fecha),
      monto: m.monto,
      numeroTransaccion: m.numeroTransaccion.trim(),
      referencia: m.referencia?.trim(),
      ordenante: m.ordenante?.trim(),
      banco: dto.banco.trim(),
    }));

    const result = await this.repo.createMany(dataToInsert);

    return {
      banco: dto.banco,
      totalReceived: dto.movimientos.length,
      inserted: result.inserted,
      duplicates: result.duplicates,
    };
  }
}

