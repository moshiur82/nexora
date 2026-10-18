console.log('NEXORA Web3 Security Guard Injected.');

// DApp → Extension
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (event.data?.type === 'NEXORA_CONNECT_REQUEST') {
    chrome.runtime.sendMessage(
      { action: 'CONNECT_WALLET' },
      (response) => {
        window.postMessage(
          { type: 'NEXORA_CONNECT_RESPONSE', payload: response },
          '*'
        );
      }
    );
  }
});

// Optional: page-কে জানানো যে NEXORA আছে
window.postMessage({ type: 'NEXORA_EXTENSION_READY' }, '*');