import React from 'react';
import { Cpu, Activity } from 'lucide-react';

export const AiIntelligence: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexora-dark text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">AI Intelligence & Analytics</h1>
        <p className="text-gray-400 mb-8">
          Advanced neural models scanning for threats and transaction risks in
          real time.
        </p>

        <div className="bg-nexora-card border border-nexora-border p-8 rounded-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">NEXORA Neural Threat Engine</h3>
              <p className="text-sm text-gray-400">
                Persistent backend threat logging and automated risk scoring
                active.
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            The AI engine evaluates recipient addresses, gas spikes, and
            historical phishing heuristics before every transaction broadcast,
            ensuring maximum protection for your decentralized portfolio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiIntelligence;