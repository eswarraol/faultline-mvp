import React, { useState } from 'react';
import { Github, X, Check, Link, Key, ArrowRight } from 'lucide-react';

export default function GitHubConnectModal({ isOpen, onClose, onConnect }) {
  const [repoInput, setRepoInput] = useState('faultline-ai/payment-service');
  const [tokenInput, setTokenInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Sanitize input URL or owner/repo format
    let formattedRepo = repoInput.trim();
    if (formattedRepo.includes('github.com/')) {
      formattedRepo = formattedRepo.split('github.com/')[1].replace(/\.git$/, '');
    }

    await onConnect(formattedRepo, tokenInput);
    setSubmitting(false);
    onClose();
  };

  const presets = [
    'faultline-ai/payment-service',
    'acme-corp/customer-billing',
    'stripe-samples/accept-a-payment'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
          <div className="flex items-center gap-2 text-[#58a6ff] font-bold text-sm">
            <Github className="w-5 h-5" />
            <span>Connect GitHub Repository</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#f0f6fc] p-1 rounded hover:bg-[#21262d] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#c9d1d9] flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-[#58a6ff]" /> GitHub Repository URL or Owner/Repo
            </label>
            <input
              type="text"
              required
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. owner/repository or https://github.com/owner/repo"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2.5 text-xs text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#8b949e]">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRepoInput(p)}
                  className={`text-[10px] px-2.5 py-1 rounded border cursor-pointer transition-all ${
                    repoInput === p
                      ? 'bg-[#1f2d42] border-[#58a6ff] text-[#58a6ff] font-bold'
                      : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Token Field */}
          <div className="space-y-1.5 pt-2 border-t border-[#21262d]">
            <label className="text-xs font-semibold text-[#8b949e] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#d29922]" /> GitHub Personal Access Token (Optional)
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_... (Optional for private repos / live PR sync)"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2.5 text-xs text-[#f0f6fc] focus:border-[#58a6ff] focus:outline-none"
            />
            <p className="text-[10px] text-[#8b949e]">
              If left blank, Faultline runs in high-fidelity simulated GitHub PR provider mode for live judge presentation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-[#8b949e] hover:text-[#f0f6fc] bg-[#21262d] hover:bg-[#30363d] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded text-xs font-bold text-white bg-[#238636] hover:bg-[#2ea043] shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Connecting...' : 'Connect Repository'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
