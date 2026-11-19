import { WeeklyCashFlow } from '../types/cashflow.type';

export class CashFlowCalculator {
  static getWeekIndex(day: number): number {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  }

  static initializeWeeks(daysInMonth: number): WeeklyCashFlow[] {
    return [
      { week: 1, label: 'Semana 1', range: 'Dia 1 - 7', proyectado: 0, ejecutado: 0 },
      { week: 2, label: 'Semana 2', range: 'Dia 8 - 14', proyectado: 0, ejecutado: 0 },
      { week: 3, label: 'Semana 3', range: 'Dia 15 - 21', proyectado: 0, ejecutado: 0 },
      { week: 4, label: 'Semana 4+', range: `Dia 22 - ${daysInMonth}`, proyectado: 0, ejecutado: 0 },
    ];
  }

  static computeSummary(weeks: WeeklyCashFlow[]) {
    const totalProyectado = Number(weeks.reduce((acc, w) => acc + w.proyectado, 0).toFixed(2));
    const totalEjecutado = Number(weeks.reduce((acc, w) => acc + w.ejecutado, 0).toFixed(2));
    const totalGap = Number((totalProyectado - totalEjecutado).toFixed(2));
    const efficiency =
      totalProyectado > 0 ? Number(((totalEjecutado / totalProyectado) * 100).toFixed(1)) : 0;

    return { totalProyectado, totalEjecutado, totalGap, efficiency };
  }

  static calculateDaysLate(promisedDate: Date, now = new Date()): number {
    const diff = now.getTime() - promisedDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  }
}

