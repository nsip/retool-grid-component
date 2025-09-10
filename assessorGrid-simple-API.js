/**
 * AssessorGrid Simple API - Robust Version
 * 
 * This is a simplified, more robust version of the API that's easier to debug.
 * Use this if the full multipage API is having loading issues.
 */

(function() {
  'use strict';
  
  console.log('🚀 Loading AssessorGrid Simple API...');
  
  // Ensure we don't conflict with existing objects
  if (window.assessorGrid && typeof window.assessorGrid === 'object') {
    console.warn('⚠️ assessorGrid already exists, backing up as assessorGrid_backup');
    window.assessorGrid_backup = window.assessorGrid;
  }
  
  // Initialize app state variables
  function initAppState() {
    if (typeof window.assessorGridConfig === 'undefined') {
      window.assessorGridConfig = '';
    }
    if (typeof window.assessorGridResponses === 'undefined') {
      window.assessorGridResponses = '{}';
    }
  }
  
  // Find component (simplified version)
  function findComponent() {
    // Try direct access first
    const directComponents = document.querySelectorAll('[data-component-name="assessorGrid"]');
    if (directComponents.length > 0) {
      return { element: directComponents[0], type: 'direct' };
    }
    
    // Try iframe access
    const iframes = document.querySelectorAll('iframe');
    for (let iframe of iframes) {
      try {
        if (iframe.contentWindow && iframe.contentWindow.document) {
          const iframeComponents = iframe.contentWindow.document.querySelectorAll('[data-component-name="assessorGrid"]');
          if (iframeComponents.length > 0) {
            return { element: iframe, iframe: iframe, type: 'iframe' };
          }
        }
      } catch (e) {
        // Cross-origin, skip
      }
    }
    
    return null;
  }
  
  // Create the API object
  const api = {
    version: '1.0-simple',
    
    setConfig: function(config) {
      try {
        const configString = typeof config === 'string' ? config : JSON.stringify(config);
        window.assessorGridConfig = configString;
        
        console.log('✅ Config set in app state:', config);
        
        // Try to update component if found
        const component = findComponent();
        if (component) {
          console.log('✅ Component found, type:', component.type);
          // Component sync would go here
        } else {
          console.log('ℹ️ Component not found, config stored in app state');
        }
        
        return { success: true, config: config };
      } catch (error) {
        console.error('❌ setConfig failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    getConfig: function() {
      try {
        const configString = window.assessorGridConfig || '';
        const config = configString ? JSON.parse(configString) : {};
        console.log('✅ Config retrieved:', config);
        return config;
      } catch (error) {
        console.error('❌ getConfig failed:', error);
        return {};
      }
    },
    
    setResponses: function(responses) {
      try {
        const responsesString = typeof responses === 'string' ? responses : JSON.stringify(responses);
        window.assessorGridResponses = responsesString;
        
        console.log('✅ Responses set in app state:', responses);
        
        // Try to update component if found
        const component = findComponent();
        if (component) {
          console.log('✅ Component found, type:', component.type);
          // Component sync would go here
        } else {
          console.log('ℹ️ Component not found, responses stored in app state');
        }
        
        return { success: true, responses: responses };
      } catch (error) {
        console.error('❌ setResponses failed:', error);
        return { success: false, error: error.message };
      }
    },
    
    getResponses: function() {
      try {
        const responsesString = window.assessorGridResponses || '{}';
        const responses = JSON.parse(responsesString);
        console.log('✅ Responses retrieved:', responses);
        return responses;
      } catch (error) {
        console.error('❌ getResponses failed:', error);
        return {};
      }
    },
    
    clearResponses: function() {
      return this.setResponses({});
    },
    
    getStatus: function() {
      const component = findComponent();
      return {
        apiVersion: this.version,
        componentFound: !!component,
        componentType: component ? component.type : 'none',
        appStateConfig: window.assessorGridConfig || '',
        appStateResponses: window.assessorGridResponses || '{}',
        timestamp: new Date().toISOString()
      };
    },
    
    // Test function
    test: function() {
      console.log('🧪 Testing Simple API...');
      
      try {
        // Test config
        this.setConfig({ type: 'test', rows: ['Test'], columns: ['A', 'B'] });
        const config = this.getConfig();
        
        // Test responses
        this.setResponses({ 'Test': { 'A': true } });
        const responses = this.getResponses();
        
        // Test status
        const status = this.getStatus();
        
        console.log('✅ Simple API test completed successfully');
        return {
          success: true,
          config: config,
          responses: responses,
          status: status
        };
      } catch (error) {
        console.error('❌ Simple API test failed:', error);
        return { success: false, error: error.message };
      }
    }
  };
  
  // Initialize
  initAppState();
  
  // Set the API
  window.assessorGrid = api;
  
  // Make test function available globally
  window.testSimpleAPI = function() {
    return window.assessorGrid.test();
  };
  
  console.log('✅ AssessorGrid Simple API loaded successfully!');
  console.log('📋 Available methods: setConfig, getConfig, setResponses, getResponses, clearResponses, getStatus, test');
  console.log('🧪 Test with: testSimpleAPI() or assessorGrid.test()');
  
  // Verify the API is working
  setTimeout(() => {
    console.log('🔍 API verification:');
    console.log('   typeof assessorGrid:', typeof window.assessorGrid);
    console.log('   assessorGrid.setConfig:', typeof window.assessorGrid.setConfig);
    console.log('   Object.keys(assessorGrid):', Object.keys(window.assessorGrid));
  }, 100);
  
})();
