// Simple Direct Test - Test if component and API are in same context

console.log('🔧 Simple Direct Test - Same Context Check');

// Test 1: Check if we can access the component directly
function testDirectAccess() {
  console.log('🔍 Testing direct component access...');
  
  // Check if DynamicControl component is accessible
  console.log('window.DynamicControl:', typeof window.DynamicControl);
  console.log('window.AlchemerImitiation:', typeof window.AlchemerImitiation);
  
  // List all window properties that might be component-related
  const componentProps = Object.keys(window).filter(key => 
    key.toLowerCase().includes('dynamic') || 
    key.toLowerCase().includes('assessor') || 
    key.toLowerCase().includes('grid') ||
    key.toLowerCase().includes('component')
  );
  
  console.log('Component-related window properties:', componentProps);
}

// Test 2: Send message to current window and see if component receives it
function testSameWindowMessage() {
  console.log('📤 Testing same-window PostMessage...');
  
  // Send message to current window
  window.postMessage({
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'setConfig',
    payload: {
      type: "checkbox",
      rows: ["DIRECT TEST"],
      columns: ["OPTION A", "OPTION B"]
    },
    id: 'direct_test_' + Date.now()
  }, '*');
  
  console.log('✅ Message sent to current window');
  console.log('👀 Check component PostMessage Debug section for activity');
}

// Test 3: Check if we're in an iframe
function checkIframeContext() {
  console.log('🔍 Checking iframe context...');
  
  console.log('window === window.parent:', window === window.parent);
  console.log('window === window.top:', window === window.top);
  console.log('window.location.href:', window.location.href);
  
  if (window !== window.parent) {
    console.log('🎯 We ARE in an iframe');
    console.log('Parent origin:', window.parent.location.origin);
  } else {
    console.log('🎯 We are NOT in an iframe');
  }
}

// Run all tests
function runSimpleTests() {
  console.log('🚀 Running Simple Direct Tests...\n');
  
  testDirectAccess();
  console.log('');
  checkIframeContext();
  console.log('');
  testSameWindowMessage();
}

// Make functions available
window.testDirectAccess = testDirectAccess;
window.testSameWindowMessage = testSameWindowMessage;
window.checkIframeContext = checkIframeContext;
window.runSimpleTests = runSimpleTests;

console.log('✅ Simple Direct Test loaded');
console.log('🧪 Run: runSimpleTests()');
