import { Injectable } from '@nestjs/common';

@Injectable()
export class DiagnosticService {
  getRiskMap(tenant: string, months: number) {
    const labels = this.buildLabels(months);

    return {
      tenant,
      labels,
      baixo: this.buildSeries(months, 10, -1),
      medio: this.buildSeries(months, 5, 1),
      alto: this.buildSeries(months, 2, 1),
    };
  }

  private buildLabels(months: number): string[] {
    const now = new Date();
    const labels: string[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(
        d.toLocaleDateString('pt-BR', { month: 'short' }),
      );
    }

    return labels;
  }

  private buildSeries(
    months: number,
    start: number,
    variation: number,
  ): number[] {
    return Array.from({ length: months }).map((_, i) => {
      return Math.max(0, start + i * variation);
    });
  }
}
