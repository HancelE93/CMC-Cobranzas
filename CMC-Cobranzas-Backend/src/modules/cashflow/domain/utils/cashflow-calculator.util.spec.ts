import { CashFlowCalculator } from './cashflow-calculator.util';

describe('CashFlowCalculator', () => {
  it('should map days correctly to 4 weekly buckets', () => {
    expect(CashFlowCalculator.getWeekIndex(1)).toBe(1);
    expect(CashFlowCalculator.getWeekIndex(7)).toBe(1);
    expect(CashFlowCalculator.getWeekIndex(8)).toBe(2);
    expect(CashFlowCalculator.getWeekIndex(14)).toBe(2);
    expect(CashFlowCalculator.getWeekIndex(15)).toBe(3);
    expect(CashFlowCalculator.getWeekIndex(21)).toBe(3);
    expect(CashFlowCalculator.getWeekIndex(22)).toBe(4);
    expect(CashFlowCalculator.getWeekIndex(31)).toBe(4);
  });

  it('should compute totals, gap and efficiency properly', () => {
    const weeks = CashFlowCalculator.initializeWeeks(30);
    weeks[0].proyectado = 500;
    weeks[0].ejecutado = 400;
    weeks[1].proyectado = 500;
    weeks[1].ejecutado = 100;

    const summary = CashFlowCalculator.computeSummary(weeks);

    expect(summary.totalProyectado).toBe(1000);
    expect(summary.totalEjecutado).toBe(500);
    expect(summary.totalGap).toBe(500);
    expect(summary.efficiency).toBe(50.0);
  });
});

