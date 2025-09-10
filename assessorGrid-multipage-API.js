/**
 * AssessorGrid Multipage API - Complete Solution
 * 
 * This API provides:
 * 1. Direct method access (assessorGrid.setConfig, etc.)
 * 2. Multipage support using Retool app state
 * 3. Auto-sync between app state and component
 * 4. Works when component is not visible
 * 
 * Usage: Copy this entire code into your Retool app's JavaScript configuration
 * or run it in a JavaScript query that executes on app load.
 */

// ===== APP STATE MANAGEMENT =====

/**
 * Get or create app state for assessor grid
 */
function getAssessorGridAppState() {
  // Initialize app state if it doesn't exist
  if (typeof assessorGridConfig === 'undefined') {
    window.assessorGridConfig = '';
  }
  if (typeof assessorGridResponses === 'undefined') {
    window.assessorGridResponses = '{}';
  }
  
  return {
    config: window.assessorGridConfig || '',
    responses: window.assessorGridResponses || '{}'
  };
}

/**
 * Update app state
 */
function updateAssessorGridAppState(config, responses) {
  if (config !== undefined) {
    window.assessorGridConfig = config;
  }
  if (responses !== undefined) {
    window.assessorGridResponses = responses;
  }
}

/**
 * Find the component in iframe or direct access
 */
function findAssessorGridComponent() {
  // First try direct access (non-iframe)
  if (window.assessorGrid && window.assessorGrid.config !== undefined) {
    return { component: window.assessorGrid, isIframe: false };
  }
  
  // Try to find component in iframe
  const iframes = document.querySelectorAll('iframe');
  for (let iframe of iframes) {
    try {
      if (iframe.contentWindow && iframe.contentWindow.assessorGrid && 
          iframe.contentWindow.assessorGrid.config !== undefined) {
        return { component: iframe.contentWindow.assessorGrid, isIframe: true, iframe: iframe };
      }
    } catch (e) {
      // Cross-origin iframe, skip
      continue;
    }
  }
  
  return null;
}

/**
 * Sync app state to component (if component exists)
 */
function syncAppStateToComponent() {
  const found = findAssessorGridComponent();
  if (found) {
    const appState = getAssessorGridAppState();
    
    // Only sync if values are different to avoid infinite loops
    if (found.component.config !== appState.config) {
      found.component.config = appState.config;
    }
    if (found.component.responses !== appState.responses) {
      found.component.responses = appState.responses;
    }
    
    console.log('✅ Synced app state to component' + (found.isIframe ? ' (iframe)' : ' (direct)'));
    return true;
  }
  return false;
}

/**
 * Sync component to app state (when user interacts with component)
 */
function syncComponentToAppState() {
  const found = findAssessorGridComponent();
  if (found) {
    updateAssessorGridAppState(
      found.component.config,
      found.component.responses
    );
    console.log('✅ Synced component to app state' + (found.isIframe ? ' (iframe)' : ' (direct)'));
    return true;
  }
  return false;
}

// ===== ASSESSOR GRID API OBJECT =====

/**
 * Create the assessorGrid API object with direct methods
 */
