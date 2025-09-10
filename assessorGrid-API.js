/**
 * AssessorGrid API - Updated for Direct Component Access
 * 
 * This replaces the old global assessorGrid functions with the new direct access approach.
 * Copy this into your Retool JavaScript queries to control the grid programmatically.
 * 
 * Version: 52 (Latest deployment)
 * Component: dynamicControl1
 */

// ===== ASSESSOR GRID API FUNCTIONS =====

/**
 * Set the assessor grid configuration
 * @param {Object} config - Grid configuration object
 * @returns {Object} Success result
 */
function setAssessorGridConfig(config) {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found. Make sure the component is on the page.');
  }
  
  const configString = JSON.stringify(config);
  dynamicControl1.config = configString;
  
  console.log('✅ AssessorGrid config set:', config);
  return { success: true, config: config };
}

/**
 * Get the current assessor grid configuration
 * @returns {Object} Current configuration object
 */
function getAssessorGridConfig() {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found. Make sure the component is on the page.');
  }
  
  const configString = dynamicControl1.config || '';
  
  try {
    const config = configString ? JSON.parse(configString) : {};
    console.log('✅ AssessorGrid config retrieved:', config);
    return config;
  } catch (e) {
    console.warn('Config is not valid JSON, returning empty object');
    return {};
  }
}

/**
 * Set the assessor grid responses
 * @param {Object} responses - Responses object
 * @returns {Object} Success result
 */
function setAssessorGridResponses(responses) {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found. Make sure the component is on the page.');
  }
  
  const responsesString = JSON.stringify(responses);
  dynamicControl1.responses = responsesString;
  
  console.log('✅ AssessorGrid responses set:', responses);
  return { success: true, responses: responses };
}

/**
 * Get the current assessor grid responses
 * @returns {Object} Current responses object
 */
function getAssessorGridResponses() {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found. Make sure the component is on the page.');
  }
  
  const responsesString = dynamicControl1.responses || '{}';
  
  try {
    const responses = JSON.parse(responsesString);
    console.log('✅ AssessorGrid responses retrieved:', responses);
    return responses;
  } catch (e) {
    console.warn('Responses is not valid JSON, returning empty object');
    return {};
  }
}

/**
 * Clear all assessor grid responses
 * @returns {Object} Success result
 */
function clearAssessorGridResponses() {
  return setAssessorGridResponses({});
}

/**
 * Hide the assessor grid
 * @returns {Object} Success result
 */
function hideAssessorGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.setHidden !== 'function') {
    throw new Error('dynamicControl1 component or setHidden method not found');
  }
  
  dynamicControl1.setHidden(true);
  console.log('✅ AssessorGrid hidden');
  return { success: true, hidden: true };
}

/**
 * Show the assessor grid
 * @returns {Object} Success result
 */
function showAssessorGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.setHidden !== 'function') {
    throw new Error('dynamicControl1 component or setHidden method not found');
  }
  
  dynamicControl1.setHidden(false);
  console.log('✅ AssessorGrid shown');
  return { success: true, hidden: false };
}

/**
 * Scroll the assessor grid into view
 * @returns {Object} Success result
 */
function scrollToAssessorGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.scrollIntoView !== 'function') {
    throw new Error('dynamicControl1 component or scrollIntoView method not found');
  }
  
  dynamicControl1.scrollIntoView();
  console.log('✅ AssessorGrid scrolled into view');
  return { success: true, scrolled: true };
}

// ===== VISUAL UPDATE TEST FUNCTIONS =====

/**
 * Test visual updating of the assessor grid
 * This function will set a configuration and responses to verify visual changes
 * @returns {Object} Test results
 */
