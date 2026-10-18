import { ethers } from 'ethers';

import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

export interface MultichainAccount {
  evmAddress: string;
  solanaAddress: string;
  btcAddress: string;
  privateKey: string;
  mnemonic: string;
}

// সোলানা ওয়ালেট জেনারেটর (Seed derived from Mnemonic)
export const generateSolanaAddress = async (mnemonic: string): Promise<string> => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // Derivation path formatted for Solana
    const seed32 = seed.subarray(0, 32);
    const keypair = Keypair.fromSeed(seed32);
    return keypair.publicKey.toBase58();
  } catch (error) {
    console.error('Solana wallet derivation failed:', error);
    return 'Solana Address Generation Error';
  }
};

// বিটকয়েন টেস্টনেট/মেইননেট অ্যাড্রেস জেনারেটর ডেমো
export const generateBitcoinAddress = async (mnemonic: string): Promise<string> => {
  try {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // Simple deterministic demo BTC address format
    const btcDemoAddr = 'bc1q' + seed.toString('hex').slice(0, 38);
    return btcDemoAddr;
  } catch (error) {
    console.error('Bitcoin wallet derivation failed:', error);
    return 'Bitcoin Address Generation Error';
  }
};

export interface WalletAccount {
  address: string;
  privateKey: string;
  mnemonic: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Sepolia Testnet RPC
const RPC_URL = 'https://rpc.sepolia.org';

// ব্যাকএন্ডে ওয়ালেট রেজিস্টার
export const registerWalletToBackend = async (
  address: string,
  walletType: string = 'evm'
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        wallet_type: walletType,
      }),
    });

    if (!response.ok) {
      console.warn('Backend registration failed or address already exists.');
    } else {
      const data = await response.json();
      console.log('Wallet registered successfully:', data);
    }
  } catch (error) {
    console.error('Error connecting to Django backend:', error);
  }
};

// নতুন ওয়ালেট তৈরি
export const createNewWallet = async (): Promise<WalletAccount> => {
  const wallet = ethers.Wallet.createRandom();

  const account: WalletAccount = {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || '',
  };

  await registerWalletToBackend(account.address, 'evm');
  return account;
};

// প্রাইভেট কি / মnemonic দিয়ে ইমপোর্ট
export const importWalletFromKey = async (
  secret: string
): Promise<WalletAccount | null> => {
  try {
    let wallet: ethers.HDNodeWallet | ethers.Wallet;

    if (secret.trim().includes(' ')) {
      wallet = ethers.HDNodeWallet.fromPhrase(secret.trim());
    } else {
      wallet = new ethers.Wallet(secret.trim());
    }

    const account: WalletAccount = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic:
        'mnemonic' in wallet && wallet.mnemonic
          ? wallet.mnemonic.phrase
          : '',
    };

    await registerWalletToBackend(account.address, 'evm');
    return account;
  } catch (error) {
    console.error('Invalid wallet credentials:', error);
    return null;
  }
};

// ব্যালেন্স ফেচ (Sepolia)
export const fetchWalletBalance = async (address: string): Promise<string> => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);
    return parseFloat(balanceEth).toFixed(4);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0.0000';
  }
};

// ক্রিপ্টো পাঠানো (Self-Custody Signing)
export const sendTransaction = async (
  privateKey: string,
  recipientAddress: string,
  amountInEth: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = await wallet.sendTransaction({
      to: recipientAddress,
      value: ethers.parseEther(amountInEth),
    });

    return {
      success: true,
      txHash: tx.hash,
    };
  } catch (error: any) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error.reason || error.message || 'Transaction broadcast failed',
    };
  }
};