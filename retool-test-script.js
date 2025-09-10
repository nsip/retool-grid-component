/**
 * Retool Test Script for DynamicControl PostMessage API
 * 
 * Copy this code into a Retool JavaScript query to test the new PostMessage API
 * with your deployed DynamicControl component.
 */

// Lightweight PostMessage helper for Retool environment
function sendComponentCommand(action, payload = null) {
  return new Promise((resolve, reject) => {
    // Find the component iframe
    const iframe = document.querySelector('iframe[src*="retool"]') || 
                   document.querySelector('iframe[src*="custom-component"]');
    
    if (!iframe || !iframe.contentWindow) {
      reject(new Error('DynamicControl component iframe not found. Make sure the component is visible on the page.'));
      return;
    }
    
    const id = 'retool-test-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Set up response listener
    const handleResponse = (event) => {
      if (event.data && 
          event.data.type === 'RETOOL_COMPONENT_RESPONSE' && 
          event.data.id === id) {
        
        window.removeEventListener('message', handleResponse);
        clearTimeout(timeoutId);
        
        if (event.data.success) {
          resolve(event.data.payload);
        } else {
          reject(new Error(`Component error: ${event.data.payload?.error || 'Unknown error'}`));
        }
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      reject(new Error(`Request timeout for action: ${action}. Component may not be responding.`));
    }, 5000);
    
    // Send the command
    try {
      iframe.contentWindow.postMessage({
        type: 'RETOOL_COMPONENT_COMMAND',
        action: action,
        payload: payload,
        id: id
      }, '*');
    } catch (error) {
      window.removeEventListener('message', handleResponse);
      clearTimeout(timeoutId);
      reject(new Error(`Failed to send message: ${error.message}`));
    }
  });
}

// Test functions for Retool
async function testDynamicControlAPI(componentName = 'dynamicComponent1') {
  console.log(`🚀 Starting DynamicControl API Test for component: ${componentName}...`);
  
  try {
    // Test 1: Ping the component
    console.log('📡 Testing component availability...');
    const pingResult = await sendComponentCommand('ping');
    console.log('✅ Ping successful:', pingResult);
    
    // Test 2: Get component status
    console.log('📊 Getting component status...');
    const status = await sendComponentCommand('getStatus');
    console.log('✅ Status retrieved:', status);
    
    // Test 3: Set configuration
    console.log('⚙️ Setting grid configuration...');
    const testConfig = {
      type: "checkbox",
      rows: ["How satisfied are you with the service?", "Would you recommend us?", "Rate the user experience"],
      columns: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
    };
    
    const setConfigResult = await sendComponentCommand('setConfig', testConfig);
    console.log('✅ Configuration set:', setConfigResult);
    
    // Test 4: Verify configuration was set
    console.log('🔍 Verifying configuration...');
    const currentConfig = await sendComponentCommand('getConfig');
    console.log('✅ Current configuration:', currentConfig);
    
    // Test 5: Set some responses
    console.log('📝 Setting test responses...');
    const testResponses = {
      "How satisfied are you with the service?": {"Agree": true},
      "Would you recommend us?": {"Strongly Agree": true},
      "Rate the user experience": {"Neutral": true}
    };
    
    const setResponsesResult = await sendComponentCommand('setResponses', testResponses);
    console.log('✅ Responses set:', setResponsesResult);
    
    // Test 6: Verify responses were set
    console.log('🔍 Verifying responses...');
    const currentResponses = await sendComponentCommand('getResponses');
    console.log('✅ Current responses:', currentResponses);
    
    console.log('🎉 All tests passed! DynamicControl API is working correctly.');
    
    return {
      success: true,
      message: 'All API tests passed successfully',
      componentName: componentName,
      results: {
        ping: pingResult,
        status: status,
        configSet: setConfigResult,
        configRetrieved: currentConfig,
        responsesSet: setResponsesResult,
        responsesRetrieved: currentResponses
      }
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'API test failed - see error details',
      componentName: componentName
    };
  }
}

// Quick individual test functions
async function quickPing() {
  try {
    const result = await sendComponentCommand('ping');
    console.log('Ping result:', result);
    return result;
  } catch (error) {
    console.error('Ping failed:', error.message);
    throw error;
  }
}

async function quickSetConfig(config) {
  try {
    const result = await sendComponentCommand('setConfig', config);
    console.log('Config set:', result);
    return result;
  } catch (error) {
    console.error('Set config failed:', error.message);
    throw error;
  }
}

async function quickGetConfig() {
  try {
    const result = await sendComponentCommand('getConfig');
    console.log('Current config:', result);
    return result;
  } catch (error) {
    console.error('Get config failed:', error.message);
    throw error;
  }
}

async function quickSetResponses(responses) {
  try {
    const result = await sendComponentCommand('setResponses', responses);
    console.log('Responses set:', result);
    return result;
  } catch (error) {
    console.error('Set responses failed:', error.message);
    throw error;
  }
}

async function quickGetResponses() {
  try {
    const result = await sendComponentCommand('getResponses');
    console.log('Current responses:', result);
    return result;
  } catch (error) {
    console.error('Get responses failed:', error.message);
    throw error;
  }
}

// Export for use in Retool
// In Retool, you can call these functions directly:

/*
USAGE EXAMPLES IN RETOOL:

1. Run the full test suite:
   await testDynamicControlAPI()

2. Quick tests:
   await quickPing()
   await quickSetConfig({
     type: "checkbox",
     rows: ["Question 1", "Question 2"],
     columns: ["Yes", "No", "Maybe"]
   })
   await quickGetConfig()
   await quickSetResponses({
     "Question 1": {"Yes": true},
     "Question 2": {"Maybe": true}
   })
   await quickGetResponses()

3. Custom commands:
   await sendComponentCommand('ping')
   await sendComponentCommand('getStatus')
   await sendComponentCommand('setConfig', yourConfigObject)
   await sendComponentCommand('getConfig')
   await sendComponentCommand('setResponses', yourResponsesObject)
   await sendComponentCommand('getResponses')

TROUBLESHOOTING:
- If you get "iframe not found" errors, make sure the DynamicControl component is visible on your Retool page
- If you get timeout errors, check that you're using Version 51+ of the component library
- Check the browser console for any component-specific error messages
- Make sure the component name in your Retool app matches 'DynamicControl'
*/

// Make functions available globally for Retool console testing
if (typeof window !== 'undefined') {
  window.testDynamicControlAPI = testDynamicControlAPI;
  window.quickPing = quickPing;
  window.quickSetConfig = quickSetConfig;
  window.quickGetConfig = quickGetConfig;
  window.quickSetResponses = quickSetResponses;
  window.quickGetResponses = quickGetResponses;
  window.sendComponentCommand = sendComponentCommand;
}

// For module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testDynamicControlAPI,
    quickPing,
    quickSetConfig,
    quickGetConfig,
    quickSetResponses,
    quickGetResponses,
    sendComponentCommand
  };
}
