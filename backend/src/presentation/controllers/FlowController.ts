import { Request, Response } from 'express';
import { FlowRepository } from '../../infrastructure/database/FlowRepository';
import { AIOptimizerEngine } from '../../application/services/AIOptimizerEngine';

export class FlowController {
  private flowRepo = new FlowRepository();
  private aiOptimizer = new AIOptimizerEngine();

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const flows = await this.flowRepo.getAllFlows();
      res.json({ success: true, flows });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const flow = await this.flowRepo.getFlowById(id);
      if (!flow) {
        res.status(404).json({ success: false, error: 'Flow not found' });
        return;
      }
      res.json({ success: true, flow });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, appId, description, yamlContent, steps, tags } = req.body;
      const flow = await this.flowRepo.createFlow({
        title: title || 'New Recorded Flow',
        appId: appId || 'com.example.app',
        description: description || '',
        yamlContent: yamlContent || '',
        steps: steps || [],
        tags: tags || ['recorded'],
      });
      res.status(201).json({ success: true, flow });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.flowRepo.updateFlow(id, req.body);
      res.json({ success: true, flow: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.flowRepo.deleteFlow(id);
      res.json({ success: true, message: 'Flow deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public optimize = async (req: Request, res: Response): Promise<void> => {
    try {
      const { steps } = req.body;
      const result = this.aiOptimizer.optimize(steps || []);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
