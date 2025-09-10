console.log('🔧 Final Solution API loading...');

// Create the API with maximum protection
function createFinalAPI() {
  const api = {
    setConfig: function(config) {
      console.log('Final API setConfig called with:', config);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setConfig',
          payload: config,
          id: 'final_' + Date.now()
        }, '*');
        console.log('PostMessage sent to iframe');
      } else {
        console.log('No iframe found');
      }
      return {success: true, config: config};
    },
    
    setResponses: function(responses) {
      console.log('Final API setResponses called with:', responses);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setResponses',
          payload: responses,
          id: 'final_' + Date.now()
        }, '*');
      }
      return {success: true, responses: responses};
    },
    
    getConfig: function() {
      console.log('Final API getConfig called');
      return {test: 'final config'};
    },
    
    getResponses: function() {
      console.log('Final API getResponses called');
      return {test: 'final responses'};
    },
    
    test: function() {
      console.log('Final API test method called');
      return 'Final API is working!';
    }
  };
  
  // Set with maximum protection
  try {
    Object.defineProperty(window, 'assessorGrid', {
      value: api,
      writable: true,
      configurable: true,
      enumerable: true
    });
    console.log('✅ Final API set with defineProperty');
  } catch (e) {
    window.assessorGrid = api;
    console.log('✅ Final API set with direct assignment');
  }
  
  return api;
}

// Create the API
const finalAPI = createFinalAPI();

// Verify immediately
console.log('Immediate verification:');
console.log('typeof window.assessorGrid:', typeof window.assessorGrid);
console.log('typeof window.assessorGrid.setConfig:', typeof window.assessorGrid.setConfig);
console.log('typeof window.assessorGrid.test:', typeof window.assessorGrid.test);

// Test the test method
try {
  console.log('Testing test method:', window.assessorGrid.test());
} catch (e) {
  console.log('Test method failed:', e.message);
}

// Set up monitoring to catch overwrites
let checkCount = 0;
const monitor = setInterval(function() {
  checkCount++;
  if (typeof window.assessorGrid !== 'object' || typeof window.assessorGrid.setConfig !== 'function') {
    console.log(`🚨 API overwritten at check ${checkCount}! Restoring...`);
    createFinalAPI();
  }
  
  if (checkCount >= 10) {
    clearInterval(monitor);
    console.log('✅ Monitoring complete - API should be stable');
    console.log('Final check - typeof window.assessorGrid.setConfig:', typeof window.assessorGrid.setConfig);
  }
}, 1000);

console.log('✅ Final Solution API loaded with monitoring');
console.log('🧪 Test with: window.assessorGrid.test()');
console.log('🎯 Use: window.assessorGrid.setConfig({type: "checkbox", rows: ["Test"], columns: ["A", "B"]})');
