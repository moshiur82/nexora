import React from 'react';
import { Shield, Zap, Lock, Cpu } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexora-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Platform Features</h1>
        <p className="text-gray-400 mb-8">
          Explore the powerful tools and capabilities built into NEXORA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">AI Security Scanner</h3>
            <p className="text-gray-400 text-sm">
              Real-time smart contract and transaction risk analysis to protect
              your assets from malicious drainers.
            </p>
          </div>
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Zap className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Multichain Engine</h3>
            <p className="text-gray-400 text-sm">
              Seamlessly manage assets across Ethereum (EVM), Solana, and
              Bitcoin networks from a single dashboard.
            </p>
          </div>
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Lock className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Encrypted Vault</h3>
            <p className="text-gray-400 text-sm">
              Military-grade key derivation and client-side encryption ensuring
              absolute ownership of your keys.
            </p>
          </div>
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Cpu className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Browser Extension</h3>
            <p className="text-gray-400 text-sm">
              Web3 extension with content script injection to safeguard
              transactions directly in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;