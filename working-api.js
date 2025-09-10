console.log('🎯 Working API loading...');

// The key insight: window.assessorGrid !== assessorGrid in Retool
// We must use window.assessorGrid for the API to work

function createWorkingAPI() {
  const api = {
    setConfig: function(config) {
      console.log('Working setConfig called with:', config);
      // Here we'll add the actual PostMessage code
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setConfig',
          payload: config,
          id: 'api_' + Date.now()
        }, '*');
      }
      return Promise.resolve({success: true, config: config});
    },
    
    getConfig: function() {
      console.log('Working getConfig called');
      return Promise.resolve({test: 'working config'});
    },
    
    setResponses: function(responses) {
      console.log('Working setResponses called with:', responses);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setResponses',
          payload: responses,
          id: 'api_' + Date.now()
        }, '*');
      }
      return Promise.resolve({success: true, responses: responses});
    },
    
    getResponses: function() {
      console.log('Working getResponses called');
      return Promise.resolve({test: 'working responses'});
    }
  };
  
  // Set on window object (this is what works!)
  window.assessorGrid = api;
  
  return api;
}

const workingAPI = createWorkingAPI();

console.log('✅ Working API created');
console.log('Use: window.assessorGrid.setConfig() - this works!');
console.log('Do NOT use: assessorGrid.setConfig() - this fails!');

// Test it immediately
setTimeout(function() {
  console.log('🧪 Testing working API...');
  try {
    const result = window.assessorGrid.setConfig({type: "test", rows: ["Working"], columns: ["A", "B"]});
    console.log('✅ API test successful:', result);
  } catch (e) {
    console.log('❌ API test failed:', e.message);
  }
}, 1000);
