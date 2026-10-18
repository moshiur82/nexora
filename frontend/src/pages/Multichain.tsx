import React from 'react';
import { Layers, Globe } from 'lucide-react';

export const Multichain: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexora-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Multichain Ecosystem</h1>
        <p className="text-gray-400 mb-8">
          Unified asset management across EVM, Solana, and Bitcoin networks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Globe className="w-8 h-8 text-indigo-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Ethereum (EVM)</h3>
            <p className="text-gray-400 text-sm">
              Full support for Sepolia and mainnet transactions, smart
              contracts, and ERC token standards.
            </p>
          </div>
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Layers className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Solana</h3>
            <p className="text-gray-400 text-sm">
              High-speed Devnet integration with real-time balance fetching and
              lightning-fast execution.
            </p>
          </div>
          <div className="bg-nexora-card border border-nexora-border p-6 rounded-2xl">
            <Layers className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Bitcoin</h3>
            <p className="text-gray-400 text-sm">
              Testnet address derivation and blockchain explorer balance checks
              via Blockstream API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multichain;