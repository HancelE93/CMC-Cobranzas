import { GetCashFlowReportUseCase } from './get-cashflow-report.use-case';
import { CashFlowRepositoryPort } from '../../domain/interfaces/cashflow-repository.port';

describe('GetCashFlowReportUseCase', () => {
  let useCase: GetCashFlowReportUseCase;
  let mockRepo: jest.Mocked<CashFlowRepositoryPort>;

  beforeEach(() => {
    mockRepo = {
      generateReport: jest.fn(),
    };
    useCase = new GetCashFlowReportUseCase(mockRepo);
  });

  it('should call repository with specified year and month', async () => {
    mockRepo.generateReport.mockResolvedValueOnce({
      year: 2026,
      month: 11,
      periodKey: '2026-11',
      weeks: [],
      totalProyectado: 1000,
      totalEjecutado: 800,
      totalGap: 200,
      efficiency: 80,
      overdueCommitments: [],
    });

    const result = await useCase.execute({ year: 2026, month: 11 });

    expect(result.periodKey).toBe('2026-11');
    expect(mockRepo.generateReport).toHaveBeenCalledWith(2026, 11);
  });
});

