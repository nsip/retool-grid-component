// FINAL SIMPLE TEST - Inline execution to avoid scoping issues

console.log('🔧 FINAL SIMPLE TEST - Inline execution');

// Check iframe context
console.log('window === window.parent:', window === window.parent);
console.log('window === window.top:', window === window.top);

// Check for component properties
const componentProps = Object.keys(window).filter(key => 
  key.toLowerCase().includes('dynamic') || 
  key.toLowerCase().includes('assessor') || 
  key.toLowerCase().includes('grid') ||
  key.toLowerCase().includes('component')
);
console.log('Component-related window properties:', componentProps);

// Test direct PostMessage to current window
console.log('📤 Sending PostMessage to current window...');
window.postMessage({
  type: 'RETOOL_COMPONENT_COMMAND',
  action: 'setConfig',
  payload: {
    type: "checkbox",
    rows: ["FINAL TEST"],
    columns: ["YES", "NO"]
  },
  id: 'final_test_' + Date.now()
}, '*');

console.log('✅ PostMessage sent - check component for updates');
console.log('👀 Look at component PostMessage Debug section');

// Return results
const results = {
  isIframe: window !== window.parent,
  componentProps: componentProps,
  messageSent: true
};

console.log('🎯 Test Results:', results);

// Make results available
window.finalTestResults = results;

console.log('✅ FINAL SIMPLE TEST COMPLETE');
