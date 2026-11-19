import { Installment } from '../types/debt.type';

export function calculateInstallments(
  totalAmount: number,
  months: number,
  cutOffDay: number,
  startDate: Date = new Date(),
): Installment[] {
  if (months <= 0) return [];

  const rawQuota = Math.floor((totalAmount / months) * 100) / 100;
  const installments: Installment[] = [];
  let accumulated = 0;

  for (let i = 1; i <= months; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    dueDate.setDate(Math.min(cutOffDay, 28));

    const isLast = i === months;
    const amount = isLast ? Number((totalAmount - accumulated).toFixed(2)) : rawQuota;
    accumulated += amount;

    installments.push({
      numero: i,
      monto: amount,
      fechaVencimiento: dueDate.toISOString().split('T')[0],
      estado: 'pendiente',
    });
  }

  return installments;
}

