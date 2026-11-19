import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../context/database/prisma.service';
import { CashFlowRepositoryPort } from '../../domain/interfaces/cashflow-repository.port';
import { CashFlowCalculator } from '../../domain/utils/cashflow-calculator.util';
import {
  CashFlowReport,
  OverdueCommitment,
  WeeklyCashFlow,
} from '../../domain/types/cashflow.type';

@Injectable()
export class PrismaCashFlowRepository implements CashFlowRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async generateReport(year: number, month: number): Promise<CashFlowReport> {
    const periodKey = `${year}-${String(month).padStart(2, '0')}`;
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month - 1, daysInMonth, 23, 59, 59));

    const weeks = CashFlowCalculator.initializeWeeks(daysInMonth);
    const debts = await this.prisma.debt.findMany({
      where: { estado: { not: 'ANULADA' } },
      include: { cliente: true, producto: true },
    });

    this.aggregateProjections(debts, periodKey, weeks);

    const payments = await this.prisma.payment.findMany({
      where: {
        fechaPago: { gte: startDate, lte: endDate },
        estadoRegistro: { not: 'ANULADO' },
      },
    });

    this.aggregateExecutions(payments, weeks);

    const overdueCommitments = this.collectOverdue(debts);
    const summary = CashFlowCalculator.computeSummary(weeks);

    return {
      year,
      month,
      periodKey,
      weeks,
      ...summary,
      overdueCommitments,
    };
  }

  private aggregateProjections(debts: any[], periodKey: string, weeks: WeeklyCashFlow[]): void {
    for (const debt of debts) {
      const cuotas = Array.isArray(debt.cuotas) ? (debt.cuotas as any[]) : [];
      if (cuotas.length > 0) {
        for (const c of cuotas) {
          if (typeof c.fechaVencimiento === 'string' && c.fechaVencimiento.startsWith(periodKey)) {
            const day = parseInt(c.fechaVencimiento.slice(8, 10), 10);
            weeks[CashFlowCalculator.getWeekIndex(day) - 1].proyectado += Number(c.monto || 0);
          }
        }
      } else {
        const refStr = debt.fechaAdquisicion.toISOString().slice(0, 7);
        if (refStr === periodKey) {
          const day = debt.fechaAdquisicion.getUTCDate();
          weeks[CashFlowCalculator.getWeekIndex(day) - 1].proyectado += Number(debt.precioAcordado);
        }
      }
    }
  }

  private aggregateExecutions(payments: any[], weeks: WeeklyCashFlow[]): void {
    for (const p of payments) {
      const day = p.fechaPago.getUTCDate();
      weeks[CashFlowCalculator.getWeekIndex(day) - 1].ejecutado += Number(p.monto);
    }
  }

  private collectOverdue(debts: any[]): OverdueCommitment[] {
    const list: OverdueCommitment[] = [];
    const now = new Date();

    for (const debt of debts) {
      if (Number(debt.saldoActual) <= 0 || debt.estado === 'PAGADA') continue;
      const cuotas = Array.isArray(debt.cuotas) ? (debt.cuotas as any[]) : [];

      for (const c of cuotas) {
        if (!c.fechaVencimiento) continue;
        const vDate = new Date(c.fechaVencimiento);
        if (vDate < now) {
          const daysLate = CashFlowCalculator.calculateDaysLate(vDate, now);
          list.push({
            debtId: debt.id,
            clientId: debt.clienteId,
            clientName: `${debt.cliente.nombres} ${debt.cliente.apellidos}`,
            clientCedula: debt.cliente.cedula,
            clientPhone: debt.cliente.telefono,
            clientEmail: debt.cliente.correo,
            productName: debt.producto.nombre,
            promisedDate: c.fechaVencimiento,
            daysLate,
            expectedAmount: Number(c.monto || 0),
            pendingBalance: Number(debt.saldoActual),
            debtStatus: debt.estado,
            weekIndex: CashFlowCalculator.getWeekIndex(vDate.getUTCDate()),
          });
        }
      }
    }
    return list;
  }
}

