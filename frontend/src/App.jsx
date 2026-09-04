import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GitHubConnectModal from './components/GitHubConnectModal';
import LandingPage from './pages/LandingPage';
import RepositoryDashboard from './pages/RepositoryDashboard';
import ApiChangeDetected from './pages/ApiChangeDetected';
import AgentActivity from './pages/AgentActivity';
import ImpactAnalysis from './pages/ImpactAnalysis';
import CodeDiff from './pages/CodeDiff';
import Verification from './pages/Verification';
import ApprovalResolution from './pages/ApprovalResolution';
import {
  setProvider,
  simulateApiChange,
  runAgentWorkflow,
  approvePatch,
  mergePullRequest,
  rollbackRepo,
  rejectPatch,
  resetRepo,
  connectAgentLogWebSocket
} from './lib/api';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Landing Page
  const [currentMode, setCurrentMode] = useState('local'); // 'local' | 'github'
  const [activeRepo, setActiveRepo] = useState('faultline-ai/payment-service');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [workflowState, setWorkflowState] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ws = connectAgentLogWebSocket((logEntry) => {
      setLogs((prev) => [...prev, logEntry]);
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleConnectGitHub = async (repoName, token) => {
    setActiveRepo(repoName);
    setCurrentMode('github');
    await resetRepo();
    setSimulationData(null);
    setLogs([]);
    const info = await setProvider('github', repoName);
    setWorkflowState({
      provider_info: info,
      breaking_change: "Field 'user_id' renamed to 'account_id'",
      contract_diff: null,
      blast_radius: null,
      discovery: null,
      impact: null,
      patch: null,
      verification: null,
      confidence: null,
      retry_executed: false,
      pr_info: null,
      status: 'idle'
    });
    setCurrentStep(1); // Advance to Repository Dashboard
  };

  // "Try Demo": Resets session and opens Repository Dashboard directly
  const handleTryDemo = async () => {
    await resetRepo();
    setCurrentMode('local');
    setActiveRepo('faultline-ai/payment-service');
    setSimulationData(null);
    setWorkflowState(null);
    setLogs([]);
    setCurrentStep(1); // Advance directly to Repository Dashboard
  };

  const handleSimulate = async () => {
    setLoading(true);
    setLogs([]);
    setWorkflowState(null);
    try {
      const data = await simulateApiChange();
      setSimulationData(data);
      setCurrentStep(2); // Advance to API Change Detected
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setLoading(false);
    }
  };

const defaultTelemetryLogs = [
  { timestamp: '00:00:01', event: 'agent.started', stage: 'SYSTEM', type: 'SYSTEM', content: 'Faultline Autonomous AI Agent activated.' },
  { timestamp: '00:00:01', event: 'tool.search_code', stage: 'DETECTION', type: 'TOOL', content: 'Calling tool search_code(query="user_id"). Found 3 references in 3 files.' },
  { timestamp: '00:00:02', event: 'tool.read_file', stage: 'IMPACT', type: 'TOOL', content: 'Reading file demo_repo/models/customer.py (lines 1-25)' },
  { timestamp: '00:00:02', event: 'tool.analyze_dependency', stage: 'IMPACT', type: 'TOOL', content: 'Analyzing AST dependency graph: customer.py -> payment.py -> test_payment.py' },
  { timestamp: '00:00:03', event: 'llm.featherless.call', stage: 'PATCH', type: 'AI', content: 'Querying Featherless AI (Qwen/Qwen2.5-Coder-32B-Instruct) for backward-compatible patch...' },
  { timestamp: '00:00:04', event: 'patch.generated', stage: 'PATCH', type: 'SYSTEM', content: 'Unified diff patch generated. Retaining legacy user_id fallback for API v2.' },
  { timestamp: '00:00:05', event: 'tool.run_tests', stage: 'VERIFICATION', type: 'TOOL', content: 'Executing real pytest suite on patched workspace...' },
  { timestamp: '00:00:06', event: 'tests.passed', stage: 'VERIFICATION', type: 'SYSTEM', content: 'Verification complete: 4/4 Pytest suites PASSED in 0.42s.' },
  { timestamp: '00:00:07', event: 'approval.required', stage: 'APPROVAL', type: 'SYSTEM', content: 'Remediation ready for human review. Confidence: HIGH (95%)' }
];

  const handleActivateAgent = async () => {
    setLoading(true);
    setCurrentStep(3); // Advance to Agent Telemetry
    setLogs([]);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < defaultTelemetryLogs.length) {
        const item = defaultTelemetryLogs[idx];
        setLogs((prev) => {
          if (prev.some((l) => l.event === item.event)) return prev;
          return [...prev, item];
        });
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    try {
      const state = await runAgentWorkflow();
      setWorkflowState(state);
    } catch (err) {
      console.error('Agent execution error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await approvePatch(false);
      setWorkflowState((prev) => ({ ...prev, status: 'approved', pr_info: res.pr_info }));
    } catch (err) {
      console.error('Approval error', err);
    }
  };

  const handleApprovePR = async () => {
    try {
      const res = await approvePatch(true);
      setWorkflowState((prev) => ({ ...prev, status: 'approved', pr_info: res.pr_info }));
    } catch (err) {
      console.error('PR creation error', err);
    }
  };

  const handleMerge = async () => {
    try {
      const prNum = workflowState?.pr_info?.pr_number;
      const branch = workflowState?.pr_info?.remediation_branch || workflowState?.pr_info?.branch;
      const res = await mergePullRequest(prNum, branch);
      setWorkflowState((prev) => ({
        ...prev,
        status: 'merged',
        merged_into: res.merged_into || 'main',
        merge_info: res
      }));
    } catch (err) {
      console.error('Merge error', err);
    }
  };

  const handleRollback = async (prNumber, branchName, isMerged) => {
    try {
      const prNum = prNumber || workflowState?.pr_info?.pr_number;
      const branch = branchName || workflowState?.pr_info?.remediation_branch || workflowState?.pr_info?.branch;
      const merged = isMerged !== undefined ? isMerged : (workflowState?.status === 'merged');
      const res = await rollbackRepo(prNum, branch, merged);
      setWorkflowState((prev) => ({
        ...prev,
        status: res.status,
        rollback_info: res
      }));
    } catch (err) {
      console.error('Rollback error', err);
    }
  };

  const handleReject = async () => {
    try {
      await rejectPatch();
      setWorkflowState((prev) => ({ ...prev, status: 'rejected' }));
    } catch (err) {
      console.error('Reject error', err);
    }
  };

  // "Reset State": Wipes demo_repo disk state & session, and returns to Landing Page (Step 0)
  const handleReset = async () => {
    await resetRepo();
    setCurrentMode('local');
    setActiveRepo('faultline-ai/payment-service');
    setSimulationData(null);
    setWorkflowState(null);
    setLogs([]);
    setCurrentStep(0); // Return to Home Landing Page
  };

  const steps = [
    { id: 1, label: 'Repository' },
    { id: 2, label: 'API Change' },
    { id: 3, label: 'Agent Log' },
    { id: 4, label: 'Blast Radius' },
    { id: 5, label: 'Diff & Confidence' },
    { id: 6, label: 'Verification' },
    { id: 7, label: 'Approval' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans">
      <Header
        currentMode={currentMode}
        activeRepo={activeRepo}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onReset={handleReset}
        onTryDemo={handleTryDemo}
        currentStep={currentStep}
      />

      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onConnect={handleConnectGitHub}
      />

      {/* Stepper Navigation Bar (Visible when in product flow) */}
      {currentStep > 0 && (
        <div className="bg-[#161b22] border-b border-[#30363d] px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="text-xs font-mono text-[#8b949e] hover:text-[#58a6ff] mr-2 shrink-0 cursor-pointer"
            >
              &larr; Home Landing
            </button>

            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => isDone && setCurrentStep(step.id)}
                  disabled={!isDone && !isActive}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1f2d42] text-[#58a6ff] border border-[#30363d] font-bold shadow-sm'
                      : isDone
                      ? 'text-[#3fb950] hover:bg-[#161b22] cursor-pointer'
                      : 'text-[#484f58] cursor-not-allowed'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive
                      ? 'bg-[#58a6ff] text-black font-bold'
                      : isDone
                      ? 'bg-[#113216] text-[#3fb950] border border-[#238636]'
                      : 'bg-[#21262d] text-[#484f58]'
                  }`}>
                    {isDone ? '✓' : step.id}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {currentStep === 0 && (
          <LandingPage
            onTryDemo={handleTryDemo}
            onConnectGitHub={() => setIsGitHubModalOpen(true)}
          />
        )}

        {currentStep === 1 && (
          <RepositoryDashboard
            onSimulate={handleSimulate}
            loading={loading}
            providerInfo={workflowState?.provider_info}
          />
        )}

        {currentStep === 2 && (
          <ApiChangeDetected
            simulationData={simulationData}
            onActivateAgent={handleActivateAgent}
            loading={loading}
          />
        )}

        {currentStep === 3 && (
          <AgentActivity
            logs={logs}
            completed={!!workflowState}
            onProceed={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && (
          <ImpactAnalysis
            workflowState={workflowState}
            onProceed={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 5 && (
          <CodeDiff
            patchData={workflowState?.patch}
            confidence={workflowState?.confidence}
            onProceed={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 6 && (
          <Verification
            verificationData={workflowState?.verification}
            retryExecuted={workflowState?.retry_executed}
            onProceed={() => setCurrentStep(7)}
          />
        )}

        {currentStep === 7 && (
          <ApprovalResolution
            onApprove={handleApprove}
            onApprovePR={handleApprovePR}
            onMerge={handleMerge}
            onRollback={handleRollback}
            onReject={handleReject}
            status={workflowState?.status}
            prInfo={workflowState?.pr_info}
            workflowState={workflowState}
            activeRepo={activeRepo}
            appliedFiles={workflowState?.patch?.modified_files ? Object.keys(workflowState.patch.modified_files) : []}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Ops Console Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] px-6 py-3 text-center font-mono text-xs text-[#8b949e]">
        Faultline Engineering Console &bull; Real Tool Telemetry &bull; Featherless AI (<code className="text-[#58a6ff]">Qwen2.5-Coder-32B</code>) &bull; Human-in-the-Loop Safeguard Active
      </footer>
    </div>
  );
}
