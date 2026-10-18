import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';

export interface ChainAddresses {
  solanaAddress: string;
  btcAddress: string;
}

const SOLANA_RPC_URL = 'https://rpc.ankr.com/eth_sepolia';
const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

// ---------- Balance ----------

export const getSolanaBalance = async (address: string): Promise<number> => {
  try {
    if (!address) return 0;
    const pubKey = new PublicKey(address);
    const balanceInLamports = await solanaConnection.getBalance(pubKey);
    return balanceInLamports / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to fetch Solana balance:', error);
    return 0;
  }
};

/**
 * Blockstream testnet API
 * chain_stats: funded_txo_sum, spent_txo_sum (satoshis)
 */
export const getBitcoinBalance = async (address: string): Promise<number> => {
  try {
    if (!address) return 0;

    // Demo address (bc1q...) testnet API-তে কাজ নাও করতে পারে
    const response = await fetch(
      `https://blockstream.info/testnet/api/address/${address}`
    );
    if (!response.ok) return 0;

    const data = await response.json();
    const funded = data?.chain_stats?.funded_txo_sum ?? 0;
    const spent = data?.chain_stats?.spent_txo_sum ?? 0;
    const satoshis = funded - spent;

    return Math.max(0, satoshis / 1e8);
  } catch (error) {
    console.error('Failed to fetch Bitcoin balance:', error);
    return 0;
  }
};

// ---------- Address derivation ----------

export const generateSolanaAddress = async (
  mnemonic: string
): Promise<string> => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seed32 = seed.subarray(0, 32);
    const keypair = Keypair.fromSeed(seed32);
    return keypair.publicKey.toBase58();
  } catch (error) {
    console.error('Solana derivation failed:', error);
    return '';
  }
};

/** Demo only — production-এ bitcoinjs-lib + BIP84 ব্যবহার করুন */
export const generateBitcoinAddress = async (
  mnemonic: string
): Promise<string> => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // tb1q = testnet bech32 prefix (demo)
    return 'tb1q' + Buffer.from(seed).toString('hex').slice(0, 38);
  } catch (error) {
    console.error('Bitcoin derivation failed:', error);
    return '';
  }
};

export const deriveMultichainAddresses = async (
  mnemonic: string
): Promise<ChainAddresses> => {
  const [solanaAddress, btcAddress] = await Promise.all([
    generateSolanaAddress(mnemonic),
    generateBitcoinAddress(mnemonic),
  ]);
  return { solanaAddress, btcAddress };
};

// ---------- Solana Send (Devnet) ----------

export const getSolanaKeypairFromMnemonic = async (
  mnemonic: string
): Promise<Keypair> => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seed32 = seed.subarray(0, 32);
  return Keypair.fromSeed(seed32);
};

export const sendSolanaTransaction = async (
  mnemonic: string,
  toAddress: string,
  amountSol: number
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    const fromKeypair = await getSolanaKeypairFromMnemonic(mnemonic);
    const toPubkey = new PublicKey(toAddress);
    const lamports = Math.round(amountSol * LAMPORTS_PER_SOL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(
      solanaConnection,
      transaction,
      [fromKeypair]
    );

    return { success: true, signature };
  } catch (error: any) {
    console.error('Solana send failed:', error);
    return {
      success: false,
      error: error?.message || 'Solana transaction failed',
    };
  }
};