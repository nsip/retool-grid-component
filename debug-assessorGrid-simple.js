console.log('AssessorGrid Debug Script Starting...');

console.log('1. assessorGrid existence check:');
console.log('typeof assessorGrid:', typeof assessorGrid);
console.log('assessorGrid:', assessorGrid);

if (typeof assessorGrid === 'object' && assessorGrid !== null) {
  console.log('2. assessorGrid properties:');
  console.log('Object.keys(assessorGrid):', Object.keys(assessorGrid));
  console.log('Object.getOwnPropertyNames(assessorGrid):', Object.getOwnPropertyNames(assessorGrid));
  
  var expectedMethods = ['setConfig', 'getConfig', 'setResponses', 'getResponses', 'getStatus'];
  for (var i = 0; i < expectedMethods.length; i++) {
    var method = expectedMethods[i];
    console.log('assessorGrid.' + method + ':', typeof assessorGrid[method]);
  }
} else {
  console.log('2. assessorGrid is not a valid object');
}

console.log('3. window.assessorGrid check:');
console.log('typeof window.assessorGrid:', typeof window.assessorGrid);
console.log('window.assessorGrid === assessorGrid:', window.assessorGrid === assessorGrid);

console.log('4. Checking for potential conflicts:');
console.log('window.assessorGridConfig:', typeof window.assessorGridConfig);
console.log('window.assessorGridResponses:', typeof window.assessorGridResponses);

console.log('5. Testing manual API creation:');
try {
  var testAPI = {
    setConfig: function(config) { return { success: true, test: true }; },
    getConfig: function() { return {}; }
  };
  window.testAssessorGrid = testAPI;
  console.log('Manual API creation: SUCCESS');
  console.log('testAssessorGrid.setConfig:', typeof testAssessorGrid.setConfig);
  console.log('Test call result:', testAssessorGrid.setConfig({}));
} catch (e) {
  console.log('Manual API creation: FAILED', e);
}

console.log('Debug script completed.');
