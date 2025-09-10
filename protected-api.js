console.log('🛡️ Protected API loading...');

// Create API with protection against overwriting
function createProtectedAPI() {
  const api = {
    test: 'protected version',
    setConfig: function(config) {
      console.log('Protected setConfig called with:', config);
      return {success: true, config: config};
    },
    getConfig: function() {
      console.log('Protected getConfig called');
      return {test: 'protected config'};
    }
  };
  
  // Protect against overwriting
  Object.defineProperty(window, 'assessorGrid', {
    value: api,
    writable: false,
    configurable: false
  });
  
  return api;
}

const protectedAPI = createProtectedAPI();

console.log('✅ Protected API created');
console.log('assessorGrid type:', typeof window.assessorGrid);
console.log('assessorGrid keys:', Object.keys(window.assessorGrid));
console.log('setConfig type:', typeof window.assessorGrid.setConfig);

// Test protection
setTimeout(function() {
  console.log('🧪 Testing protection...');
  try {
    window.assessorGrid = {test: 'overwrite attempt'};
    console.log('❌ Protection failed - object was overwritten');
  } catch (e) {
    console.log('✅ Protection working - cannot overwrite');
  }
  console.log('assessorGrid after overwrite attempt:', window.assessorGrid);
  console.log('setConfig still exists:', typeof window.assessorGrid.setConfig);
}, 1000);
