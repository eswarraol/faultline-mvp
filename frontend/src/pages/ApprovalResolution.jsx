import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RotateCcw, Lock, Github, ExternalLink } from 'lucide-react';

export default function ApprovalResolution({ onApprove, onApprovePR, onReject, onRollback, status, prInfo, appliedFiles, onReset }) {
  const [acting, setActing] = useState(false);

  const handleApprove = async () => {
    setActing(true);
    await onApprove();
    setActing(false);
  };

  const handleApprovePR = async () => {
    setActing(true);
    await onApprovePR();
    setActing(false);
  };

  const handleReject = async () => {
    setActing(true);
    await onReject();
    setActing(false);
  };

  if (status === 'approved') {
    return (
      <div className="space-y-6">
        <div className="bg-[#113216] border border-[#238636] p-8 rounded-xl text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#1b4b20] border border-[#238636] rounded-full flex items-center justify-center mx-auto text-[#3fb950]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-[#f0f6fc]">Patch Approved & Applied Safely</h2>
            <p className="text-xs text-[#c9d1d9] font-mono mt-2 max-w-xl mx-auto">
              Faultline verified the patch and permanently written backward-compatible API v2 field handlers to <code className="text-[#3fb950]">demo_repo</code>.
            </p>
          </div>

          {prInfo && prInfo.pr_url && (
            <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg text-left max-w-md mx-auto font-mono text-xs text-[#c9d1d9] space-y-2">
              <div className="flex items-center justify-between text-[#58a6ff]">
                <span className="font-bold flex items-center gap-1.5">
                  <Github className="w-4 h-4" /> GitHub Pull Request Created
                </span>
                <span className="bg-[#1f2d42] px-2 py-0.5 rounded text-[10px]">PR #{prInfo.pr_number}</span>
              </div>
              <a
                href={prInfo.pr_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#58a6ff] hover:underline flex items-center gap-1 font-semibold word-break-all"
              >
                <span>{prInfo.pr_url}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-[#8b949e]">
                Branch: <code className="text-[#c9d1d9]">{prInfo.branch}</code>
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={onRollback}
              className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d29922]" />
              Safe Git Rollback
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold bg-[#238636] hover:bg-[#2ea043] text-white transition-all cursor-pointer"
            >
              Reset & Restart Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="space-y-6">
        <div className="bg-[#3c1e1e] border border-[#7d2727] p-8 rounded-xl text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#522222] border border-[#7d2727] rounded-full flex items-center justify-center mx-auto text-[#f85149]">
            <XCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-mono text-[#f0f6fc]">Patch Rejected by Human Operator</h2>
            <p className="text-xs text-[#c9d1d9] font-mono mt-2 max-w-xl mx-auto">
              Changes discarded. Repository state restored to pristine snapshot.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-xs font-bold bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & Restart Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heavy Decision Banner */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#d29922] font-semibold mb-2">
          <Lock className="w-4 h-4" />
          <span>STAGE 5: HUMAN OPERATOR GATEWAY</span>
        </div>
        <h2 className="text-2xl font-bold font-mono text-[#f0f6fc]">Human Approval Required</h2>
        <p className="text-xs text-[#c9d1d9] mt-2 font-mono bg-[#0d1117] p-4 rounded border border-[#30363d] leading-relaxed">
          Faultline operates autonomously to investigate, build impact maps, generate patches, and verify test suites. 
          However, <strong>no code is auto-applied to production without explicit human operator approval</strong>.
        </p>
      </div>

      {/* Decision Card */}
      <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-xl shadow-lg space-y-6">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-[#3fb950] shrink-0" />
          <div>
            <h3 className="text-lg font-bold font-mono text-[#f0f6fc]">Remediation Review Summary</h3>
            <ul className="text-xs font-mono text-[#c9d1d9] space-y-1.5 mt-2">
              <li>&bull; Target breaking change: <span className="text-[#d29922]">customer.email &rarr; customer.email_address</span></li>
              <li>&bull; Affected files patched: <span className="text-[#58a6ff]">3 files</span></li>
              <li>&bull; Verification test run: <span className="text-[#3fb950]">4/4 Pytest suites PASSED</span></li>
              <li>&bull; Backward compatibility: <span className="text-[#3fb950]">Retained legacy email fallback</span></li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-[#30363d]">
          <button
            onClick={handleApprove}
            disabled={acting}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {acting ? 'Applying...' : 'Approve & Apply to Local Disk'}
          </button>

          <button
            onClick={handleApprovePR}
            disabled={acting}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#1f2d42] hover:bg-[#2b3d59] text-[#58a6ff] border border-[#30363d] shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Github className="w-4 h-4" />
            {acting ? 'Creating PR...' : 'Approve & Create GitHub PR'}
          </button>

          <button
            onClick={handleReject}
            disabled={acting}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg font-mono text-xs font-bold bg-[#3c1e1e] hover:bg-[#522222] text-[#f85149] border border-[#7d2727] shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {acting ? 'Rejecting...' : 'Reject & Discard Patch'}
          </button>
        </div>
      </div>
    </div>
  );
}
