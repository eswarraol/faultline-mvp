import React from 'react';
import { AlertOctagon, ArrowRight, Play, FileJson } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';

export default function ApiChangeDetected({ simulationData, onActivateAgent, loading }) {
  const contract = simulationData?.contract_diff || {};
  const breaking = contract.breaking_change || "Field 'customer.email' renamed to 'customer.email_address'";
  const oldContract = contract.old_contract || "customer.email";
  const newContract = contract.new_contract || "customer.email_address";

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-[#3c1e1e] border border-[#7d2727] p-6 rounded-xl shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#522222] rounded-lg text-[#f85149] border border-[#7d2727] shrink-0">
            <AlertOctagon className="w-8 h-8 animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#f85149]">API CHANGE DETECTED</span>
              <SeverityBadge level={contract.severity || 'HIGH'} />
            </div>
            <h2 className="text-xl font-bold text-[#f0f6fc] font-mono">{breaking}</h2>
            <p className="text-xs text-[#c9d1d9] font-mono">
              Upstream service updated schema definition from <code className="text-[#d29922]">api/v1.json</code> to <code className="text-[#3fb950]">api/v2.json</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Old vs New Contract Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* v1 Schema */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
            <span className="text-[#8b949e] font-semibold flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-[#d29922]" /> api/v1.json (Old Contract)
            </span>
            <span className="text-[#f85149] bg-[#3c1e1e] px-2 py-0.5 rounded text-[10px]">DEPRECATED</span>
          </div>
          <pre className="p-4 bg-[#0d1117] text-[#c9d1d9] leading-relaxed overflow-x-auto">
{`{
  "version": "1.0",
  "endpoint": "/api/v1/customer",
  "fields": {
`}
<span className="bg-[#3c1e1e] text-[#f85149] px-1 py-0.5 rounded font-bold">{`    "${contract.old_field || 'user_id'}": {
      "type": "string",
      "required": true
    }`}</span>
{`
  }
}`}
          </pre>
        </div>

        {/* v2 Schema */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
            <span className="text-[#8b949e] font-semibold flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-[#3fb950]" /> api/v2.json (New Contract)
            </span>
            <span className="text-[#3fb950] bg-[#113216] px-2 py-0.5 rounded text-[10px]">TARGET</span>
          </div>
          <pre className="p-4 bg-[#0d1117] text-[#c9d1d9] leading-relaxed overflow-x-auto">
{`{
  "version": "2.0",
  "endpoint": "/api/v2/customer",
  "fields": {
`}
<span className="bg-[#113216] text-[#3fb950] px-1 py-0.5 rounded font-bold">{`    "${contract.new_field || 'account_id'}": {
      "type": "string",
      "required": true
    }`}</span>
{`
  }
}`}
          </pre>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={onActivateAgent}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-semibold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          {loading ? 'Activating Agent...' : 'Activate Faultline Agent Investigation'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
