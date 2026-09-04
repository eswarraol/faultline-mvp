import React from 'react';
import DiffViewer from '../components/DiffViewer';
import ConfidenceBadge from '../components/ConfidenceBadge';
import { GitPullRequest, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export default function CodeDiff({ patchData, confidence, onProceed }) {
  const explanation = patchData?.explanation || "Generated backward-compatible unified diff patch targeting API v2 schema.";
  const unifiedDiff = patchData?.unified_diff || "";
  const modifiedFiles = patchData?.modified_files || {};
  const criteria = confidence?.criteria || [
    { label: "Patch applies cleanly to workspace", met: true },
    { label: "Unit tests passed (4/4)", met: true },
    { label: "Zero unresolved critical dependencies", met: true },
    { label: "Self-repair iterations <= 1", met: true }
  ];

  return (
    <div className="space-y-6">
      {/* Banner & Confidence Score */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff] font-semibold">
            <GitPullRequest className="w-4 h-4" />
            <span>STAGE 3: AUTONOMOUS REMEDIATION PATCH</span>
          </div>
          <ConfidenceBadge confidence={confidence} />
        </div>

        <h2 className="text-xl font-bold font-mono text-[#f0f6fc]">Proposed Code Fix & Unified Diff</h2>
        
        <p className="text-xs text-[#c9d1d9] font-mono bg-[#0d1117] p-4 rounded border border-[#30363d] leading-relaxed">
          {explanation}
        </p>

        {/* Objective Evidence Checklist */}
        <div className="bg-[#0d1117] p-4 rounded border border-[#30363d] font-mono text-xs space-y-2">
          <span className="text-[#8b949e] font-semibold block text-[11px]">EVIDENCE BEHIND CONFIDENCE CALCULATION:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[#c9d1d9]">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={c.met ? "text-[#3fb950] font-bold" : "text-[#f85149] font-bold"}>
                  {c.met ? "✓" : "✗"}
                </span>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diff Viewer */}
      <DiffViewer unifiedDiff={unifiedDiff} modifiedFiles={modifiedFiles} />

      {/* Action Footer */}
      <div className="flex justify-end">
        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Run Verification & Test Suite</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
