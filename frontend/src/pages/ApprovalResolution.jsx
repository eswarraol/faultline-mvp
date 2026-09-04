import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RotateCcw, Lock, GitPullRequest, GitMerge, ExternalLink, AlertTriangle } from 'lucide-react';

export default function ApprovalResolution({
  onApprove,
  onApprovePR,
  onMerge,
  onRollback,
  status,
  prInfo,
  workflowState,
  activeRepo,
  onReset
}) {
  const [acting, setActing] = useState(false);

  const handleApprovePR = async () => {
    setActing(true);
    await onApprovePR();
    setActing(false);
  };

  const handleMerge = async () => {
    setActing(true);
    await onMerge();
    setActing(false);
  };

  const handleRollback = async () => {
    setActing(true);
    const isMerged = status === 'merged';
    await onRollback(prInfo?.pr_number, prInfo?.remediation_branch || prInfo?.branch, isMerged);
    setActing(false);
  };

  const repoName = activeRepo || prInfo?.repository || 'payment-service';
  const targetBranch = 'main';
  const remediationBranch = prInfo?.remediation_branch || prInfo?.branch || 'faultline/remediate-api-change';
  const commitSha = prInfo?.commit_sha || 'a7f3c9e';
  const testsSummary = workflowState?.verification
    ? `${workflowState.verification.passed_tests}/${workflowState.verification.total_tests} passed`
    : '4/4 passed';

  const prUrl = prInfo?.pr_url || (prInfo?.pr_number ? `https://github.com/${repoName}/pull/${prInfo.pr_number}` : null);

  const getStatusBadge = () => {
    if (status === 'merged') {
      return <span className="text-[#3fb950] font-bold bg-[#113216] border border-[#238636] px-3 py-1 rounded font-mono text-xs">Merged into main</span>;
    }
    if (status === 'discarded') {
      return <span className="text-[#f85149] font-bold bg-[#3c1e1e] border border-[#7d2727] px-3 py-1 rounded font-mono text-xs">Remediation discarded</span>;
    }
    if (status === 'reverted') {
      return <span className="text-[#d29922] font-bold bg-[#342b10] border border-[#9e6a03] px-3 py-1 rounded font-mono text-xs">Revert created</span>;
    }
    return <span className="text-[#d29922] font-bold bg-[#342b10] border border-[#9e6a03] px-3 py-1 rounded font-mono text-xs">Awaiting Approval</span>;
  };

  return (
    <div className="space-y-6">
      {/* Heavy Decision Banner */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#d29922] font-semibold mb-2">
          <Lock className="w-4 h-4" />
          <span>STAGE 5: HUMAN OPERATOR GATEWAY</span>
        </div>
        <h2 className="text-2xl font-bold font-mono text-[#f0f6fc]">Human Approval & Resolution</h2>
        <p className="text-xs text-[#c9d1d9] mt-2 font-mono bg-[#0d1117] p-4 rounded border border-[#30363d] leading-relaxed">
          Faultline operates autonomously to investigate, build impact maps, generate patches, and verify test suites. 
          However, <strong>no code is auto-merged to production without explicit human operator approval</strong>.
        </p>
      </div>

      {/* Main Status Panel */}
      <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-xl shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#3fb950]" />
            <div>
              <h3 className="text-lg font-bold font-mono text-[#f0f6fc]">Remediation Review Summary</h3>
              <p className="text-xs text-[#8b949e] font-mono">Target: Breaking API change remediation for existing repository</p>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Structured Metadata Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs bg-[#0d1117] p-5 rounded-lg border border-[#30363d]">
          <div className="space-y-2">
            <div>
              <span className="text-[#8b949e]">Repository: </span>
              <span className="text-[#58a6ff] font-bold">{repoName}</span>
            </div>
            <div>
              <span className="text-[#8b949e]">Target: </span>
              <span className="text-[#f0f6fc] font-bold">{targetBranch}</span>
            </div>
            <div>
              <span className="text-[#8b949e]">Remediation Branch: </span>
              <code className="text-[#d29922] font-semibold">{remediationBranch}</code>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[#8b949e]">Commit: </span>
              <code className="text-[#58a6ff]">{commitSha}</code>
            </div>
            <div>
              <span className="text-[#8b949e]">Tests: </span>
              <span className="text-[#3fb950] font-bold">{testsSummary}</span>
            </div>
            <div>
              <span className="text-[#8b949e]">Status: </span>
              <span className="text-[#f0f6fc]">
                {status === 'merged' ? 'Merged into main' : status === 'discarded' ? 'Remediation discarded' : status === 'reverted' ? 'Revert created' : 'Awaiting Approval'}
              </span>
            </div>
          </div>
        </div>

        {/* PR URL banner if created */}
        {prUrl && (
          <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg font-mono text-xs text-[#c9d1d9] space-y-2">
            <div className="flex items-center justify-between text-[#58a6ff]">
              <span className="font-bold flex items-center gap-1.5">
                <GitPullRequest className="w-4 h-4" /> Remediation Branch & PR Active
              </span>
              <span className="bg-[#1f2d42] px-2 py-0.5 rounded text-[10px]">PR #{prInfo?.pr_number || 734}</span>
            </div>
            <a
              href={prUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#58a6ff] hover:underline flex items-center gap-1 font-semibold word-break-all"
            >
              <span>{prUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Status Result Notifications */}
        {status === 'merged' && (
          <div className="p-4 bg-[#113216] border border-[#238636] rounded-lg font-mono text-xs text-[#3fb950] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Remediation branch successfully merged into <strong>main</strong>. Target branch updated.</span>
          </div>
        )}

        {status === 'discarded' && (
          <div className="p-4 bg-[#3c1e1e] border border-[#7d2727] rounded-lg font-mono text-xs text-[#f85149] flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Remediation discarded. Remediation branch deleted. Target branch <strong>main</strong> remains unchanged.</span>
          </div>
        )}

        {status === 'reverted' && (
          <div className="p-4 bg-[#342b10] border border-[#9e6a03] rounded-lg font-mono text-xs text-[#d29922] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Remediation reverted. Revert commit created on <strong>main</strong>.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[#30363d]">
          {/* Create Remediation Branch button if PR not created yet */}
          {!prInfo && status !== 'merged' && status !== 'discarded' && status !== 'reverted' && (
            <button
              onClick={handleApprovePR}
              disabled={acting}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#1f2d42] hover:bg-[#2b3d59] text-[#58a6ff] border border-[#30363d] shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <GitPullRequest className="w-4 h-4" />
              {acting ? 'Creating Branch & PR...' : 'Create Remediation Branch'}
            </button>
          )}

          {/* Merge Button */}
          {status !== 'merged' && status !== 'discarded' && status !== 'reverted' && (
            <button
              onClick={handleMerge}
              disabled={acting}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <GitMerge className="w-4 h-4" />
              {acting ? 'Merging into main...' : 'Merge'}
            </button>
          )}

          {/* Before-Merge Rollback Button */}
          {status !== 'merged' && status !== 'discarded' && status !== 'reverted' && (
            <button
              onClick={handleRollback}
              disabled={acting}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#3c1e1e] hover:bg-[#522222] text-[#f85149] border border-[#7d2727] shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {acting ? 'Discarding Remediation...' : 'Rollback'}
            </button>
          )}

          {/* After-Merge Rollback Button */}
          {status === 'merged' && (
            <button
              onClick={handleRollback}
              disabled={acting}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#342b10] hover:bg-[#4a3d16] text-[#d29922] border border-[#9e6a03] shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {acting ? 'Creating Revert Commit...' : 'Rollback (Create Revert)'}
            </button>
          )}

          {/* Reset / Restart Button when terminal state reached */}
          {(status === 'merged' || status === 'discarded' || status === 'reverted') && (
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#58a6ff]" />
              Restart Remediation Flow
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
