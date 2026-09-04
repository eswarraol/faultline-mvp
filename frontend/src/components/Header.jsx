import React from 'react';
import { Zap, RefreshCw, GitBranch, Github, Play } from 'lucide-react';

export default function Header({ currentMode, activeRepo, onOpenGitHubModal, onReset, onTryDemo, currentStep }) {
  return (
    <header className="bg-[#161b22] border-b border-[#30363d] px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-[#1f2d42] border border-[#30363d] text-[#58a6ff] font-mono font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#d29922] fill-current" />
          <span>FAULTLINE</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-[#f0f6fc] uppercase">
              Autonomous API Remediation Console
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1f2d42] text-[#58a6ff] border border-[#30363d]">
              v2.0 Production Build
            </span>
          </div>
          <p className="text-[11px] text-[#8b949e] font-mono">
            The AI that fixes the code your API changes break.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onTryDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-[#238636] hover:bg-[#2ea043] text-white transition-all cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Try Demo
        </button>

        <button
          onClick={onOpenGitHubModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition-all cursor-pointer"
        >
          <Github className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>{currentMode === 'github' ? `GitHub: ${activeRepo}` : 'Connect GitHub Repo'}</span>
        </button>

        {currentStep > 0 && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#8b949e] hover:text-[#f0f6fc] bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset State
          </button>
        )}
      </div>
    </header>
  );
}
