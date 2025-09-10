console.log('🔍 Diagnostic API starting...');

window.assessorGrid = {
  test: 'diagnostic version',
  setConfig: function(config) {
    console.log('setConfig called with:', config);
    return {success: true, config: config};
  },
  getConfig: function() {
    console.log('getConfig called');
    return {test: 'config'};
  }
};

console.log('✅ Diagnostic API created');
console.log('assessorGrid type:', typeof window.assessorGrid);
console.log('assessorGrid keys:', Object.keys(window.assessorGrid));
console.log('setConfig type:', typeof window.assessorGrid.setConfig);

setTimeout(function() {
  console.log('🕐 After 1 second:');
  console.log('assessorGrid type:', typeof window.assessorGrid);
  console.log('assessorGrid keys:', Object.keys(window.assessorGrid || {}));
  console.log('setConfig type:', typeof (window.assessorGrid && window.assessorGrid.setConfig));
}, 1000);

setTimeout(function() {
  console.log('🕐 After 3 seconds:');
  console.log('assessorGrid type:', typeof window.assessorGrid);
  console.log('assessorGrid keys:', Object.keys(window.assessorGrid || {}));
  console.log('setConfig type:', typeof (window.assessorGrid && window.assessorGrid.setConfig));
}, 3000);
