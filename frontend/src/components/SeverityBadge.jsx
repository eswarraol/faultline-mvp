import React from 'react';

export default function SeverityBadge({ level }) {
  const norm = (level || 'LOW').toUpperCase();

  if (norm === 'HIGH' || norm === 'CRITICAL') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#3c1e1e] text-[#f85149] border border-[#7d2727]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f85149]"></span>
        HIGH SEVERITY
      </span>
    );
  }

  if (norm === 'MEDIUM' || norm === 'WARN') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#342b10] text-[#d29922] border border-[#6e5414]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#d29922]"></span>
        MEDIUM SEVERITY
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#161b22] text-[#8b949e] border border-[#30363d]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8b949e]"></span>
      LOW SEVERITY
    </span>
  );
}
