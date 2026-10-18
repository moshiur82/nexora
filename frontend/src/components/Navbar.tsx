import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-nexora-border bg-nexora-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          
          <span className="text-2xl font-bold tracking-wider text-white">NEXORA</span>
        </div>
        
        <nav className="flex space-x-6 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/features" className="hover:text-white transition">Features</Link>
          <Link to="/multichain" className="hover:text-white transition">Multichain</Link>
          <Link to="/ai-intelligence" className="hover:text-white transition">AI Intelligence</Link>
          <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2">
            Sign In
          </Link>
          <Link to="/app" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30">
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
};