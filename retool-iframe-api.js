// Retool-Iframe API - FIXED VERSION 61 - Routes messages to component iframe
// This creates functions that can be called from Retool JavaScript queries/triggers

console.log('🔧 Loading Retool-Iframe API...');

// Enhanced PostMessage function - finds and sends to component iframe
function broadcastMessage(message) {
  console.log('Broadcasting message:', message);
  
  // Method 1: Try to find the component iframe
  const iframes = document.querySelectorAll('iframe');
  let componentIframe = null;
  
  // Look for iframe that might contain our component
  for (let iframe of iframes) {
    // Check if iframe src contains retool or component-related keywords
    if (iframe.src && (
      iframe.src.includes('retool') || 
      iframe.src.includes('component') ||
      iframe.src.includes('localhost') ||
      iframe.contentWindow
    )) {
      componentIframe = iframe;
      console.log('🎯 Found potential component iframe:', iframe.src);
      break;
    }
  }
  
  // Method 2: Send to component iframe if found
  if (componentIframe && componentIframe.contentWindow) {
    try {
      componentIframe.contentWindow.postMessage(message, '*');
      console.log('✅ Message sent to component iframe');
    } catch (e) {
      console.log('❌ Failed to send to component iframe:', e.message);
    }
  }
  
  // Method 3: Send to all iframes as fallback
  iframes.forEach((iframe, index) => {
    if (iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(message, '*');
        console.log(`✅ Message sent to iframe ${index}`);
      } catch (e) {
        console.log(`❌ Failed to send to iframe ${index}:`, e.message);
      }
    }
  });
  
  // Method 4: Send to current window as final fallback
  try {
    window.postMessage(message, '*');
    console.log('✅ Message sent to current window (fallback)');
  } catch (e) {
    console.log('❌ Failed to send to current window:', e.message);
  }
  
  // Method 5: Also try with a delay for iframe initialization
  setTimeout(() => {
    const delayedIframes = document.querySelectorAll('iframe');
    delayedIframes.forEach((iframe, index) => {
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(message, '*');
          console.log(`✅ Delayed message sent to iframe ${index}`);
        } catch (e) {
          console.log(`❌ Failed to send delayed message to iframe ${index}:`, e.message);
        }
      }
    });
  }, 100);
}

// Create global functions that work in Retool JavaScript
function setAssessorGridConfig(config) {
  console.log('setAssessorGridConfig called with:', config);
  
  const message = {
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'setConfig',
    payload: config,
    id: 'retool_' + Date.now()
  };
  
  broadcastMessage(message);
  return true;
}

function setAssessorGridResponses(responses) {
  console.log('setAssessorGridResponses called with:', responses);
  
  const message = {
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'setResponses',
    payload: responses,
    id: 'retool_' + Date.now()
  };
  
  broadcastMessage(message);
  return true;
}

function getAssessorGridConfig() {
  console.log('getAssessorGridConfig called');
  
  const message = {
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'getConfig',
    id: 'retool_' + Date.now()
  };
  
  broadcastMessage(message);
  return {message: 'Config request sent - check component debug info'};
}

function getAssessorGridResponses() {
  console.log('getAssessorGridResponses called');
  
  const message = {
    type: 'RETOOL_COMPONENT_COMMAND',
    action: 'getResponses',
    id: 'retool_' + Date.now()
  };
  
  broadcastMessage(message);
  return {message: 'Responses request sent - check component debug info'};
}

function createCheckboxGrid(rows, columns) {
  console.log('createCheckboxGrid called with rows:', rows, 'columns:', columns);
  return setAssessorGridConfig({
    type: "checkbox",
    rows: rows,
    columns: columns
  });
}

function createRadioGrid(rows, columns) {
  console.log('createRadioGrid called with rows:', rows, 'columns:', columns);
  return setAssessorGridConfig({
    type: "radio",
    rows: rows,
    columns: columns
  });
}

// Debug function to list all iframes
function debugIframes() {
  console.log('🔍 Debugging iframes...');
  const iframes = document.querySelectorAll('iframe');
  console.log(`Found ${iframes.length} iframes:`);
  
  iframes.forEach((iframe, index) => {
    console.log(`Iframe ${index}:`, {
      src: iframe.src,
      id: iframe.id,
      className: iframe.className,
      hasContentWindow: !!iframe.contentWindow
    });
  });
  
  return {
    count: iframes.length,
    iframes: Array.from(iframes).map((iframe, index) => ({
      index,
      src: iframe.src,
      id: iframe.id,
      className: iframe.className
    }))
  };
}

// Make functions globally available
window.setAssessorGridConfig = setAssessorGridConfig;
window.setAssessorGridResponses = setAssessorGridResponses;
window.getAssessorGridConfig = getAssessorGridConfig;
window.getAssessorGridResponses = getAssessorGridResponses;
window.createCheckboxGrid = createCheckboxGrid;
window.createRadioGrid = createRadioGrid;
window.debugIframes = debugIframes;

console.log('✅ Retool-Iframe API loaded successfully!');
console.log('📋 Available functions for Retool JavaScript:');
console.log('  - setAssessorGridConfig(config)');
console.log('  - setAssessorGridResponses(responses)');
console.log('  - getAssessorGridConfig()');
console.log('  - getAssessorGridResponses()');
console.log('  - createCheckboxGrid(rows, columns)');
console.log('  - createRadioGrid(rows, columns)');
console.log('  - debugIframes() - shows all iframes');

// Test function for Retool JavaScript
function testAssessorGridAPI() {
  console.log('🧪 Testing AssessorGrid API from Retool JavaScript...');
  
  // First debug iframes
  const iframeInfo = debugIframes();
  
  // Test checkbox grid creation
  const result1 = createCheckboxGrid(
    ["How satisfied are you?", "Would you recommend us?"],
    ["Very", "Somewhat", "Not at all"]
  );
  
  // Test setting responses
  const result2 = setAssessorGridResponses({
    "How satisfied are you?": {"Very": true},
    "Would you recommend us?": {"Somewhat": true}
  });
  
  console.log('✅ API test completed');
  return {
    iframeInfo: iframeInfo,
    configResult: result1,
    responsesResult: result2,
    message: 'Check your component for the grid!'
  };
}

window.testAssessorGridAPI = testAssessorGridAPI;

console.log('🧪 Test from Retool JavaScript with: testAssessorGridAPI()');
console.log('🔍 Debug iframes with: debugIframes()');
