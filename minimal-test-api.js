console.log('🚀 Minimal API loading...');
window.assessorGrid = {
  test: 'minimal version working',
  setConfig: function(config) {
    console.log('Minimal setConfig called with:', config);
    return Promise.resolve({success: true, config: config});
  }
};
console.log('✅ Minimal API loaded! Type: ' + typeof window.assessorGrid);
