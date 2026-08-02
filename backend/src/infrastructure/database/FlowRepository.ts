import prisma from './PrismaClient';
import { Flow } from '../../domain/entities/Flow';
import { TestReport } from '../../domain/entities/TestReport';

export class FlowRepository {
  public async createFlow(flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Flow> {
    const created = await prisma.flow.create({
      data: {
        title: flow.title,
        appId: flow.appId,
        description: flow.description || '',
        yamlContent: flow.yamlContent,
        stepsJson: JSON.stringify(flow.steps),
        tags: flow.tags.join(','),
      },
    });

    return {
      id: created.id,
      title: created.title,
      appId: created.appId,
      description: created.description || undefined,
      yamlContent: created.yamlContent,
      steps: JSON.parse(created.stepsJson),
      tags: created.tags ? created.tags.split(',') : [],
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  public async getAllFlows(): Promise<Flow[]> {
    const records = await prisma.flow.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      appId: r.appId,
      description: r.description || undefined,
      yamlContent: r.yamlContent,
      steps: JSON.parse(r.stepsJson),
      tags: r.tags ? r.tags.split(',') : [],
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  public async getFlowById(id: string): Promise<Flow | null> {
    const record = await prisma.flow.findUnique({ where: { id } });
    if (!record) return null;

    return {
      id: record.id,
      title: record.title,
      appId: record.appId,
      description: record.description || undefined,
      yamlContent: record.yamlContent,
      steps: JSON.parse(record.stepsJson),
      tags: record.tags ? record.tags.split(',') : [],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  public async updateFlow(id: string, flow: Partial<Flow>): Promise<Flow> {
    const updated = await prisma.flow.update({
      where: { id },
      data: {
        title: flow.title,
        appId: flow.appId,
        description: flow.description,
        yamlContent: flow.yamlContent,
        stepsJson: flow.steps ? JSON.stringify(flow.steps) : undefined,
        tags: flow.tags ? flow.tags.join(',') : undefined,
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      appId: updated.appId,
      description: updated.description || undefined,
      yamlContent: updated.yamlContent,
      steps: JSON.parse(updated.stepsJson),
      tags: updated.tags ? updated.tags.split(',') : [],
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  public async deleteFlow(id: string): Promise<void> {
    await prisma.flow.delete({ where: { id } });
  }

  public async saveTestRun(report: TestReport): Promise<void> {
    await prisma.testRun.create({
      data: {
        id: report.id,
        flowId: report.flowId,
        deviceId: report.deviceId,
        status: report.status,
        durationMs: report.durationMs,
        passedSteps: report.passedSteps,
        failedSteps: report.failedSteps,
        logContent: report.logs.join('\n'),
        htmlReportPath: report.htmlReportPath,
        jsonReportPath: report.jsonReportPath,
        junitXmlPath: report.junitXmlPath,
      },
    });
  }
}
