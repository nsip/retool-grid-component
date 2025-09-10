/**
 * AssessorGrid PostMessage API - Cross-Origin Iframe Solution
 * 
 * This API works with components in cross-origin iframes using PostMessage
 */

(function() {
  'use strict';
  
  console.log('Loading AssessorGrid PostMessage API...');
  
  // Find the iframe containing the component
  function findComponentIframe() {
    const iframes = document.querySelectorAll('iframe');
    // For now, use the first iframe - this can be made smarter if needed
    return iframes[0];
  }
  
  // Send PostMessage to component
  function sendMessage(action, payload, id) {
    const iframe = findComponentIframe();
    if (!iframe) {
      console.error('No iframe found for component');
      return Promise.reject(new Error('Component iframe not found'));
    }
    
    const messageId = id || 'msg_' + Date.now();
    
    return new Promise((resolve, reject) => {
      // Listen for response
      const responseHandler = (event) => {
        if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE' && event.data.id === messageId) {
          window.removeEventListener('message', responseHandler);
          if (event.data.success) {
            resolve(event.data.payload);
          } else {
            reject(new Error(event.data.payload.error || 'Unknown error'));
          }
        }
      };
      
      window.addEventListener('message', responseHandler);
      
      // Send message
      iframe.contentWindow.postMessage({
        type: 'RETOOL_COMPONENT_COMMAND',
        action: action,
        payload: payload,
        id: messageId
      }, '*');
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('message', responseHandler);
        reject(new Error('Timeout waiting for component response'));
      }, 5000);
    });
  }
  
  // Create the API
  window.assessorGrid = {
    
    setConfig: function(config) {
      console.log('Setting config:', config);
      return sendMessage('setConfig', config);
    },
    
    getConfig: function() {
      console.log('Getting config...');
      return sendMessage('getConfig');
    },
    
    setResponses: function(responses) {
      console.log('Setting responses:', responses);
      return sendMessage('setResponses', responses);
    },
    
    getResponses: function() {
      console.log('Getting responses...');
      return sendMessage('getResponses');
    },
    
    getStatus: function() {
      console.log('Getting status...');
      return sendMessage('getStatus');
    },
    
    ping: function() {
      console.log('Pinging component...');
      return sendMessage('ping');
    },
    
    // Convenience methods
    createCheckboxGrid: function(rows, columns) {
      const config = {
        type: "checkbox",
        rows: rows,
        columns: columns
      };
      return this.setConfig(config);
    },
    
    createRadioGrid: function(rows, columns) {
      const config = {
        type: "radio",
        rows: rows,
        columns: columns
      };
      return this.setConfig(config);
    },
    
    clearResponses: function() {
      return this.setResponses({});
    }
  };
  
  // Test function
  window.testAssessorGrid = async function() {
    console.log('Testing AssessorGrid PostMessage API...');
    
    try {
      // Test ping
      console.log('1. Testing ping...');
      const pingResult = await assessorGrid.ping();
      console.log('Ping result:', pingResult);
      
      // Test set config
      console.log('2. Testing setConfig...');
      const configResult = await assessorGrid.setConfig({
        type: "checkbox",
        rows: ["Test Question 1", "Test Question 2"],
        columns: ["Option A", "Option B", "Option C"]
      });
      console.log('Config result:', configResult);
      
      // Test set responses
      console.log('3. Testing setResponses...');
      const responsesResult = await assessorGrid.setResponses({
        "Test Question 1": {"Option A": true},
        "Test Question 2": {"Option B": true}
      });
      console.log('Responses result:', responsesResult);
      
      // Test get config
      console.log('4. Testing getConfig...');
      const config = await assessorGrid.getConfig();
      console.log('Retrieved config:', config);
      
      // Test get responses
      console.log('5. Testing getResponses...');
      const responses = await assessorGrid.getResponses();
      console.log('Retrieved responses:', responses);
      
      console.log('✅ All tests passed! AssessorGrid API is working.');
      return { success: true, message: 'All tests passed' };
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { success: false, error: error.message };
    }
  };
  
  console.log('✅ AssessorGrid PostMessage API loaded successfully!');
  console.log('📋 Available methods:');
  console.log('  - assessorGrid.setConfig(config)');
  console.log('  - assessorGrid.getConfig()');
  console.log('  - assessorGrid.setResponses(responses)');
  console.log('  - assessorGrid.getResponses()');
  console.log('  - assessorGrid.createCheckboxGrid(rows, columns)');
  console.log('  - assessorGrid.createRadioGrid(rows, columns)');
  console.log('  - assessorGrid.clearResponses()');
  console.log('  - assessorGrid.getStatus()');
  console.log('  - assessorGrid.ping()');
  console.log('🧪 Test with: testAssessorGrid()');
  
})();
