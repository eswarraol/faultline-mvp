import React from 'react';
import BlastRadiusTree from '../components/BlastRadiusTree';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export default function ImpactAnalysis({ workflowState, onProceed }) {
  const blastData = workflowState?.blast_radius || workflowState?.impact || {};
  const summary = workflowState?.impact?.summary || "Calculated blast radius impact surface and source line evidence using AST code search.";

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff] font-semibold mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>STAGE 2: BLAST RADIUS & IMPACT ANALYSIS</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-[#f0f6fc]">Calculated Blast Radius Impact Surface</h2>
        <p className="text-xs text-[#c9d1d9] mt-2 leading-relaxed bg-[#0d1117] p-4 rounded border border-[#30363d] font-mono">
          {summary}
        </p>
      </div>

      {/* Interactive Blast Radius Tree */}
      <BlastRadiusTree blastData={blastData} />

      {/* Action Footer */}
      <div className="flex justify-end">
        <button
          onClick={onProceed}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg transition-all cursor-pointer"
        >
          <span>Inspect Generated Patch & Confidence Score</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
