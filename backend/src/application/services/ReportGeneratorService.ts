import { TestReport } from '../../domain/entities/TestReport';

export class ReportGeneratorService {
  /**
   * Generates a self-contained modern HTML report with dark styling
   */
  public generateHTMLReport(report: TestReport): string {
    const passedRatio = Math.round((report.passedSteps / (report.totalSteps || 1)) * 100);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maestro Execution Report - ${this.escape(report.flowTitle)}</title>
  <style>
    :root {
      --bg-dark: #0d1117;
      --bg-card: #161b22;
      --border-color: #30363d;
      --text-main: #c9d1d9;
      --text-dim: #8b949e;
      --accent-green: #238636;
      --accent-red: #da3633;
      --accent-blue: #58a6ff;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      margin: 0;
      padding: 24px;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    .header { border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 0.85rem;
    }
    .badge-passed { background-color: rgba(35, 134, 54, 0.2); color: #3fb950; border: 1px solid #238636; }
    .badge-failed { background-color: rgba(218, 54, 51, 0.2); color: #f85149; border: 1px solid #da3633; }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; text-align: center; }
    .metric-value { font-size: 1.8rem; font-weight: bold; margin-top: 8px; }
    .timeline { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; }
    .step-item { display: flex; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); }
    .step-index { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 16px; font-size: 0.85rem; }
    .step-passed { background: rgba(63, 185, 80, 0.15); color: #3fb950; }
    .step-failed { background: rgba(248, 81, 73, 0.15); color: #f85149; }
    .step-desc { flex-grow: 1; font-family: monospace; font-size: 0.95rem; }
    .step-duration { color: var(--text-dim); font-size: 0.85rem; }
    .logs-box { background: #000; color: #00ff66; font-family: monospace; padding: 16px; border-radius: 8px; font-size: 0.85rem; overflow-x: auto; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Maestro Execution Report</h1>
      <p style="color: var(--text-dim);">Flow: <strong>${this.escape(report.flowTitle)}</strong> | Device: <strong>${this.escape(report.deviceName)}</strong></p>
      <span class="badge ${report.status === 'PASSED' ? 'badge-passed' : 'badge-failed'}">${report.status} (${passedRatio}%)</span>
    </div>

    <div class="metrics">
      <div class="metric-card"><div>Total Steps</div><div class="metric-value">${report.totalSteps}</div></div>
      <div class="metric-card"><div>Passed</div><div class="metric-value" style="color:#3fb950">${report.passedSteps}</div></div>
      <div class="metric-card"><div>Failed</div><div class="metric-value" style="color:#f85149">${report.failedSteps}</div></div>
      <div class="metric-card"><div>Duration</div><div class="metric-value">${(report.durationMs / 1000).toFixed(2)}s</div></div>
    </div>

    <div class="timeline">
      <h3>Step Execution Timeline</h3>
      ${report.stepResults
        .map(
          (step) => `
        <div class="step-item">
          <div class="step-index ${step.status === 'PASSED' ? 'step-passed' : 'step-failed'}">${step.stepIndex + 1}</div>
          <div class="step-desc">${this.escape(step.description)}</div>
          <div class="step-duration">${step.durationMs}ms</div>
        </div>
      `
        )
        .join('')}
    </div>

    <h3>Execution Logs</h3>
    <div class="logs-box">
      ${report.logs.map((log) => `<div>${this.escape(log)}</div>`).join('')}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generates standard JUnit XML report format for CI pipelines
   */
  public generateJUnitXMLReport(report: TestReport): string {
    const timeSec = (report.durationMs / 1000).toFixed(3);
    const testcasesXml = report.stepResults
      .map((step) => {
        const stepTime = (step.durationMs / 1000).toFixed(3);
        if (step.status === 'FAILED') {
          return `    <testcase name="Step ${step.stepIndex + 1}: ${this.escape(step.description)}" time="${stepTime}">
      <failure message="${this.escape(step.errorMessage || 'Step Execution Failed')}"/>
    </testcase>`;
        }
        return `    <testcase name="Step ${step.stepIndex + 1}: ${this.escape(step.description)}" time="${stepTime}"/>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="${this.escape(report.flowTitle)}" tests="${report.totalSteps}" failures="${report.failedSteps}" errors="0" time="${timeSec}">
${testcasesXml}
  </testsuite>
</testsuites>`;
  }

  private escape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
