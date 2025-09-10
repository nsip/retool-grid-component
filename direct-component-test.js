/**
 * Direct Component Test for dynamicControl1
 * 
 * This script works with Retool's direct component rendering (no iframe)
 * Copy this into your Retool JavaScript query and run it.
 */

// Since there's no iframe, we need to communicate directly with the component
// Let's try different approaches to reach the component

async function testDirectComponentAccess() {
  console.log('🔍 Testing direct component access for dynamicControl1...');
  
  // Method 1: Check if component exists in window
  console.log('1. Checking window.dynamicControl1:', window.dynamicControl1);
  
  // Method 2: Try to access component through Retool's component system
  if (typeof dynamicControl1 !== 'undefined') {
    console.log('2. dynamicControl1 is accessible:', dynamicControl1);
  } else {
    console.log('2. dynamicControl1 not directly accessible');
  }
  
  // Method 3: Look for the component in the DOM
  const componentElements = document.querySelectorAll('[data-testid*="dynamicControl1"], [id*="dynamicControl1"], [class*="dynamicControl1"]');
  console.log('3. Component DOM elements found:', componentElements.length);
  componentElements.forEach((elem, index) => {
    console.log(`   Element ${index}:`, elem);
  });
  
  // Method 4: Look for any custom component containers
  const customComponents = document.querySelectorAll('[data-testid*="custom"], [class*="custom-component"]');
  console.log('4. Custom component containers:', customComponents.length);
  
  // Method 5: Check if we can find component content
  const allElements = document.querySelectorAll('*');
  let componentFound = false;
  for (let elem of allElements) {
    const text = elem.textContent || '';
    if (text.includes('Dynamic Control Component') || 
        text.includes('Configure this component') ||
        text.includes('Grid Configuration')) {
      console.log('5. Found component content in:', elem);
      componentFound = true;
      break;
    }
  }
  
  if (!componentFound) {
    console.log('5. No component content found in DOM');
  }
  
  // Method 6: Try PostMessage to window (no iframe)
  console.log('6. Trying PostMessage to window...');
  
  return new Promise((resolve) => {
    const id = 'direct-test-' + Date.now();
    
    // Listen for responses
    const handleResponse = (event) => {
      console.log('Received message:', event.data);
      
      if (event.data && 
          event.data.type === 'RETOOL_COMPONENT_RESPONSE' && 
          event.data.id === id) {
        
        window.removeEventListener('message', handleResponse);
        clearTimeout(timeoutId);
        
        console.log('✅ Direct PostMessage successful!');
        resolve({ success: true, result: event.data.payload });
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      console.log('❌ Direct PostMessage timeout');
      resolve({ success: false, error: 'PostMessage timeout' });
    }, 3000);
    
    // Send message to window (not iframe)
    const message = {
      type: 'RETOOL_COMPONENT_COMMAND',
      action: 'ping',
      payload: null,
      id: id
    };
    
    console.log('Sending message to window:', message);
    window.postMessage(message, '*');
  });
}

// Alternative approach: Try to access component through Retool's API
async function testRetoolComponentAPI() {
  console.log('🔧 Testing Retool component API access...');
  
  // Check if we can access the component through Retool's component system
  try {
    // Method 1: Direct component access
    if (window.dynamicControl1) {
      console.log('Found dynamicControl1 in window:', window.dynamicControl1);
      
      // Try to access component properties
      const componentProps = Object.keys(window.dynamicControl1);
      console.log('Component properties:', componentProps);
      
      // Look for setValue/getValue methods
      if (typeof window.dynamicControl1.setValue === 'function') {
        console.log('✅ Found setValue method!');
        return { success: true, method: 'direct', component: window.dynamicControl1 };
      }
    }
    
    // Method 2: Check if component has exposed methods
    const globalMethods = [
      'setAssessorGridConfig',
      'getAssessorGridConfig', 
      'setAssessorGridResponses',
      'getAssessorGridResponses'
    ];
    
    for (let method of globalMethods) {
      if (typeof window[method] === 'function') {
        console.log(`✅ Found global method: ${method}`);
        return { success: true, method: 'global', methodName: method };
      }
    }
    
    // Method 3: Try to find component in Retool's component registry
    if (window.retool && window.retool.components) {
      console.log('Retool components:', Object.keys(window.retool.components));
      
      if (window.retool.components.dynamicControl1) {
        console.log('✅ Found in Retool components!');
        return { success: true, method: 'retool', component: window.retool.components.dynamicControl1 };
      }
    }
    
    return { success: false, error: 'No accessible methods found' };
    
  } catch (error) {
    console.error('Error testing component API:', error);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runComponentTests() {
  console.log('🚀 Running comprehensive component tests...');
  
  // Test 1: Direct component access
  const directTest = await testDirectComponentAccess();
  console.log('Direct test result:', directTest);
  
  // Test 2: Retool API access
  const apiTest = await testRetoolComponentAPI();
  console.log('API test result:', apiTest);
  
  // Test 3: Check component state/properties
  console.log('3. Component state check...');
  
  // Look for component state in various places
  const possibleLocations = [
    'window.dynamicControl1',
    'window.retool?.components?.dynamicControl1',
    'window.retool?.state?.dynamicControl1'
  ];
  
  for (let location of possibleLocations) {
    try {
      const value = eval(location);
      if (value) {
        console.log(`Found component at ${location}:`, value);
      }
    } catch (e) {
      // Ignore eval errors
    }
  }
  
  return {
    directAccess: directTest,
    apiAccess: apiTest,
    summary: directTest.success || apiTest.success ? 'Component accessible' : 'Component not accessible'
  };
}

// Run the comprehensive test
return await runComponentTests();
