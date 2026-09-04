import React from 'react';
import { FileCode, Plus, Minus } from 'lucide-react';

export default function DiffViewer({ unifiedDiff, modifiedFiles }) {
  if (!unifiedDiff && !modifiedFiles) {
    return (
      <div className="p-8 text-center text-[#8b949e] font-mono text-sm bg-[#161b22] rounded-lg border border-[#30363d]">
        No patch diff available.
      </div>
    );
  }

  const lines = (unifiedDiff || '').split('\n');

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
        <div className="bg-[#0d1117] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#58a6ff] font-semibold text-sm">
            <FileCode className="w-4 h-4" />
            <span>Unified Git Diff Patch</span>
          </div>
          <span className="text-[11px] text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d]">
            Featherless Qwen2.5-Coder-32B
          </span>
        </div>

        <div className="p-4 overflow-x-auto bg-[#0d1117] leading-relaxed max-h-[480px]">
          {lines.map((line, idx) => {
            if (line.startsWith('---') || line.startsWith('+++')) {
              return (
                <div key={idx} className="text-[#8b949e] font-bold py-1 border-b border-[#21262d]">
                  {line}
                </div>
              );
            }
            if (line.startsWith('@@')) {
              return (
                <div key={idx} className="text-[#58a6ff] py-1 bg-[#1f2d42] text-[11px] font-semibold my-1 px-2 rounded">
                  {line}
                </div>
              );
            }
            if (line.startsWith('+')) {
              return (
                <div key={idx} className="bg-[#113216] text-[#3fb950] px-2 py-0.5 flex items-center gap-2 border-l-2 border-[#238636]">
                  <Plus className="w-3 h-3 text-[#3fb950] shrink-0" />
                  <span className="whitespace-pre">{line.substring(1)}</span>
                </div>
              );
            }
            if (line.startsWith('-')) {
              return (
                <div key={idx} className="bg-[#3c1e1e] text-[#f85149] px-2 py-0.5 flex items-center gap-2 border-l-2 border-[#7d2727]">
                  <Minus className="w-3 h-3 text-[#f85149] shrink-0" />
                  <span className="whitespace-pre">{line.substring(1)}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="text-[#8b949e] px-2 py-0.5 whitespace-pre border-l-2 border-transparent">
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
