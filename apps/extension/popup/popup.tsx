import React from 'react';
import ReactDOM from 'react-dom/client';
import { Shield, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const ExtensionPopup: React.FC = () => {
  return (
    <div className="p-4 flex flex-col justify-between h-full bg-[#0B0F19] text-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[1.5]" />
            </div>
            <span className="font-bold tracking-wider">NEXORA</span>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">Extension</span>
        </div>

        {/* Wallet Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#111827] border border-gray-800">
          <p className="text-xs text-gray-400">Connected Wallet</p>
          <p className="font-mono text-xs text-blue-400 truncate mt-1">0x71C...3B92</p>
          <h2 className="text-2xl font-extrabold mt-3">0.00 <span className="text-xs font-normal text-gray-400">ETH</span></h2>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-500 text-xs py-2.5 rounded-xl font-medium transition-all">
            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Receive</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-1 bg-[#111827] border border-gray-800 hover:border-gray-700 text-xs py-2.5 rounded-xl font-medium transition-all">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Send</span>
          </button>
        </div>
      </div>

      <div className="text-center pb-2 text-[10px] text-gray-500">
        NEXORA Web3 Security Active
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExtensionPopup />
  </React.StrictMode>
);