function testAssessorGridVisualUpdate() {
  console.log('🧪 Testing AssessorGrid visual updates...');
  
  try {
    // Step 1: Get initial state
    console.log('1. Getting initial state...');
    const initialConfig = getAssessorGridConfig();
    const initialResponses = getAssessorGridResponses();
    console.log('Initial config:', initialConfig);
    console.log('Initial responses:', initialResponses);
    
    // Step 2: Set a test configuration
    console.log('2. Setting test configuration...');
    const testConfig = {
      type: "checkbox",
      rows: ["Visual Test Question 1", "Visual Test Question 2", "Visual Test Question 3"],
      columns: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
    };
    
    setAssessorGridConfig(testConfig);
    console.log('✅ Test configuration set');
    
    // Step 3: Wait a moment for visual update
    setTimeout(() => {
      console.log('3. Setting test responses...');
      const testResponses = {
        "Visual Test Question 1": {"Agree": true},
        "Visual Test Question 2": {"Strongly Agree": true},
        "Visual Test Question 3": {"Neutral": true}
      };
      
      setAssessorGridResponses(testResponses);
      console.log('✅ Test responses set');
      
      // Step 4: Verify the changes
      setTimeout(() => {
        console.log('4. Verifying changes...');
        const newConfig = getAssessorGridConfig();
        const newResponses = getAssessorGridResponses();
        
        const configChanged = JSON.stringify(newConfig) !== JSON.stringify(initialConfig);
        const responsesChanged = JSON.stringify(newResponses) !== JSON.stringify(initialResponses);
        
        console.log('Config changed:', configChanged);
        console.log('Responses changed:', responsesChanged);
        console.log('New config:', newConfig);
        console.log('New responses:', newResponses);
        
        if (configChanged && responsesChanged) {
          console.log('🎉 Visual update test PASSED - Check the component for visual changes!');
        } else {
          console.log('⚠️ Visual update test PARTIAL - Data changed but check component visually');
        }
      }, 500);
    }, 500);
    
    return {
      success: true,
      message: 'Visual update test started - check console and component for results',
      testConfig: testConfig
    };
    
  } catch (error) {
    console.error('❌ Visual update test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a satisfaction survey for testing
 * @returns {Object} Success result
 */
function createSatisfactionSurvey() {
  const config = {
    type: "checkbox",
    rows: [
      "How satisfied are you with our service?",
      "Would you recommend us to others?",
      "How would you rate the user experience?",
      "How likely are you to use our service again?"
    ],
    columns: [
      "Strongly Agree",
      "Agree", 
      "Neutral",
      "Disagree",
      "Strongly Disagree"
    ]
  };
  
  return setAssessorGridConfig(config);
}

/**
 * Set sample responses for the satisfaction survey
 * @returns {Object} Success result
 */
function setSampleSurveyResponses() {
  const responses = {
    "How satisfied are you with our service?": {"Agree": true},
    "Would you recommend us to others?": {"Strongly Agree": true},
    "How would you rate the user experience?": {"Neutral": true},
    "How likely are you to use our service again?": {"Agree": true}
  };
  
  return setAssessorGridResponses(responses);
}

// ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====

if (typeof window !== 'undefined') {
  // Original assessorGrid API (updated)
  window.setAssessorGridConfig = setAssessorGridConfig;
  window.getAssessorGridConfig = getAssessorGridConfig;
  window.setAssessorGridResponses = setAssessorGridResponses;
  window.getAssessorGridResponses = getAssessorGridResponses;
  window.clearAssessorGridResponses = clearAssessorGridResponses;
  
  // Additional control functions
  window.hideAssessorGrid = hideAssessorGrid;
  window.showAssessorGrid = showAssessorGrid;
  window.scrollToAssessorGrid = scrollToAssessorGrid;
  
  // Testing functions
  window.testAssessorGridVisualUpdate = testAssessorGridVisualUpdate;
  window.createSatisfactionSurvey = createSatisfactionSurvey;
  window.setSampleSurveyResponses = setSampleSurveyResponses;
}

console.log('✅ AssessorGrid API loaded successfully!');
console.log('📋 Available functions:');
console.log('  - setAssessorGridConfig(config)');
console.log('  - getAssessorGridConfig()');
console.log('  - setAssessorGridResponses(responses)');
console.log('  - getAssessorGridResponses()');
console.log('  - clearAssessorGridResponses()');
console.log('  - hideAssessorGrid() / showAssessorGrid()');
console.log('  - scrollToAssessorGrid()');
console.log('  - testAssessorGridVisualUpdate() ← Test visual updates');
console.log('  - createSatisfactionSurvey() ← Quick test setup');

// ===== USAGE EXAMPLES =====

/*
// Example 1: Create a survey
setAssessorGridConfig({
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Yes", "No", "Maybe"]
});

// Example 2: Set responses
setAssessorGridResponses({
  "Question 1": {"Yes": true},
  "Question 2": {"Maybe": true}
});

// Example 3: Get current data
const config = getAssessorGridConfig();
const responses = getAssessorGridResponses();

// Example 4: Test visual updates
testAssessorGridVisualUpdate();

// Example 5: Quick satisfaction survey
createSatisfactionSurvey();
setSampleSurveyResponses();
*/
