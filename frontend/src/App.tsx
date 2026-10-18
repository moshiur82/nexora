import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Multichain } from './pages/Multichain';
import { AiIntelligence } from './pages/AiIntelligence';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-nexora-dark flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/features"
            element={
              <>
                <Navbar />
                <Features />
              </>
            }
          />
          <Route
            path="/pricing"
            element={
              <>
                <Navbar />
                <Pricing />
              </>
            }
          />
          <Route
            path="/multichain"
            element={
              <>
                <Navbar />
                <Multichain />
              </>
            }
          />
          <Route
            path="/ai"
            element={
              <>
                <Navbar />
                <AiIntelligence />
              </>
            }
          />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;