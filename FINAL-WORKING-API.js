/**
 * FINAL WORKING API for dynamicControl1
 * 
 * This is the production-ready API that provides complete programmatic control
 * of your Retool custom component. 
 * 
 * IMPORTANT: Component only has 2 methods: scrollIntoView, setHidden
 * We set properties directly: config, responses
 */

// ===== PRODUCTION API FUNCTIONS =====

/**
 * Set the grid configuration
 * @param {Object|String} config - Grid configuration object or JSON string
 * @returns {Object} Success result with the set configuration
 */
function setGridConfig(config) {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found');
  }
  
  const configString = typeof config === 'string' ? config : JSON.stringify(config);
  
  // Direct property assignment (confirmed working)
  dynamicControl1.config = configString;
  
  console.log('✅ Grid config set:', configString);
  return { success: true, config: configString };
}

/**
 * Get the current grid configuration
 * @returns {Object} Parsed configuration object
 */
function getGridConfig() {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found');
  }
  
  const configString = dynamicControl1.config || '';
  
  try {
    return configString ? JSON.parse(configString) : {};
  } catch (e) {
    console.warn('Config is not valid JSON, returning as string:', configString);
    return configString;
  }
}

/**
 * Set the grid responses
 * @param {Object|String} responses - Responses object or JSON string
 * @returns {Object} Success result with the set responses
 */
function setGridResponses(responses) {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found');
  }
  
  const responsesString = typeof responses === 'string' ? responses : JSON.stringify(responses);
  
  // Direct property assignment (confirmed working)
  dynamicControl1.responses = responsesString;
  
  console.log('✅ Grid responses set:', responsesString);
  return { success: true, responses: responsesString };
}

/**
 * Get the current grid responses
 * @returns {Object} Parsed responses object
 */
function getGridResponses() {
  if (!dynamicControl1) {
    throw new Error('dynamicControl1 component not found');
  }
  
  const responsesString = dynamicControl1.responses || '{}';
  
  try {
    return JSON.parse(responsesString);
  } catch (e) {
    console.warn('Responses is not valid JSON, returning as string:', responsesString);
    return responsesString;
  }
}

/**
 * Hide the component
 * @returns {Object} Success result
 */
function hideGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.setHidden !== 'function') {
    throw new Error('dynamicControl1 component or setHidden method not found');
  }
  
  dynamicControl1.setHidden(true);
  console.log('✅ Grid hidden');
  return { success: true, hidden: true };
}

/**
 * Show the component
 * @returns {Object} Success result
 */
function showGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.setHidden !== 'function') {
    throw new Error('dynamicControl1 component or setHidden method not found');
  }
  
  dynamicControl1.setHidden(false);
  console.log('✅ Grid shown');
  return { success: true, hidden: false };
}

/**
 * Scroll the component into view
 * @returns {Object} Success result
 */
function scrollToGrid() {
  if (!dynamicControl1 || typeof dynamicControl1.scrollIntoView !== 'function') {
    throw new Error('dynamicControl1 component or scrollIntoView method not found');
  }
  
  dynamicControl1.scrollIntoView();
  console.log('✅ Grid scrolled into view');
  return { success: true, scrolled: true };
}

/**
 * Clear all responses
 * @returns {Object} Success result
 */
function clearGridResponses() {
  return setGridResponses({});
}

/**
 * Get component status and information
 * @returns {Object} Component status information
 */
function getGridStatus() {
  if (!dynamicControl1) {
    return { available: false, error: 'Component not found' };
  }
  
  return {
    available: true,
    componentType: dynamicControl1.pluginType,
    configLength: (dynamicControl1.config || '').length,
    responsesLength: (dynamicControl1.responses || '{}').length,
    properties: Object.keys(dynamicControl1),
    availableMethods: ['scrollIntoView', 'setHidden'], // Only these 2 methods exist
    heightType: dynamicControl1.heightType,
    id: dynamicControl1.id
  };
}

// ===== CONVENIENCE FUNCTIONS =====

/**
 * Create a checkbox grid
 * @param {Array} rows - Array of question/row labels
 * @param {Array} columns - Array of option/column labels
 * @returns {Object} Success result
 */
