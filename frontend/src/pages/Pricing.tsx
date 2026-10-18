import React from 'react';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexora-dark text-white p-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Transparent Pricing Plans</h1>
        <p className="text-gray-400">
          Choose the ideal security tier for your Web3 portfolio.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-nexora-card border border-nexora-border p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-2">Free Tier</h3>
          <p className="text-gray-400 text-sm mb-6">
            Essential tools for individual crypto users.
          </p>
          <div className="text-3xl font-extrabold mb-6">
            $0{' '}
            <span className="text-sm font-normal text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-300 mb-8">
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Basic
              Multichain Wallets
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Standard AI Risk
              Scans
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-emerald-400 mr-2" /> Community
              Support
            </li>
          </ul>
          <button className="w-full py-3 bg-nexora-border rounded-xl font-semibold hover:bg-gray-700 transition">
            Current Plan
          </button>
        </div>

        <div className="bg-gradient-to-b from-purple-900/20 to-nexora-card border border-purple-500/30 p-8 rounded-3xl relative">
          <span className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            Popular
          </span>
          <h3 className="text-xl font-bold mb-2">Pro SaaS Tier</h3>
          <p className="text-gray-400 text-sm mb-6">
            Advanced protection and automated analytics.
          </p>
          <div className="text-3xl font-extrabold mb-6">
            $29{' '}
            <span className="text-sm font-normal text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-300 mb-8">
            <li className="flex items-center">
              <Check className="w-4 h-4 text-purple-400 mr-2" /> Unlimited
              Multichain Assets
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-purple-400 mr-2" /> Real-time AI
              Threat Intelligence
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-purple-400 mr-2" /> Browser Extension
              Protection
            </li>
            <li className="flex items-center">
              <Check className="w-4 h-4 text-purple-400 mr-2" /> Priority 24/7
              Support
            </li>
          </ul>
          <button className="w-full py-3 bg-purple-600 rounded-xl font-semibold hover:bg-purple-500 transition">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;