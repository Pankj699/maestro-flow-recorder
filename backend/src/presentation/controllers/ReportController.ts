import { Request, Response } from 'express';
import { ReportGeneratorService } from '../../application/services/ReportGeneratorService';
import { TestReport } from '../../domain/entities/TestReport';

export class ReportController {
  private reportService = new ReportGeneratorService();

  public generateHtml = (req: Request, res: Response): void => {
    try {
      const reportData: TestReport = req.body;
      const html = this.reportService.generateHTMLReport(reportData);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public generateJUnitXml = (req: Request, res: Response): void => {
    try {
      const reportData: TestReport = req.body;
      const xml = this.reportService.generateJUnitXMLReport(reportData);
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
