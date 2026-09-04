import React from 'react';
import LiveLog from '../components/LiveLog';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function AgentActivity({ logs, completed, onProceed }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-slate-100">Live Agent Reasoning & Tool Calls</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Watching Featherless AI (<code className="text-cyan-400 font-mono">Qwen/Qwen2.5-Coder-32B-Instruct</code>) inspect repository using real code tools.
          </p>
        </div>

        {completed && (
          <button
            onClick={onProceed}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50 transition-all cursor-pointer animate-pulse"
          >
            <span>Proceed to Impact Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <LiveLog logs={logs} />

      {completed && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Autonomous agent completed codebase exploration and tool execution.</span>
          </div>
          <button
            onClick={onProceed}
            className="px-4 py-1.5 rounded font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all cursor-pointer"
          >
            View Impact Analysis &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
