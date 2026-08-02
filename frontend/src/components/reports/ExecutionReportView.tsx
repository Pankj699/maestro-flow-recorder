import React from 'react';
import { CheckCircle2, XCircle, Clock, Download, FileText, Code2, ShieldCheck } from 'lucide-react';
import { TestReport } from '../../store/slices/reportSlice';
import { api } from '../../services/api';

interface ExecutionReportViewProps {
  report: TestReport | null;
}

export const ExecutionReportView: React.FC<ExecutionReportViewProps> = ({ report }) => {
  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500 text-xs">
        <FileText className="w-12 h-12 mb-3 text-slate-600" />
        No test execution report selected. Run a flow using the Flow Player to view execution metrics.
      </div>
    );
  }

  const passRatio = Math.round((report.passedSteps / (report.totalSteps || 1)) * 100);

  const handleDownloadHtml = async () => {
    const html = await api.generateHtmlReport(report);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${report.id.substr(0, 8)}.html`;
    a.click();
  };

  const handleDownloadJUnit = async () => {
    const xml = await api.generateJUnitReport(report);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `junit_${report.id.substr(0, 8)}.xml`;
    a.click();
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${report.id.substr(0, 8)}.json`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-dark-900 overflow-y-auto p-8 space-y-6 select-none">
      {/* Report Summary Header */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 flex justify-between items-center shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">{report.flowTitle}</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                report.status === 'PASSED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950/60 text-rose-400 border border-rose-800'
              }`}
            >
              {report.status} ({passRatio}%)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Target Device: <strong className="text-slate-200">{report.deviceName}</strong> | Run ID: {report.id}
          </p>
        </div>

        {/* Download Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-medium shadow-md shadow-brand-600/20"
          >
            <Download className="w-3.5 h-3.5" /> HTML Report
          </button>
          <button
            onClick={handleDownloadJUnit}
            className="flex items-center gap-2 px-3.5 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 border border-dark-600 rounded-lg text-xs font-medium"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" /> JUnit XML
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-3.5 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 border border-dark-600 rounded-lg text-xs font-medium"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" /> JSON Summary
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-4 text-center">
          <span className="text-xs text-slate-400 font-medium">Total Steps</span>
          <div className="text-2xl font-bold text-white mt-1">{report.totalSteps}</div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 text-center">
          <span className="text-xs text-emerald-400 font-medium">Passed Steps</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{report.passedSteps}</div>
        </div>

        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 text-center">
          <span className="text-xs text-rose-400 font-medium">Failed Steps</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{report.failedSteps}</div>
        </div>

        <div className="bg-dark-800/80 border border-dark-700 rounded-xl p-4 text-center">
          <span className="text-xs text-slate-400 font-medium">Execution Duration</span>
          <div className="text-2xl font-bold text-brand-cyan mt-1">{(report.durationMs / 1000).toFixed(2)}s</div>
        </div>
      </div>

      {/* Step Timeline Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-dark-700/50 border-b border-dark-700 font-semibold text-xs text-white">
          Step Execution Timeline
        </div>
        <div className="divide-y divide-dark-700 text-xs">
          {report.stepResults.map((step) => (
            <div key={step.stepId} className="p-3.5 flex items-center justify-between hover:bg-dark-700/30">
              <div className="flex items-center gap-3">
                {step.status === 'PASSED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span className="font-mono text-slate-400">Step {step.stepIndex + 1}:</span>
                <span className="font-mono text-slate-200">{step.description}</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{step.durationMs}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Execution Logs */}
      <div className="bg-black border border-dark-700 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1">
        <div className="text-slate-500 pb-2 border-b border-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Execution Output Logs</span>
        </div>
        {report.logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
};
