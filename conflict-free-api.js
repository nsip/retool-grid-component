console.log('🎯 Conflict-Free API loading...');

// Use a different name to avoid component conflicts
function createConflictFreeAPI() {
  const api = {
    setConfig: function(config) {
      console.log('Conflict-free setConfig called with:', config);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setConfig',
          payload: config,
          id: 'cf_' + Date.now()
        }, '*');
        console.log('PostMessage sent to iframe');
      } else {
        console.log('No iframe found');
      }
      return {success: true, config: config};
    },
    
    setResponses: function(responses) {
      console.log('Conflict-free setResponses called with:', responses);
      const iframe = document.querySelector('iframe');
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'RETOOL_COMPONENT_COMMAND',
          action: 'setResponses',
          payload: responses,
          id: 'cf_' + Date.now()
        }, '*');
      }
      return {success: true, responses: responses};
    },
    
    getConfig: function() {
      console.log('Conflict-free getConfig called');
      return {test: 'conflict-free config'};
    },
    
    getResponses: function() {
      console.log('Conflict-free getResponses called');
      return {test: 'conflict-free responses'};
    },
    
    test: function() {
      console.log('Conflict-free test method called');
      return 'Conflict-free API is working!';
    }
  };
  
  // Use a name the component won't overwrite
  window.gridAPI = api;
  
  return api;
}

// Create the API with conflict-free name
const conflictFreeAPI = createConflictFreeAPI();

console.log('✅ Conflict-Free API created as window.gridAPI');
console.log('typeof window.gridAPI:', typeof window.gridAPI);
console.log('typeof window.gridAPI.setConfig:', typeof window.gridAPI.setConfig);
console.log('typeof window.gridAPI.test:', typeof window.gridAPI.test);

// Test immediately
try {
  console.log('Testing: window.gridAPI.test():', window.gridAPI.test());
} catch (e) {
  console.log('Test failed:', e.message);
}

console.log('🧪 Test with: window.gridAPI.test()');
console.log('🎯 Use: window.gridAPI.setConfig({type: "checkbox", rows: ["Test"], columns: ["A", "B"]})');
