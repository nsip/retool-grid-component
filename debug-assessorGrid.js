console.log('🔍 AssessorGrid Debug Script Starting...');

console.log('1. assessorGrid existence check:');
console.log('   typeof assessorGrid:', typeof assessorGrid);
console.log('   assessorGrid:', assessorGrid);

if (typeof assessorGrid === 'object' && assessorGrid !== null) {
  console.log('2. assessorGrid properties:');
  console.log('   Object.keys(assessorGrid):', Object.keys(assessorGrid));
  console.log('   Object.getOwnPropertyNames(assessorGrid):', Object.getOwnPropertyNames(assessorGrid));
  
  const expectedMethods = ['setConfig', 'getConfig', 'setResponses', 'getResponses', 'getStatus'];
  expectedMethods.forEach(method => {
    console.log(`   assessorGrid.${method}:`, typeof assessorGrid[method]);
  });
} else {
  console.log('2. assessorGrid is not a valid object');
}

console.log('3. window.assessorGrid check:');
console.log('   typeof window.assessorGrid:', typeof window.assessorGrid);
console.log('   window.assessorGrid === assessorGrid:', window.assessorGrid === assessorGrid);

console.log('4. Checking for potential conflicts:');
console.log('   window.assessorGridConfig:', typeof window.assessorGridConfig);
console.log('   window.assessorGridResponses:', typeof window.assessorGridResponses);

console.log('5. Testing manual API creation:');
try {
  const testAPI = {
    setConfig: function(config) { return { success: true, test: true }; },
    getConfig: function() { return {}; }
  };
  window.testAssessorGrid = testAPI;
  console.log('   Manual API creation: SUCCESS');
  console.log('   testAssessorGrid.setConfig:', typeof testAssessorGrid.setConfig);
  console.log('   Test call result:', testAssessorGrid.setConfig({}));
} catch (e) {
  console.log('   Manual API creation: FAILED', e);
}

console.log('6. Checking for iframe components:');
const iframes = document.querySelectorAll('iframe');
console.log('   Found iframes:', iframes.length);
iframes.forEach((iframe, idx) => {
  try {
    console.log(`   Iframe ${idx}:`, iframe.src);
    if (iframe.contentWindow) {
      console.log(`     Has contentWindow: true`);
      console.log(`     contentWindow.assessorGrid:`, typeof iframe.contentWindow.assessorGrid);
    }
  } catch (e) {
    console.log(`   Iframe ${idx}: Cross-origin, cannot access`);
  }
});

console.log('7. Checking for direct component access:');
if (window.assessorGrid && window.assessorGrid.config !== undefined) {
  console.log('   Direct component found with config property');
} else {
  console.log('   No direct component with config property found');
}

console.log('🔍 Debug script completed. Please share these results for diagnosis.');
