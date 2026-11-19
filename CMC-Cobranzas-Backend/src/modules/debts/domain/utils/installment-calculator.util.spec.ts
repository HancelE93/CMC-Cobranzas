import { calculateInstallments } from './installment-calculator.util';

describe('calculateInstallments', () => {
  it('should split 100 into 3 installments with total exact sum', () => {
    const installments = calculateInstallments(100, 3, 15, new Date('2026-01-01'));
    expect(installments).toHaveLength(3);
    expect(installments[0].monto).toBe(33.33);
    expect(installments[1].monto).toBe(33.33);
    expect(installments[2].monto).toBe(33.34);

    const total = installments.reduce((acc, curr) => acc + curr.monto, 0);
    expect(Number(total.toFixed(2))).toBe(100.0);
  });

  it('should return empty array when months is 0', () => {
    const installments = calculateInstallments(100, 0, 15);
    expect(installments).toEqual([]);
  });
});

