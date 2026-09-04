import React, { useEffect, useRef } from 'react';
import { Terminal, Cpu, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LiveLog({ logs = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg flex flex-col h-[520px]">
      {/* Terminal Header */}
      <div className="bg-[#0d1117] px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
            <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
            <div className="w-3 h-3 rounded-full bg-[#3fb950]"></div>
          </div>
          <Terminal className="w-4 h-4 text-[#58a6ff]" />
          <span className="font-mono text-xs font-semibold text-[#f0f6fc]">
            Faultline Agent Activity Stream (WebSocket Telemetry)
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#1f2d42] text-[#58a6ff] border border-[#30363d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-ping"></span>
          LIVE TELEMETRY STREAM
        </span>
      </div>

      {/* Terminal Body */}
      <div ref={scrollRef} className="p-4 overflow-y-auto font-mono text-xs space-y-3 flex-1 bg-[#0d1117]">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#8b949e] space-y-2">
            <Cpu className="w-8 h-8 text-[#30363d] animate-pulse" />
            <p className="text-xs">Awaiting agent activation telemetry events...</p>
          </div>
        ) : (
          logs.map((log, idx) => {
            const time = log.timestamp || '00:00:00';
            const logType = log.type || 'SYSTEM';

            if (logType === 'THOUGHT') {
              return (
                <div key={idx} className="bg-[#1f2d42] border-l-2 border-[#58a6ff] p-2.5 rounded-r text-[#c9d1d9]">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-[#58a6ff] mb-1">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>[{time}] AGENT REASONING THOUGHT</span>
                  </div>
                  <p className="pl-5 text-[#f0f6fc] leading-relaxed whitespace-pre-wrap">{log.content}</p>
                </div>
              );
            }

            if (logType === 'TOOL_CALL') {
              return (
                <div key={idx} className="bg-[#342b10] border-l-2 border-[#d29922] p-2.5 rounded-r text-[#d29922]">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-[#d29922] mb-1">
                    <Search className="w-3.5 h-3.5 shrink-0" />
                    <span>[{time}] REAL TOOL EXECUTION</span>
                  </div>
                  <p className="pl-5 font-mono text-[#d29922]">{log.content}</p>
                </div>
              );
            }

            if (logType === 'TOOL_RESULT') {
              return (
                <div key={idx} className="bg-[#161b22] border-l-2 border-[#30363d] p-2.5 rounded-r text-[#c9d1d9]">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8b949e] mb-1">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>[{time}] TOOL RESPONSE DISCOVERY</span>
                  </div>
                  <p className="pl-5 text-[#c9d1d9] font-mono">{log.content}</p>
                  {log.meta && log.meta.matches && (
                    <div className="mt-2 pl-5 space-y-1">
                      {log.meta.matches.map((m, i) => (
                        <div key={i} className="text-[11px] bg-[#0d1117] p-1.5 rounded text-[#58a6ff] font-mono">
                          {m.file}:{m.line} &rarr; <span className="text-[#c9d1d9]">{m.snippet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={idx} className="flex items-start gap-2 text-[#8b949e] py-1">
                <span className="text-[#484f58] font-mono text-[10px] shrink-0 mt-0.5">[{time}]</span>
                <span className="text-[#3fb950] font-semibold shrink-0">&gt;</span>
                <span className="text-[#c9d1d9]">{log.content}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
