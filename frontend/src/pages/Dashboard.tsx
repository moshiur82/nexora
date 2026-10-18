import React, { useState, useEffect } from 'react';
import {
  Shield,
  PlusCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Key,
  AlertTriangle,
} from 'lucide-react';

import {
  analyzeTransactionRisk,
  fetchAIRiskLogsFromBackend,
  type RiskAnalysisResult,
  type AIRiskLog,
} from '../services/aiService';
import {
  createNewWallet,
  importWalletFromKey,
  fetchWalletBalance,
  sendTransaction,
  type WalletAccount,
} from '../services/walletService';
import {
  deriveMultichainAddresses,
  getSolanaBalance,
  getBitcoinBalance,
} from '../services/multichainService';

export const Dashboard: React.FC = () => {
  const [wallet, setWallet] = useState<WalletAccount | null>(null);
  const [importKey, setImportKey] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);

  // EVM
  const [balance, setBalance] = useState<string>('0.0000');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Multichain
  const [solanaAddress, setSolanaAddress] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [solBalance, setSolBalance] = useState<number>(0);
  const [btcBalance, setBtcBalance] = useState<number>(0);

  // Send Modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);

  // AI Risk (live scan)
  const [aiCheck, setAiCheck] = useState<RiskAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Risk History
  const [riskLogs, setRiskLogs] = useState<AIRiskLog[]>([]);

  const loadRiskLogs = async () => {
    const logs = await fetchAIRiskLogsFromBackend();
    setRiskLogs(logs);
  };

  useEffect(() => {
    loadRiskLogs();
  }, []);

  const loadEthBalance = async (addr: string) => {
    try {
      const bal = await fetchWalletBalance(addr);
      setBalance(bal);
    } catch {
      setBalance('0.0000');
    }
  };

  const deriveOtherChains = async (mnemonic: string) => {
    if (!mnemonic) {
      setSolanaAddress('');
      setBtcAddress('');
      setSolBalance(0);
      setBtcBalance(0);
      return;
    }

    try {
      const { solanaAddress: sol, btcAddress: btc } =
        await deriveMultichainAddresses(mnemonic);

      setSolanaAddress(sol);
      setBtcAddress(btc);

      const [solBal, btcBal] = await Promise.all([
        getSolanaBalance(sol),
        getBitcoinBalance(btc),
      ]);

      setSolBalance(solBal);
      setBtcBalance(btcBal);
    } catch (error) {
      console.error('Multichain derive/balance failed:', error);
    }
  };

  const refreshAllBalances = async () => {
    if (!wallet) return;
    setIsRefreshing(true);
    try {
      await loadEthBalance(wallet.address);
      if (solanaAddress) {
        setSolBalance(await getSolanaBalance(solanaAddress));
      }
      if (btcAddress) {
        setBtcBalance(await getBitcoinBalance(btcAddress));
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!solanaAddress && !btcAddress) return;

    let cancelled = false;

    const load = async () => {
      if (solanaAddress) {
        const sol = await getSolanaBalance(solanaAddress);
        if (!cancelled) setSolBalance(sol);
      }
      if (btcAddress) {
        const btc = await getBitcoinBalance(btcAddress);
        if (!cancelled) setBtcBalance(btc);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [solanaAddress, btcAddress]);

  const handleAiScan = async () => {
    if (!recipient || recipient.length < 10 || !wallet) {
      setAiCheck(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeTransactionRisk(
        wallet.address,
        recipient,
        sendAmount || '0'
      );
      setAiCheck(result);
      await loadRiskLogs();
    } catch {
      setAiCheck(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateWallet = async () => {
    const newWallet = await createNewWallet();
    setWallet(newWallet);
    setShowMnemonic(true);
    await loadEthBalance(newWallet.address);
    await deriveOtherChains(newWallet.mnemonic);
  };

  const handleImportWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const imported = await importWalletFromKey(importKey);
    if (imported) {
      setWallet(imported);
      setImportKey('');
      await loadEthBalance(imported.address);
      await deriveOtherChains(imported.mnemonic);
    } else {
      alert('Invalid Private Key or Mnemonic phrase!');
    }
  };

  const handleSendCrypto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    if (aiCheck?.status === 'High Risk') {
      const ok = window.confirm(
        '⚠️ AI detected HIGH RISK. Are you sure you want to proceed?'
      );
      if (!ok) return;
    }

    setIsSending(true);
    setTxResult(null);

    const result = await sendTransaction(
      wallet.privateKey,
      recipient,
      sendAmount
    );

    setIsSending(false);

    if (result.success) {
      setTxResult(`Success! Hash: ${result.txHash}`);
      setRecipient('');
      setSendAmount('');
      setAiCheck(null);
      await loadEthBalance(wallet.address);
    } else {
      setTxResult(`Error: ${result.error}`);
    }
  };

  const closeSendModal = () => {
    setShowSendModal(false);
    setTxResult(null);
    setAiCheck(null);
    setRecipient('');
    setSendAmount('');
  };

  const hasHighRisk = riskLogs.some((l) => l.status === 'High Risk');

  return (
    <div className="min-h-screen bg-nexora-dark text-gray-100 flex flex-col">
      <header className="border-b border-nexora-border bg-nexora-card px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            NEXORA APP
          </span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
          Multichain Ready
        </span>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
        {!wallet ? (
          <div className="max-w-xl mx-auto bg-nexora-card border border-nexora-border rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400">
              <Wallet className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Setup Your Self-Custody Wallet
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              One recovery phrase → Ethereum, Solana & Bitcoin addresses.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleCreateWallet}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                <PlusCircle className="w-5 h-5 stroke-[1.5]" />
                <span>Create New Wallet</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-nexora-border" />
                <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase tracking-wider">
                  Or Import
                </span>
                <div className="flex-grow border-t border-nexora-border" />
              </div>

              <form onSubmit={handleImportWallet} className="space-y-3 text-left">
                <label className="text-xs font-medium text-gray-400">
                  Private Key or Recovery Phrase
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={importKey}
                    onChange={(e) => setImportKey(e.target.value)}
                    placeholder="Enter secret key..."
                    className="flex-grow bg-nexora-dark border border-nexora-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-nexora-dark border border-nexora-border hover:border-gray-500 text-white px-5 rounded-xl text-sm font-medium transition-all"
                  >
                    Import
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-gradient-to-r from-blue-900/40 via-nexora-card to-nexora-card border border-blue-500/30 rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">
                    ETH Balance (Sepolia)
                  </p>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-4xl font-extrabold text-white">
                      {balance}{' '}
                      <span className="text-sm font-normal text-gray-400">
                        ETH
                      </span>
                    </h1>
                    <button
                      onClick={refreshAllBalances}
                      disabled={isRefreshing}
                      className="p-2 rounded-lg bg-black/30 hover:bg-black/50 border border-nexora-border"
                      title="Refresh all balances"
                    >
                      <RefreshCw
                        className={`w-4 h-4 text-blue-400 ${
                          isRefreshing ? 'animate-spin' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
                    <ArrowDownLeft className="w-4 h-4 stroke-[1.5]" />
                    <span>Receive</span>
                  </button>
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="flex items-center space-x-2 bg-nexora-card border border-nexora-border hover:border-gray-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
                  >
                    <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {showMnemonic && wallet.mnemonic && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                  <p className="font-bold mb-1 flex items-center space-x-2">
                    <Key className="w-4 h-4 stroke-[1.5]" />
                    <span>Save Your Recovery Phrase!</span>
                  </p>
                  <p className="text-xs text-amber-200/80 font-mono bg-black/20 p-3 rounded-xl mt-2 select-all">
                    {wallet.mnemonic}
                  </p>
                  <button
                    onClick={() => setShowMnemonic(false)}
                    className="mt-3 text-xs bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg"
                  >
                    I have saved it safely
                  </button>
                </div>
              )}
            </div>

            {/* Multichain Address Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                <span className="text-xs font-bold text-blue-400">
                  EVM (Ethereum)
                </span>
                <p className="font-mono text-xs text-gray-300 truncate mt-1">
                  {wallet.address}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                <span className="text-xs font-bold text-purple-400">
                  Solana (SOL)
                </span>
                <p className="font-mono text-xs text-gray-300 truncate mt-1">
                  {solanaAddress || 'Deriving...'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                <span className="text-xs font-bold text-amber-400">
                  Bitcoin (BTC)
                </span>
                <p className="font-mono text-xs text-gray-300 truncate mt-1">
                  {btcAddress || 'Deriving...'}
                </p>
              </div>
            </div>

            {/* Asset List */}
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Multichain Assets
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      Ξ
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Ethereum</h4>
                      <p className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                        {wallet.address}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-white">{balance} ETH</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                      SOL
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Solana</h4>
                      <p className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                        {solanaAddress || '—'}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-white">
                    {solBalance.toFixed(4)} SOL
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-nexora-dark border border-nexora-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                      ₿
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Bitcoin</h4>
                      <p className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                        {btcAddress || '—'}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-white">
                    {btcBalance.toFixed(8)} BTC
                  </p>
                </div>
              </div>
            </div>

            {/* Threat Alert Banner */}
            {hasHighRisk && (
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">
                    High Risk activity detected
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    One or more recent scans flagged dangerous recipients.
                    Review the history below before sending funds.
                  </p>
                </div>
              </div>
            )}

            {/* AI Security History Table */}
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      AI Threat Intelligence History
                    </h3>
                    <p className="text-xs text-gray-400">
                      Risk evaluation logs from backend
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full font-medium">
                    {riskLogs.length} Scans
                  </span>
                  <button
                    onClick={loadRiskLogs}
                    className="p-2 rounded-lg bg-black/30 border border-nexora-border hover:bg-black/50"
                    title="Refresh logs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>

              {riskLogs.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  No AI scans logged yet. Use Send → enter address to scan.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-nexora-border text-xs text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 px-2">Time</th>
                        <th className="pb-3 px-2">Recipient</th>
                        <th className="pb-3 px-2">Score</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2">Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nexora-border/50 text-xs">
                      {riskLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-nexora-dark/50 transition-colors"
                        >
                          <td className="py-3.5 px-2 text-gray-400 font-mono whitespace-nowrap">
                            {new Date(log.checked_at).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-2 font-mono text-gray-300 truncate max-w-[140px]">
                            {log.recipient_address}
                          </td>
                          <td className="py-3.5 px-2 font-bold text-white">
                            {log.risk_score}
                          </td>
                          <td className="py-3.5 px-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                log.status === 'Safe'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : log.status === 'Suspicious'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-gray-400 truncate max-w-[250px]">
                            {log.warning_message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Send Modal (ETH only) */}
            {showSendModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-nexora-card border border-nexora-border rounded-3xl p-6 max-w-md w-full shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Send ETH</h3>
                    <button
                      onClick={closeSendModal}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSendCrypto} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Recipient (0x...)
                      </label>
                      <input
                        type="text"
                        required
                        value={recipient}
                        onChange={(e) => {
                          setRecipient(e.target.value);
                          setAiCheck(null);
                        }}
                        onBlur={handleAiScan}
                        className="w-full bg-nexora-dark border border-nexora-border rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Amount (ETH)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        onBlur={handleAiScan}
                        className="w-full bg-nexora-dark border border-nexora-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {isAnalyzing && (
                      <p className="text-xs text-blue-400 animate-pulse">
                        🔍 NEXORA AI scanning...
                      </p>
                    )}

                    {aiCheck && !isAnalyzing && (
                      <div
                        className={`p-3 rounded-xl border text-xs ${
                          aiCheck.status === 'High Risk'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : aiCheck.status === 'Suspicious'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        }`}
                      >
                        <p className="font-bold">
                          AI: {aiCheck.status} ({aiCheck.score}/100)
                        </p>
                        <p className="mt-1 opacity-90">
                          {aiCheck.warningMessage}
                        </p>
                      </div>
                    )}

                    {txResult && (
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono break-all">
                        {txResult}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSending || isAnalyzing}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl disabled:opacity-50"
                    >
                      {isSending
                        ? 'Broadcasting...'
                        : isAnalyzing
                        ? 'AI Scanning...'
                        : 'Confirm & Send'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};