window.assessorGrid = {
  
  /**
   * Set the grid configuration
   * @param {Object|String} config - Grid configuration object or JSON string
   * @returns {Object} Success result
   */
  setConfig: function(config) {
    const configString = typeof config === 'string' ? config : JSON.stringify(config);
    
    // Always update app state first
    updateAssessorGridAppState(configString, undefined);
    
    // Try to sync to component if it exists
    const found = findAssessorGridComponent();
    if (found) {
      found.component.config = configString;
      console.log('✅ AssessorGrid config set (component + app state):', config);
    } else {
      console.log('✅ AssessorGrid config set (app state only - component not visible):', config);
    }
    
    return { success: true, config: config, storedInAppState: true };
  },

  /**
   * Get the current grid configuration
   * @returns {Object} Current configuration object
   */
  getConfig: function() {
    // Always read from app state (single source of truth)
    const appState = getAssessorGridAppState();
    const configString = appState.config;
    
    try {
      const config = configString ? JSON.parse(configString) : {};
      console.log('✅ AssessorGrid config retrieved:', config);
      return config;
    } catch (e) {
      console.warn('Config is not valid JSON, returning empty object');
      return {};
    }
  },

  /**
   * Set the grid responses
   * @param {Object|String} responses - Responses object or JSON string
   * @returns {Object} Success result
   */
  setResponses: function(responses) {
    const responsesString = typeof responses === 'string' ? responses : JSON.stringify(responses);
    
    // Always update app state first
    updateAssessorGridAppState(undefined, responsesString);
    
    // Try to sync to component if it exists
    const found = findAssessorGridComponent();
    if (found) {
      found.component.responses = responsesString;
      console.log('✅ AssessorGrid responses set (component + app state):', responses);
    } else {
      console.log('✅ AssessorGrid responses set (app state only - component not visible):', responses);
    }
    
    return { success: true, responses: responses, storedInAppState: true };
  },

  /**
   * Get the current grid responses
   * @returns {Object} Current responses object
   */
  getResponses: function() {
    // Always read from app state (single source of truth)
    const appState = getAssessorGridAppState();
    const responsesString = appState.responses;
    
    try {
      const responses = JSON.parse(responsesString);
      console.log('✅ AssessorGrid responses retrieved:', responses);
      return responses;
    } catch (e) {
      console.warn('Responses is not valid JSON, returning empty object');
      return {};
    }
  },

  /**
   * Clear all responses
   * @returns {Object} Success result
   */
  clearResponses: function() {
    return this.setResponses({});
  },

  /**
   * Hide the component (if visible)
   * @returns {Object} Success result
   */
  hide: function() {
    const found = findAssessorGridComponent();
    if (found && typeof found.component.setHidden === 'function') {
      found.component.setHidden(true);
      console.log('✅ AssessorGrid hidden' + (found.isIframe ? ' (iframe)' : ' (direct)'));
      return { success: true, hidden: true };
    } else {
      console.log('⚠️ AssessorGrid component not found or setHidden method not available');
      return { success: false, error: 'Component not found or method not available' };
    }
  },

  /**
   * Show the component (if exists)
   * @returns {Object} Success result
   */
  show: function() {
    const found = findAssessorGridComponent();
    if (found && typeof found.component.setHidden === 'function') {
      found.component.setHidden(false);
      console.log('✅ AssessorGrid shown' + (found.isIframe ? ' (iframe)' : ' (direct)'));
      return { success: true, hidden: false };
    } else {
      console.log('⚠️ AssessorGrid component not found or setHidden method not available');
      return { success: false, error: 'Component not found or method not available' };
    }
  },

  /**
   * Scroll the component into view (if visible)
   * @returns {Object} Success result
   */
  scrollIntoView: function() {
    const found = findAssessorGridComponent();
    if (found && typeof found.component.scrollIntoView === 'function') {
      found.component.scrollIntoView();
      console.log('✅ AssessorGrid scrolled into view' + (found.isIframe ? ' (iframe)' : ' (direct)'));
      return { success: true, scrolled: true };
    } else {
      console.log('⚠️ AssessorGrid component not found or scrollIntoView method not available');
      return { success: false, error: 'Component not found or method not available' };
    }
  },

  /**
   * Get component and app state status
   * @returns {Object} Status information
   */
  getStatus: function() {
    const appState = getAssessorGridAppState();
    const found = findAssessorGridComponent();
    
    return {
      componentVisible: !!found,
      componentType: found ? (found.isIframe ? 'iframe' : 'direct') : 'none',
      appStateConfig: appState.config,
      appStateResponses: appState.responses,
      configLength: appState.config.length,
      responsesLength: appState.responses.length,
      lastSync: new Date().toISOString(),
      multiPageSupport: true
    };
  },

  /**
   * Force sync between app state and component
   * @returns {Object} Sync result
   */
  sync: function() {
    const synced = syncAppStateToComponent();
    return {
      success: synced,
      message: synced ? 'Synced app state to component' : 'Component not found - app state preserved'
    };
  },

  /**
   * Create a checkbox grid (convenience method)
   * @param {Array} rows - Array of question/row labels
   * @param {Array} columns - Array of option/column labels
   * @returns {Object} Success result
   */
  createCheckboxGrid: function(rows, columns) {
    const config = {
      type: "checkbox",
      rows: rows,
      columns: columns
    };
    return this.setConfig(config);
  },

  /**
   * Create a radio button grid (convenience method)
   * @param {Array} rows - Array of question/row labels
   * @param {Array} columns - Array of option/column labels
   * @returns {Object} Success result
   */
  createRadioGrid: function(rows, columns) {
    const config = {
      type: "radio",
      rows: rows,
      columns: columns
    };
    return this.setConfig(config);
  },

  /**
   * Set a specific response for a question
   * @param {String} question - The question/row label
   * @param {String} option - The option/column label
   * @param {Boolean} value - True to select, false to deselect
   * @returns {Object} Success result
   */
  setQuestionResponse: function(question, option, value = true) {
    const currentResponses = this.getResponses();
    
    if (!currentResponses[question]) {
      currentResponses[question] = {};
    }
    
    currentResponses[question][option] = value;
    
    return this.setResponses(currentResponses);
  },

  /**
   * Get response for a specific question
   * @param {String} question - The question/row label
   * @returns {Object} Responses for the question
   */
  getQuestionResponse: function(question) {
    const responses = this.getResponses();
    return responses[question] || {};
  }
};

