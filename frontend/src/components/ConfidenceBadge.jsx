import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ConfidenceBadge({ confidence }) {
  const level = confidence?.level || 'HIGH';
  const score = confidence?.score_pct || 95;

  if (level === 'HIGH') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#113216] text-[#3fb950] border border-[#238636] font-mono text-xs font-semibold">
        <ShieldCheck className="w-4 h-4" />
        <span>CONFIDENCE: HIGH ({score}%)</span>
      </div>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#342b10] text-[#d29922] border border-[#6e5414] font-mono text-xs font-semibold">
        <AlertTriangle className="w-4 h-4" />
        <span>CONFIDENCE: MEDIUM ({score}%)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#3c1e1e] text-[#f85149] border border-[#7d2727] font-mono text-xs font-semibold">
      <AlertTriangle className="w-4 h-4" />
      <span>CONFIDENCE: LOW ({score}%)</span>
    </div>
  );
}
