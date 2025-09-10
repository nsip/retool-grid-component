console.log('assessorGrid exists:', typeof assessorGrid);
console.log('assessorGrid object:', assessorGrid);
console.log('assessorGrid keys:', Object.keys(assessorGrid));
console.log('setConfig method:', typeof assessorGrid.setConfig);
if (typeof assessorGrid.setConfig === 'function') {
  console.log('Testing setConfig...');
  var result = assessorGrid.setConfig({type: 'test'});
  console.log('setConfig result:', result);
} else {
  console.log('setConfig is not a function - object is:', assessorGrid);
}
