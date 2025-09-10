/**
 * Quick Fix for dynamicComponent1 - Retool Test
 * 
 * This is a simplified version specifically for your component instance "dynamicComponent1"
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
  console.log('🔍 Debugging component setup...');
  
  // Check for iframes
  const allIframes = document.querySelectorAll('iframe');
  console.log(`Found ${allIframes.length} iframes:`);
  allIframes.forEach((frame, index) => {
    console.log(`  Iframe ${index}: ${frame.src}`);
  });
  
  // Check for your component specifically
  const dynamicComponent1 = window.dynamicComponent1;
  console.log('dynamicComponent1 object:', dynamicComponent1);
  
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
  console.log('🧪 Running simple test...');
  
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
      message: 'Simple test passed!',
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

// Run this to test your setup
return await debugComponentSetup();

// After debugging, uncomment this line to run the actual test:
// return await simpleTest();
