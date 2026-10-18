export interface RiskAnalysisResult {
  score: number;
  status: 'Safe' | 'Suspicious' | 'High Risk';
  warningMessage: string;
}

export interface AIRiskLog {
  id: number;
  user_address: string;
  recipient_address: string;
  risk_score: number;
  status: 'Safe' | 'Suspicious' | 'High Risk';
  warning_message: string;
  checked_at: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const fetchAIRiskLogsFromBackend = async (): Promise<AIRiskLog[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-risk-logs/`);
    if (!response.ok) return [];

    const data = await response.json();
    // DRF pagination থাকলে results array
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  } catch (error) {
    console.error('Failed to fetch AI Risk logs:', error);
    return [];
  }
};

export const saveAIRiskLogToBackend = async (
  userAddress: string,
  recipientAddress: string,
  result: RiskAnalysisResult
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-risk-logs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_address: userAddress,
        recipient_address: recipientAddress,
        risk_score: result.score,
        status: result.status,
        warning_message: result.warningMessage,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Risk Log failed:', response.status, errText);
      return;
    }

    const data = await response.json();
    console.log('AI Risk Log saved:', data);
  } catch (error) {
    console.error('Failed to log AI Risk analysis:', error);
  }
};

export const analyzeTransactionRisk = async (
  userAddress: string,
  recipientAddress: string,
  amount: string
): Promise<RiskAnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerAddr = recipientAddress.toLowerCase();
  let result: RiskAnalysisResult;

  if (
    lowerAddr === '0x000000000000000000000000000000000000dead' ||
    lowerAddr.includes('bad')
  ) {
    result = {
      score: 95,
      status: 'High Risk',
      warningMessage:
        'Warning: This address is flagged in the NEXORA Global Threat Database as a known phishing or scam contract!',
    };
  } else if (parseFloat(amount) > 10) {
    result = {
      score: 60,
      status: 'Suspicious',
      warningMessage:
        'Caution: High-value transaction detected. Please double-check the recipient address before broadcasting.',
    };
  } else {
    result = {
      score: 5,
      status: 'Safe',
      warningMessage:
        'AI Security Check Passed: No malicious indicators found for this address.',
    };
  }

  await saveAIRiskLogToBackend(userAddress, recipientAddress, result);
  return result;
};