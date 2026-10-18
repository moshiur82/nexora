chrome.runtime.onInstalled.addListener(() => {
  console.log('NEXORA Extension installed successfully.');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'CONNECT_WALLET') {
    chrome.storage.local.get(['walletAddress'], (data) => {
      sendResponse({
        success: !!data.walletAddress,
        address: data.walletAddress || null,
      });
    });
    return true; // async response
  }

  if (message.action === 'SAVE_WALLET') {
    chrome.storage.local.set(
      { walletAddress: message.address },
      () => sendResponse({ success: true })
    );
    return true;
  }
});