function createCheckboxGrid(rows, columns) {
  const config = {
    type: "checkbox",
    rows: rows,
    columns: columns
  };
  
  return setGridConfig(config);
}

/**
 * Create a radio button grid
 * @param {Array} rows - Array of question/row labels
 * @param {Array} columns - Array of option/column labels
 * @returns {Object} Success result
 */
function createRadioGrid(rows, columns) {
  const config = {
    type: "radio",
    rows: rows,
    columns: columns
  };
  
  return setGridConfig(config);
}

/**
 * Set a specific response for a question
 * @param {String} question - The question/row label
 * @param {String} option - The option/column label
 * @param {Boolean} value - True to select, false to deselect
 * @returns {Object} Success result
 */
function setQuestionResponse(question, option, value = true) {
  const currentResponses = getGridResponses();
  
  if (!currentResponses[question]) {
    currentResponses[question] = {};
  }
  
  currentResponses[question][option] = value;
  
  return setGridResponses(currentResponses);
}

/**
 * Get response for a specific question
 * @param {String} question - The question/row label
 * @returns {Object} Responses for the question
 */
function getQuestionResponse(question) {
  const responses = getGridResponses();
  return responses[question] || {};
}

// ===== COMPLETE API TEST =====

function testCompleteAPI() {
  console.log('🧪 Testing Complete API with all available methods...');
  
  try {
    // Test 1: Component status
    console.log('1. Getting component status...');
    const status = getGridStatus();
    console.log('Component status:', status);
    
    // Test 2: Create a grid
    console.log('2. Creating test grid...');
    createCheckboxGrid(
      ["Question 1", "Question 2", "Question 3"],
      ["Option A", "Option B", "Option C"]
    );
    
    // Test 3: Set responses
    console.log('3. Setting test responses...');
    setQuestionResponse("Question 1", "Option A", true);
    setQuestionResponse("Question 2", "Option B", true);
    setQuestionResponse("Question 3", "Option C", true);
    
    // Test 4: Get responses
    console.log('4. Getting responses...');
    const responses = getGridResponses();
    console.log('All responses:', responses);
    
    // Test 5: Test available methods
    console.log('5. Testing available component methods...');
    
    // Test scrollIntoView
    console.log('   Testing scrollIntoView...');
    scrollToGrid();
    
    // Test setHidden (hide then show)
    console.log('   Testing setHidden (hide)...');
    hideGrid();
    
    setTimeout(() => {
      console.log('   Testing setHidden (show)...');
      showGrid();
    }, 1000);
    
    console.log('🎉 Complete API test finished successfully!');
    
    return {
      success: true,
      message: 'Complete API working perfectly!',
      status: status,
      responses: responses,
      methodsTested: ['scrollIntoView', 'setHidden'],
      propertiesUsed: ['config', 'responses']
    };
    
  } catch (error) {
    console.error('❌ Complete API test failed:', error);
    return { success: false, error: error.message };
  }
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.setGridConfig = setGridConfig;
  window.getGridConfig = getGridConfig;
  window.setGridResponses = setGridResponses;
  window.getGridResponses = getGridResponses;
  window.clearGridResponses = clearGridResponses;
  window.getGridStatus = getGridStatus;
  window.createCheckboxGrid = createCheckboxGrid;
  window.createRadioGrid = createRadioGrid;
  window.setQuestionResponse = setQuestionResponse;
  window.getQuestionResponse = getQuestionResponse;
  window.hideGrid = hideGrid;
  window.showGrid = showGrid;
  window.scrollToGrid = scrollToGrid;
  window.testCompleteAPI = testCompleteAPI;
}

console.log('✅ Final Working API loaded successfully!');
console.log('Available functions: setGridConfig, getGridConfig, setGridResponses, getGridResponses, createCheckboxGrid, createRadioGrid, setQuestionResponse, getQuestionResponse, clearGridResponses, getGridStatus, hideGrid, showGrid, scrollToGrid');
console.log('Component methods available: scrollIntoView, setHidden');
console.log('Properties used: config, responses');

// Uncomment to test the complete API:
// return testCompleteAPI();
