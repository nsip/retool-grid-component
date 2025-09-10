/**
 * Corrected Test Script for dynamicControl1
 * 
 * This script uses the correct component name: dynamicControl1
 * Copy this into your Retool JavaScript query and run it.
 */

// Simple test function that finds any iframe and tests the API
function sendComponentCommand(action, payload = null) {
  return new Promise((resolve, reject) => {
    // Try multiple ways to find the iframe
    let iframe = document.querySelector('iframe[src*="retool"]') || 
                 document.querySelector('iframe[src*="custom-component"]') ||
                 document.querySelector('iframe');
    
    console.log('Found iframe:', iframe);
    
    if (!iframe || !iframe.contentWindow) {
      // Let's debug what iframes we can find
      const allIframes = document.querySelectorAll('iframe');
      console.log('All iframes found:', allIframes.length);
      allIframes.forEach((frame, index) => {
        console.log(`Iframe ${index}:`, frame.src);
      });
      
      reject(new Error(`No suitable iframe found. Found ${allIframes.length} total iframes.`));
      return;
    }
    
    const id = 'test-' + Date.now();
    console.log('Sending command:', action, 'with ID:', id);
    
    // Set up response listener
    const handleResponse = (event) => {
      console.log('Received message:', event.data);
      
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
      const message = {
        type: 'RETOOL_COMPONENT_COMMAND',
        action: action,
        payload: payload,
        id: id
      };
      
      console.log('Sending message:', message);
      iframe.contentWindow.postMessage(message, '*');
    } catch (error) {
      window.removeEventListener('message', handleResponse);
      clearTimeout(timeoutId);
      reject(new Error(`Failed to send message: ${error.message}`));
    }
  });
}

// Debug function to check what's available
async function debugComponentSetup() {
  console.log('🔍 Debugging dynamicControl1 setup...');
  
  // Check for iframes
  const allIframes = document.querySelectorAll('iframe');
  console.log(`Found ${allIframes.length} iframes:`);
  allIframes.forEach((frame, index) => {
    console.log(`  Iframe ${index}: ${frame.src}`);
  });
  
  // Check for your component specifically (correct name now)
  const dynamicControl1 = window.dynamicControl1;
  console.log('dynamicControl1 object:', dynamicControl1);
  
  // Check if component is visible on page
  const componentText = document.body.textContent;
  const hasComponentText = componentText.includes('Dynamic Control') || 
                          componentText.includes('Grid Configuration') ||
                          componentText.includes('Configure this component');
  console.log('Page contains component text:', hasComponentText);
  
  // Try to ping
  try {
    console.log('Attempting to ping component...');
    const result = await sendComponentCommand('ping');
    console.log('✅ Ping successful:', result);
    return { success: true, result };
  } catch (error) {
    console.log('❌ Ping failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Simple test that should work
async function simpleTest() {
  console.log('🧪 Running simple test for dynamicControl1...');
  
  try {
    // Test 1: Ping
    console.log('Step 1: Ping component...');
    const pingResult = await sendComponentCommand('ping');
    console.log('✅ Ping result:', pingResult);
    
    // Test 2: Set simple config
    console.log('Step 2: Set simple configuration...');
    const simpleConfig = {
      type: "checkbox",
      rows: ["Test Question"],
      columns: ["Yes", "No"]
    };
    
    const configResult = await sendComponentCommand('setConfig', simpleConfig);
    console.log('✅ Config set:', configResult);
    
    // Test 3: Get config back
    console.log('Step 3: Get configuration...');
    const retrievedConfig = await sendComponentCommand('getConfig');
    console.log('✅ Retrieved config:', retrievedConfig);
    
    return {
      success: true,
      message: 'Simple test passed for dynamicControl1!',
      results: {
        ping: pingResult,
        configSet: configResult,
        configRetrieved: retrievedConfig
      }
    };
    
  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Full test suite for dynamicControl1
async function testDynamicControl1API() {
  console.log('🚀 Starting DynamicControl API Test for dynamicControl1...');
  
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
    
    console.log('🎉 All tests passed! dynamicControl1 API is working correctly.');
    
    return {
      success: true,
      message: 'All API tests passed successfully for dynamicControl1',
      componentName: 'dynamicControl1',
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
      componentName: 'dynamicControl1'
    };
  }
}

// Run this first to debug your setup
return await debugComponentSetup();

// After debugging works, uncomment this line to run the simple test:
// return await simpleTest();

// After simple test works, uncomment this line to run the full test suite:
// return await testDynamicControl1API();
