import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Globe, ArrowRight, Zap, Lock, Activity } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexora-dark text-gray-100 flex flex-col justify-between">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>AI • WEB3 • FINANCE ECOSYSTEM</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6">
          Your Assets. Your Keys. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Your Future.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          An AI-powered multichain financial platform built for the next generation of Web3. Self-custody with supreme intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center">
          <Link to="/app" className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-xl shadow-blue-600/20 text-base">
            <span>Open Dashboard</span>
            <ArrowRight className="w-5 h-5 stroke-[1.5]" />
          </Link>
          <Link to="/features" className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-nexora-card border border-nexora-border hover:border-gray-600 text-white font-medium px-8 py-4 rounded-xl transition-all text-base">
            <span>Explore Features</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          <div className="p-8 rounded-2xl bg-nexora-card border border-nexora-border text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <Lock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Self-Custody</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Complete ownership of your private keys and recovery phrases with military-grade client-side encryption.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nexora-card border border-nexora-border text-left">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
              <Cpu className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Intelligence</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced risk analysis, automated scam detection, and predictive portfolio insights directly in your workspace.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nexora-card border border-nexora-border text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
              <Globe className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multichain</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Seamless native support across EVM networks, Bitcoin, and Solana with optimized cross-chain capabilities.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-nexora-border py-8 text-center text-sm text-gray-500">
        <p>&copy; 2026 NEXORA. All rights reserved. Built for the decentralized future.</p>
      </footer>
    </div>
  );
};