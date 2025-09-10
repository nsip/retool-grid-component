console.log('🔬 Final debug test...');

// Test 1: Direct function call
window.testFunction = function() {
  console.log('Direct function works!');
  return 'success';
};

console.log('Test 1 - Direct function:');
console.log('typeof testFunction:', typeof testFunction);
console.log('Calling testFunction():', testFunction());

// Test 2: Object method
window.testObject = {
  method: function() {
    console.log('Object method works!');
    return 'success';
  }
};

console.log('Test 2 - Object method:');
console.log('typeof testObject.method:', typeof testObject.method);
console.log('Calling testObject.method():', testObject.method());

// Test 3: Check if assessorGrid is in a different scope
console.log('Test 3 - Scope check:');
console.log('window.assessorGrid === assessorGrid:', window.assessorGrid === assessorGrid);
console.log('window.assessorGrid.setConfig === assessorGrid.setConfig:', window.assessorGrid.setConfig === assessorGrid.setConfig);

// Test 4: Try different ways to call the method
console.log('Test 4 - Different call methods:');
try {
  console.log('Method 1 - Direct call:', assessorGrid.setConfig({test: 1}));
} catch (e) {
  console.log('Method 1 failed:', e.message);
}

try {
  console.log('Method 2 - Window call:', window.assessorGrid.setConfig({test: 2}));
} catch (e) {
  console.log('Method 2 failed:', e.message);
}

try {
  const method = assessorGrid.setConfig;
  console.log('Method 3 - Extracted method:', method({test: 3}));
} catch (e) {
  console.log('Method 3 failed:', e.message);
}

try {
  console.log('Method 4 - Apply call:', assessorGrid.setConfig.apply(assessorGrid, [{test: 4}]));
} catch (e) {
  console.log('Method 4 failed:', e.message);
}
