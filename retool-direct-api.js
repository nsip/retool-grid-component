/**
 * Retool Direct API for dynamicControl1
 * 
 * This script works with Retool's direct component access (no PostMessage needed)
 * Copy this into your Retool JavaScript query and run it.
 */

// Direct component access functions
function getComponentConfig() {
  if (dynamicControl1 && dynamicControl1.config !== undefined) {
    console.log('Current config:', dynamicControl1.config);
    return dynamicControl1.config;
  } else {
    throw new Error('Component config not accessible');
  }
}

function setComponentConfig(newConfig) {
  if (dynamicControl1) {
    const configString = typeof newConfig === 'string' ? newConfig : JSON.stringify(newConfig);
    
    // Try different ways to set the config
    if (typeof dynamicControl1.setValue === 'function') {
      dynamicControl1.setValue({ config: configString });
    } else if (dynamicControl1.config !== undefined) {
      dynamicControl1.config = configString;
    } else {
      throw new Error('Cannot set component config - no accessible method');
    }
    
    console.log('Config set to:', configString);
    return { success: true, config: configString };
  } else {
    throw new Error('Component not accessible');
  }
}

function getComponentResponses() {
  if (dynamicControl1 && dynamicControl1.responses !== undefined) {
    console.log('Current responses:', dynamicControl1.responses);
    return dynamicControl1.responses;
  } else {
    throw new Error('Component responses not accessible');
  }
}

function setComponentResponses(newResponses) {
  if (dynamicControl1) {
    const responsesString = typeof newResponses === 'string' ? newResponses : JSON.stringify(newResponses);
    
    // Try different ways to set the responses
    if (typeof dynamicControl1.setValue === 'function') {
      dynamicControl1.setValue({ responses: responsesString });
    } else if (dynamicControl1.responses !== undefined) {
      dynamicControl1.responses = responsesString;
    } else {
      throw new Error('Cannot set component responses - no accessible method');
    }
    
    console.log('Responses set to:', responsesString);
    return { success: true, responses: responsesString };
  } else {
    throw new Error('Component not accessible');
  }
}

// Test the direct API
async function testDirectAPI() {
  console.log('🚀 Testing Retool Direct API for dynamicControl1...');
  
  try {
    // Test 1: Check component accessibility
    console.log('1. Component object:', dynamicControl1);
    console.log('   Component type:', dynamicControl1.pluginType);
    console.log('   Component properties:', Object.keys(dynamicControl1));
    
    // Test 2: Get current config
    console.log('2. Getting current config...');
    const currentConfig = getComponentConfig();
    console.log('   ✅ Current config:', currentConfig);
    
    // Test 3: Get current responses
    console.log('3. Getting current responses...');
    const currentResponses = getComponentResponses();
    console.log('   ✅ Current responses:', currentResponses);
    
    // Test 4: Set a simple config
    console.log('4. Setting test configuration...');
    const testConfig = {
      type: "checkbox",
      rows: ["Test Question 1", "Test Question 2"],
      columns: ["Yes", "No", "Maybe"]
    };
    
    const setConfigResult = setComponentConfig(testConfig);
    console.log('   ✅ Config set result:', setConfigResult);
    
    // Test 5: Verify config was set
    console.log('5. Verifying config was set...');
    const verifyConfig = getComponentConfig();
    console.log('   ✅ Verified config:', verifyConfig);
    
    // Test 6: Set test responses
    console.log('6. Setting test responses...');
    const testResponses = {
      "Test Question 1": {"Yes": true},
      "Test Question 2": {"Maybe": true}
    };
    
    const setResponsesResult = setComponentResponses(testResponses);
    console.log('   ✅ Responses set result:', setResponsesResult);
    
    // Test 7: Verify responses were set
    console.log('7. Verifying responses were set...');
    const verifyResponses = getComponentResponses();
    console.log('   ✅ Verified responses:', verifyResponses);
    
    console.log('🎉 All direct API tests passed!');
    
    return {
      success: true,
      message: 'Direct API working perfectly!',
      results: {
        componentType: dynamicControl1.pluginType,
        initialConfig: currentConfig,
        initialResponses: currentResponses,
        testConfigSet: setConfigResult,
        verifiedConfig: verifyConfig,
        testResponsesSet: setResponsesResult,
        verifiedResponses: verifyResponses
      }
    };
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Direct API test failed'
    };
  }
}

// Alternative approach: Try to trigger component updates
async function testComponentUpdates() {
  console.log('🔄 Testing component update methods...');
  
  try {
    // Check what methods are available on the component
    const componentMethods = [];
    for (let prop in dynamicControl1) {
      if (typeof dynamicControl1[prop] === 'function') {
        componentMethods.push(prop);
      }
    }
    
    console.log('Available component methods:', componentMethods);
    
    // Try common update methods
    const updateMethods = ['setValue', 'updateValue', 'setData', 'update', 'refresh', 'trigger'];
    
    for (let method of updateMethods) {
      if (typeof dynamicControl1[method] === 'function') {
        console.log(`✅ Found update method: ${method}`);
        
        // Try to use it
        try {
          const result = dynamicControl1[method]({
            config: JSON.stringify({
              type: "checkbox",
              rows: ["Method Test"],
              columns: ["Working", "Not Working"]
            })
          });
          console.log(`   ${method} result:`, result);
        } catch (e) {
          console.log(`   ${method} failed:`, e.message);
        }
      }
    }
    
    return { success: true, availableMethods: componentMethods };
    
  } catch (error) {
    console.error('Component update test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the tests
async function runAllTests() {
  console.log('🎯 Running all direct API tests...');
  
  const directTest = await testDirectAPI();
  const updateTest = await testComponentUpdates();
  
  return {
    directAPI: directTest,
    updateMethods: updateTest,
    summary: directTest.success ? 'SUCCESS: Direct API working!' : 'FAILED: Need alternative approach'
  };
}

// Execute the test
return await runAllTests();
