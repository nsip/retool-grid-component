// Retool-Native API - Works within Retool JavaScript environment
// This creates functions that can be called from Retool JavaScript queries/triggers

console.log('🔧 Loading Retool-Native API...');

// Simplified PostMessage function - send directly to current window
function broadcastMessage(message) {
  console.log('Broadcasting message:', message);
  
  // Send directly to current window where component is listening
  try {
    window.postMessage(message, '*');
    console.log('✅ Message sent to current window');
  } catch (e) {
    console.log('❌ Failed to send to current window:', e.message);
  }
  
  // Also try a small delay in case component needs time to initialize
  setTimeout(() => {
    try {
      window.postMessage(message, '*');
      console.log('✅ Delayed message sent to current window');
    } catch (e) {
      console.log('❌ Failed to send delayed message:', e.message);
    }
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
  // For now, return a placeholder - we can enhance this later
  return {message: 'Config retrieval - check component debug info'};
}

function getAssessorGridResponses() {
  console.log('getAssessorGridResponses called');
  // For now, return a placeholder - we can enhance this later
  return {message: 'Responses retrieval - check component debug info'};
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

// Make functions globally available
window.setAssessorGridConfig = setAssessorGridConfig;
window.setAssessorGridResponses = setAssessorGridResponses;
window.getAssessorGridConfig = getAssessorGridConfig;
window.getAssessorGridResponses = getAssessorGridResponses;
window.createCheckboxGrid = createCheckboxGrid;
window.createRadioGrid = createRadioGrid;

console.log('✅ Retool-Native API loaded successfully!');
console.log('📋 Available functions for Retool JavaScript:');
console.log('  - setAssessorGridConfig(config)');
console.log('  - setAssessorGridResponses(responses)');
console.log('  - getAssessorGridConfig()');
console.log('  - getAssessorGridResponses()');
console.log('  - createCheckboxGrid(rows, columns)');
console.log('  - createRadioGrid(rows, columns)');

// Test function for Retool JavaScript
function testAssessorGridAPI() {
  console.log('🧪 Testing AssessorGrid API from Retool JavaScript...');
  
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
    configResult: result1,
    responsesResult: result2,
    message: 'Check your component for the grid!'
  };
}

window.testAssessorGridAPI = testAssessorGridAPI;

console.log('🧪 Test from Retool JavaScript with: testAssessorGridAPI()');
