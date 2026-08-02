const API_BASE = '/api';

export const api = {
  async getDevices() {
    const res = await fetch(`${API_BASE}/devices`);
    return res.json();
  },

  async getFlows() {
    const res = await fetch(`${API_BASE}/flows`);
    return res.json();
  },

  async getFlowById(id: string) {
    const res = await fetch(`${API_BASE}/flows/${id}`);
    return res.json();
  },

  async createFlow(data: any) {
    const res = await fetch(`${API_BASE}/flows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateFlow(id: string, data: any) {
    const res = await fetch(`${API_BASE}/flows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteFlow(id: string) {
    const res = await fetch(`${API_BASE}/flows/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async optimizeFlow(steps: any[]) {
    const res = await fetch(`${API_BASE}/flows/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps }),
    });
    return res.json();
  },

  async generateHtmlReport(reportData: any) {
    const res = await fetch(`${API_BASE}/reports/html`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    return res.text();
  },

  async generateJUnitReport(reportData: any) {
    const res = await fetch(`${API_BASE}/reports/junit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    return res.text();
  },
};
