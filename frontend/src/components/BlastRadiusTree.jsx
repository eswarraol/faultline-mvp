import React, { useState } from 'react';
import { GitCommit, FileText, Code2, ShieldAlert, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function BlastRadiusTree({ blastData }) {
  const [showEvidence, setShowEvidence] = useState(true);

  const oldContract = blastData?.old_contract || "customer.email";
  const newContract = blastData?.new_contract || "customer.email_address";
  const totalFiles = blastData?.total_files ?? 3;
  const totalFunctions = blastData?.total_functions ?? 2;
  const totalTests = blastData?.total_test_suites ?? 1;
  const evidenceList = blastData?.evidence || [
    { file: "src/customer.py", line: 17, snippet: '"customer_id": payload["user_id"]', target: "user_id" },
    { file: "src/payment.py", line: 12, snippet: 'user_id = parsed["customer_id"]', target: "user_id" },
    { file: "tests/test_customer.py", line: 9, snippet: 'payload = {"user_id": "cust_101"}', target: "user_id" }
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg space-y-4">
      {/* Header */}
      <div className="bg-[#0d1117] px-5 py-3.5 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs text-[#58a6ff] font-semibold">
          <GitCommit className="w-4 h-4" />
          <span>BLAST RADIUS & IMPACT SURFACE</span>
        </div>
        <SeverityBadge level={blastData?.severity || 'HIGH'} />
      </div>

      {/* Metrics Bar */}
      <div className="px-5 grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-[#0d1117] p-3 rounded border border-[#21262d]">
          <span className="text-[#8b949e] block text-[10px]">AFFECTED FILES</span>
          <span className="text-[#f0f6fc] text-base font-bold">{totalFiles} files</span>
        </div>
        <div className="bg-[#0d1117] p-3 rounded border border-[#21262d]">
          <span className="text-[#8b949e] block text-[10px]">AFFECTED FUNCTIONS</span>
          <span className="text-[#58a6ff] text-base font-bold">{totalFunctions} functions</span>
        </div>
        <div className="bg-[#0d1117] p-3 rounded border border-[#21262d]">
          <span className="text-[#8b949e] block text-[10px]">TEST SUITES</span>
          <span className="text-[#3fb950] text-base font-bold">{totalTests} test suites</span>
        </div>
      </div>

      {/* Interactive Tree View */}
      <div className="px-5 pb-5 font-mono text-xs space-y-2">
        <div className="bg-[#0d1117] p-3 rounded border border-[#21262d] flex items-center gap-2">
          <span className="text-[#8b949e]">API Contract:</span>
          <span className="text-[#f85149] font-bold line-through">{oldContract}</span>
          <span className="text-[#8b949e]">&rarr;</span>
          <span className="text-[#3fb950] font-bold">{newContract}</span>
        </div>

        {/* Evidence Toggle Button */}
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="flex items-center gap-2 text-[#58a6ff] hover:underline pt-2 font-semibold cursor-pointer"
        >
          {showEvidence ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>{showEvidence ? 'Hide Source Code Line Evidence' : 'Show Source Code Line Evidence'}</span>
          <Eye className="w-3.5 h-3.5" />
        </button>

        {showEvidence && (
          <div className="space-y-2 pt-1">
            {evidenceList.map((item, idx) => (
              <div key={idx} className="bg-[#0d1117] p-3 rounded border border-[#30363d] space-y-1">
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span className="text-[#58a6ff] font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> {item.file}:{item.line}
                  </span>
                  <span className="text-[10px] bg-[#21262d] px-2 py-0.5 rounded text-[#c9d1d9]">
                    Match: <code className="text-[#f85149]">{item.target}</code>
                  </span>
                </div>
                <div className="p-2 bg-[#161b22] rounded border border-[#21262d] text-[#c9d1d9] overflow-x-auto whitespace-pre">
                  {item.snippet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
