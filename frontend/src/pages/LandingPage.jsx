import React from 'react';
import { Zap, Play, Github, ArrowRight, ShieldCheck, GitPullRequest, Search, CheckCircle2, Cpu } from 'lucide-react';

export default function LandingPage({ onTryDemo, onConnectGitHub }) {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="text-center space-y-4 py-8 border-b border-[#30363d]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#1f2d42] text-[#58a6ff] border border-[#30363d]">
          <Zap className="w-3.5 h-3.5 text-[#d29922] fill-current" />
          <span>AUTONOMOUS API-CHANGE REMEDIATION</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-[#f0f6fc] tracking-tight leading-tight">
          Faultline
        </h1>
        <p className="text-xl font-mono text-[#58a6ff] font-semibold">
          The AI that fixes the code your API changes break.
        </p>
        <p className="text-sm text-[#8b949e] font-mono max-w-2xl mx-auto leading-relaxed">
          Detect breaking API changes. Trace their exact codebase blast radius. Generate & verify backward-compatible patches with real tests. Human approval before applying.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={onTryDemo}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-mono text-sm font-bold bg-[#238636] hover:bg-[#2ea043] text-white shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Try Demo (1-Click Launch)</span>
          </button>

          <button
            onClick={onConnectGitHub}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-mono text-sm font-bold bg-[#21262d] hover:bg-[#30363d] text-[#f0f6fc] border border-[#30363d] shadow-lg transition-all cursor-pointer"
          >
            <Github className="w-4 h-4 text-[#58a6ff]" />
            <span>Connect GitHub</span>
          </button>
        </div>
      </div>

      {/* Closed Loop Workflow Diagram */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-[#8b949e] uppercase tracking-wider text-center">
          Closed-Loop Autonomous Remediation Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs text-center">
          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded bg-[#3c1e1e] text-[#f85149] flex items-center justify-center mx-auto font-bold">1</div>
            <h3 className="font-bold text-[#f0f6fc]">Detect</h3>
            <p className="text-[11px] text-[#8b949e]">Deterministic contract diffing (v1 vs v2)</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded bg-[#1f2d42] text-[#58a6ff] flex items-center justify-center mx-auto font-bold">2</div>
            <h3 className="font-bold text-[#f0f6fc]">Trace</h3>
            <p className="text-[11px] text-[#8b949e]">AST search & blast radius evidence</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded bg-[#342b10] text-[#d29922] flex items-center justify-center mx-auto font-bold">3</div>
            <h3 className="font-bold text-[#f0f6fc]">Fix & Verify</h3>
            <p className="text-[11px] text-[#8b949e]">Featherless AI patch & Pytest runner</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded bg-[#342b10] text-[#d29922] flex items-center justify-center mx-auto font-bold">4</div>
            <h3 className="font-bold text-[#f0f6fc]">Self-Repair</h3>
            <p className="text-[11px] text-[#8b949e]">Bounded retry loop on test failures</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded bg-[#113216] text-[#3fb950] flex items-center justify-center mx-auto font-bold">5</div>
            <h3 className="font-bold text-[#f0f6fc]">Approve & PR</h3>
            <p className="text-[11px] text-[#8b949e]">Human review & GitHub PR creation</p>
          </div>
        </div>
      </div>

      {/* Differentiator Callout */}
      <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl space-y-3 font-mono text-xs">
        <h3 className="text-sm font-bold text-[#f0f6fc] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
          Autonomous API-Change Remediation Engine
        </h3>
        <p className="text-[#8b949e] leading-relaxed">
          When an API changes, Faultline doesn't just report the breakage. It investigates the codebase, traces the blast radius, generates a targeted fix, verifies it with real tests, and retries when the fix fails &mdash; keeping a human in control before anything is applied.
        </p>
      </div>
    </div>
  );
}