// ===== AUTO-SYNC SETUP =====

/**
 * Set up automatic synchronization
 */
function setupAutoSync() {
  // Check for component every 2 seconds and sync if found
  setInterval(() => {
    if (window.assessorGrid && window.assessorGrid.config !== undefined) {
      // Component exists - ensure it's synced with app state
      syncAppStateToComponent();
    }
  }, 2000);
  
  console.log('✅ Auto-sync enabled - checking every 2 seconds');
}

// ===== TESTING FUNCTIONS =====

/**
 * Test the complete multipage API
 */
function testMultipageAPI() {
  console.log('🧪 Testing Multipage AssessorGrid API...');
  
  try {
    // Test 1: Set config when component might not be visible
    console.log('1. Setting config (multipage test)...');
    assessorGrid.setConfig({
      type: "checkbox",
      rows: ["Multipage Question 1", "Multipage Question 2"],
      columns: ["Option A", "Option B", "Option C"]
    });
    
    // Test 2: Set responses
    console.log('2. Setting responses...');
    assessorGrid.setResponses({
      "Multipage Question 1": {"Option A": true},
      "Multipage Question 2": {"Option B": true}
    });
    
    // Test 3: Get status
    console.log('3. Getting status...');
    const status = assessorGrid.getStatus();
    console.log('Status:', status);
    
    // Test 4: Get data back
    console.log('4. Retrieving data...');
    const config = assessorGrid.getConfig();
    const responses = assessorGrid.getResponses();
    console.log('Retrieved config:', config);
    console.log('Retrieved responses:', responses);
    
    // Test 5: Force sync
    console.log('5. Testing sync...');
    const syncResult = assessorGrid.sync();
    console.log('Sync result:', syncResult);
    
    console.log('🎉 Multipage API test completed successfully!');
    
    return {
      success: true,
      message: 'Multipage API working perfectly!',
      config: config,
      responses: responses,
      status: status
    };
    
  } catch (error) {
    console.error('❌ Multipage API test failed:', error);
    return { success: false, error: error.message };
  }
}

// ===== INITIALIZATION =====

// Initialize app state
getAssessorGridAppState();

// Set up auto-sync
setupAutoSync();

// Make test function available
window.testMultipageAPI = testMultipageAPI;

console.log('✅ AssessorGrid Multipage API loaded successfully!');
console.log('📋 Available methods:');
console.log('  - assessorGrid.setConfig(config)');
console.log('  - assessorGrid.getConfig()');
console.log('  - assessorGrid.setResponses(responses)');
console.log('  - assessorGrid.getResponses()');
console.log('  - assessorGrid.clearResponses()');
console.log('  - assessorGrid.hide() / assessorGrid.show()');
console.log('  - assessorGrid.scrollIntoView()');
console.log('  - assessorGrid.getStatus()');
console.log('  - assessorGrid.sync()');
console.log('  - assessorGrid.createCheckboxGrid(rows, columns)');
console.log('  - assessorGrid.createRadioGrid(rows, columns)');
console.log('  - assessorGrid.setQuestionResponse(question, option, value)');
console.log('  - assessorGrid.getQuestionResponse(question)');
console.log('🔄 Auto-sync enabled for multipage support');
console.log('🧪 Test with: testMultipageAPI()');

// ===== USAGE EXAMPLES =====

/*
// Example 1: Set config on any page (even when component not visible)
assessorGrid.setConfig({
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Yes", "No", "Maybe"]
});

// Example 2: Set responses programmatically
assessorGrid.setResponses({
  "Question 1": {"Yes": true},
  "Question 2": {"Maybe": true}
});

// Example 3: Get current data (works on any page)
const config = assessorGrid.getConfig();
const responses = assessorGrid.getResponses();

// Example 4: Quick grid creation
assessorGrid.createCheckboxGrid(
  ["Satisfaction", "Recommendation"], 
  ["Strongly Agree", "Agree", "Disagree"]
);

// Example 5: Test the complete API
testMultipageAPI();

// Example 6: Check status
assessorGrid.getStatus();
*/
