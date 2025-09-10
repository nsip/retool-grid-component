// PostMessage Debug Test - Direct component communication test

console.log('🔧 Starting PostMessage Debug Test...');

// Test 1: Send a simple ping to see if component responds
function testComponentPing() {
  console.log('📤 Sending ping to component...');
  
  // Send to current window (component might be listening here)
  window.postMessage({
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'ping',
    payload: { test: 'ping from debug test' },
    id: 'debug_ping_' + Date.now()
  }, '*');
  
  console.log('✅ Ping sent to current window');
}

// Test 2: Listen for any PostMessage responses (filtered to avoid loops)
function setupResponseListener() {
  console.log('👂 Setting up response listener...');
  
  window.addEventListener('message', (event) => {
    // Only log component responses, not our own commands
    if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE') {
      console.log('🎉 COMPONENT RESPONDED!', event.data);
    } else if (event.data && event.data.type === 'RETOOL_COMPONENT_READY') {
      console.log('🎉 COMPONENT READY SIGNAL!', event.data);
    }
    // Don't log RETOOL_COMPONENT_COMMAND to avoid infinite loops
  });
  
  console.log('✅ Response listener active');
}

// Test 3: Send setConfig directly to current window
function testDirectSetConfig() {
  console.log('📤 Sending setConfig directly to current window...');
  
  window.postMessage({
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'setConfig',
    payload: {
      type: "checkbox",
      rows: ["DEBUG TEST QUESTION"],
      columns: ["YES", "NO"]
    },
    id: 'debug_setconfig_' + Date.now()
  }, '*');
  
  console.log('✅ SetConfig sent to current window');
}

// Run all tests
function runDebugTests() {
  console.log('🚀 Running PostMessage Debug Tests...\n');
  
  // Setup listener first
  setupResponseListener();
  
  // Wait a moment, then send ping
  setTimeout(() => {
    testComponentPing();
  }, 500);
  
  // Wait another moment, then send setConfig
  setTimeout(() => {
    testDirectSetConfig();
  }, 1000);
  
  console.log('⏱️ Tests scheduled - watch for responses...');
}

// Make functions available globally
window.testComponentPing = testComponentPing;
window.setupResponseListener = setupResponseListener;
window.testDirectSetConfig = testDirectSetConfig;
window.runDebugTests = runDebugTests;

console.log('✅ PostMessage Debug Test loaded');
console.log('🧪 Run: runDebugTests()');

// Don't auto-run to avoid loops
console.log('🚨 Manual run only - call runDebugTests() when ready');
