/**
 * Retool Component API - Clean PostMessage Interface
 * 
 * This module provides a simple API for communicating with Retool custom components
 * that implement PostMessage communication.
 * 
 * Usage:
 *   const api = new RetoolComponentAPI();
 *   await api.setValue('componentName', 'Hello World');
 *   const value = await api.getValue('componentName');
 */

class RetoolComponentAPI {
  constructor() {
    this.pendingRequests = new Map();
    this.requestId = 0;
    this.setupMessageListener();
  }

  /**
   * Set up the global message listener for component responses
   */
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE') {
        const { id, success, payload, action } = event.data;
        
        if (this.pendingRequests.has(id)) {
          const { resolve, reject } = this.pendingRequests.get(id);
          this.pendingRequests.delete(id);
          
          if (success) {
            resolve(payload);
          } else {
            reject(new Error(`Component ${action} failed: ${payload?.error || 'Unknown error'}`));
          }
        }
      }
    });
  }

  /**
   * Get the iframe containing the Retool component
   * @param {string} componentName - Optional component identifier
   * @returns {HTMLIFrameElement|null}
   */
  getComponentIframe(componentName = null) {
    // Try to find iframe by component name first
    if (componentName) {
      const namedIframe = document.querySelector(`iframe[data-component="${componentName}"]`);
      if (namedIframe) return namedIframe;
    }
    
    // Fallback to finding any Retool iframe
    const iframe = document.querySelector('iframe[src*="retool"]') || 
                   document.querySelector('iframe[src*="custom-component"]') ||
                   document.querySelector('iframe'); // Last resort
    
    return iframe;
  }

  /**
   * Send a command to a component and wait for response
   * @param {string} componentName - Component identifier
   * @param {string} action - Action to perform (setValue, getValue, etc.)
   * @param {any} payload - Data to send with the command
   * @returns {Promise<any>} Response from the component
   */
  sendCommand(componentName, action, payload = null) {
    return new Promise((resolve, reject) => {
      const iframe = this.getComponentIframe(componentName);
      
      if (!iframe || !iframe.contentWindow) {
        reject(new Error(`Component iframe not found for: ${componentName}`));
        return;
      }

      const id = `req-${++this.requestId}`;
      
      // Store the promise resolvers
      this.pendingRequests.set(id, { resolve, reject });
      
      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout for ${action} on ${componentName}`));
        }
      }, 5000); // 5 second timeout
      
      // Send the command
      const message = {
        type: 'RETOOL_COMPONENT_COMMAND',
        action: action,
        payload: payload,
        id: id,
        target: componentName
      };
      
      iframe.contentWindow.postMessage(message, '*');
    });
  }

  /**
   * Set a value in the component
   * @param {string} componentName - Component identifier
   * @param {any} value - Value to set
   * @returns {Promise<any>} Response from component
   */
  async setValue(componentName, value) {
    return this.sendCommand(componentName, 'setValue', { value });
  }

  /**
   * Get the current value from the component
   * @param {string} componentName - Component identifier
   * @returns {Promise<any>} Current value from component
   */
  async getValue(componentName) {
    const response = await this.sendCommand(componentName, 'getValue');
    return response.value;
  }

  /**
   * Set configuration in the component
   * @param {string} componentName - Component identifier
   * @param {object} config - Configuration object
   * @returns {Promise<any>} Response from component
   */
  async setConfig(componentName, config) {
    return this.sendCommand(componentName, 'setConfig', { config });
  }

  /**
   * Get configuration from the component
   * @param {string} componentName - Component identifier
   * @returns {Promise<object>} Configuration object from component
   */
  async getConfig(componentName) {
    const response = await this.sendCommand(componentName, 'getConfig');
    return response.config;
  }

  /**
   * Set responses/data in the component
   * @param {string} componentName - Component identifier
   * @param {any} responses - Responses data
   * @returns {Promise<any>} Response from component
   */
  async setResponses(componentName, responses) {
    return this.sendCommand(componentName, 'setResponses', { responses });
  }

  /**
   * Get responses/data from the component
   * @param {string} componentName - Component identifier
   * @returns {Promise<any>} Responses data from component
   */
  async getResponses(componentName) {
    const response = await this.sendCommand(componentName, 'getResponses');
    return response.responses;
  }

  /**
   * Send a custom command to the component
   * @param {string} componentName - Component identifier
   * @param {string} action - Custom action name
   * @param {any} payload - Custom payload
   * @returns {Promise<any>} Response from component
   */
  async customCommand(componentName, action, payload) {
    return this.sendCommand(componentName, action, payload);
  }

  /**
   * Check if a component is available and responding
   * @param {string} componentName - Component identifier
   * @returns {Promise<boolean>} True if component responds
   */
  async ping(componentName) {
    try {
      await this.sendCommand(componentName, 'ping');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get component status and information
   * @param {string} componentName - Component identifier
   * @returns {Promise<object>} Component status information
   */
  async getStatus(componentName) {
    return this.sendCommand(componentName, 'getStatus');
  }
}

// Convenience functions for quick usage
const retoolAPI = new RetoolComponentAPI();

/**
 * Quick setValue function
 * @param {string} componentName - Component identifier
 * @param {any} value - Value to set
 * @returns {Promise<any>}
 */
window.setRetoolComponentValue = (componentName, value) => {
  return retoolAPI.setValue(componentName, value);
};

/**
 * Quick getValue function
 * @param {string} componentName - Component identifier
 * @returns {Promise<any>}
 */
window.getRetoolComponentValue = (componentName) => {
  return retoolAPI.getValue(componentName);
};

/**
 * Quick setConfig function
 * @param {string} componentName - Component identifier
 * @param {object} config - Configuration object
 * @returns {Promise<any>}
 */
window.setRetoolComponentConfig = (componentName, config) => {
  return retoolAPI.setConfig(componentName, config);
};

/**
 * Quick getConfig function
 * @param {string} componentName - Component identifier
 * @returns {Promise<object>}
 */
window.getRetoolComponentConfig = (componentName) => {
  return retoolAPI.getConfig(componentName);
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RetoolComponentAPI;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.RetoolComponentAPI = RetoolComponentAPI;
}

/**
 * Usage Examples:
 * 
 * // Using the class directly
 * const api = new RetoolComponentAPI();
 * await api.setValue('myComponent', 'Hello World');
 * const value = await api.getValue('myComponent');
 * 
 * // Using convenience functions
 * await setRetoolComponentValue('myComponent', 'Hello World');
 * const value = await getRetoolComponentValue('myComponent');
 * 
 * // Using custom commands
 * await api.customCommand('myComponent', 'refresh', { force: true });
 * 
 * // Checking component availability
 * const isAvailable = await api.ping('myComponent');
 * 
 * // Getting component status
 * const status = await api.getStatus('myComponent');
 */
