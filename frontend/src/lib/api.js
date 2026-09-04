// Frontend REST API & WebSocket service manager.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL || API_BASE.replace(/^http/, 'ws');

export async function setProvider(providerType = 'local', repo = 'faultline-ai/payment-service') {
  const res = await fetch(`${API_BASE}/api/provider/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider_type: providerType, repo: repo })
  });
  return res.json();
}

export async function resetRepo() {
  const res = await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
  return res.json();
}

export async function simulateApiChange() {
  const res = await fetch(`${API_BASE}/api/simulate`, { method: 'POST' });
  return res.json();
}

export async function runAgentWorkflow() {
  const res = await fetch(`${API_BASE}/api/run-agent`, { method: 'POST' });
  return res.json();
}

export async function approvePatch(createPR = false) {
  const res = await fetch(`${API_BASE}/api/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ create_pr: createPR })
  });
  return res.json();
}

export async function rollbackRepo() {
  const res = await fetch(`${API_BASE}/api/rollback`, { method: 'POST' });
  return res.json();
}

export async function rejectPatch() {
  const res = await fetch(`${API_BASE}/api/reject`, { method: 'POST' });
  return res.json();
}

export async function getWorkflowState() {
  const res = await fetch(`${API_BASE}/api/state`);
  return res.json();
}

export function connectAgentLogWebSocket(onMessageCallback) {
  const ws = new WebSocket(`${WS_BASE}/ws/agent`);

  ws.onopen = () => {
    console.log('[WebSocket] Connected to Faultline agent telemetry');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessageCallback) {
        onMessageCallback(data);
      }
    } catch (e) {
      console.error('[WebSocket] JSON parse error', e);
    }
  };

  ws.onerror = (err) => {
    console.error('[WebSocket] Error', err);
  };

  ws.onclose = () => {
    console.log('[WebSocket] Connection closed');
  };

  return ws;
}
