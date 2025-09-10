/**
 * Comprehensive Iframe Test for dynamicControl1
 * 
 * This script checks for iframes in different container scenarios
 * and tests both iframe and direct access approaches.
 */

// Enhanced iframe detection that looks deeper
function findAllIframes() {
  console.log('🔍 Comprehensive iframe search...');
  
  // Method 1: Standard iframe search
  const standardIframes = document.querySelectorAll('iframe');
  console.log(`1. Standard iframe search: ${standardIframes.length} found`);
  
  // Method 2: Look inside containers and shadow DOM
  const containers = document.querySelectorAll('div, section, article, main, [class*="container"], [class*="component"], [data-testid]');
  let containerIframes = [];
  
  containers.forEach((container, index) => {
    const iframesInContainer = container.querySelectorAll('iframe');
    if (iframesInContainer.length > 0) {
      console.log(`2. Container ${index} has ${iframesInContainer.length} iframes:`, container);
      containerIframes.push(...iframesInContainer);
    }
    
    // Check shadow DOM
    if (container.shadowRoot) {
      const shadowIframes = container.shadowRoot.querySelectorAll('iframe');
      if (shadowIframes.length > 0) {
        console.log(`   Shadow DOM in container ${index} has ${shadowIframes.length} iframes`);
        containerIframes.push(...shadowIframes);
      }
    }
  });
  
  // Method 3: Look for dynamically created iframes
  setTimeout(() => {
    const delayedIframes = document.querySelectorAll('iframe');
    if (delayedIframes.length !== standardIframes.length) {
      console.log(`3. Delayed search found ${delayedIframes.length} iframes (was ${standardIframes.length})`);
    }
  }, 1000);
  
  // Method 4: Look for iframes with specific attributes
  const customIframes = document.querySelectorAll('iframe[src*="custom"], iframe[src*="component"], iframe[data-component], iframe[class*="retool"]');
  console.log(`4. Custom component iframes: ${customIframes.length} found`);
  
  // Method 5: Check if component is inside a specific container
  const componentContainer = document.querySelector(`[data-testid*="dynamicControl1"], [id*="dynamicControl1"]`);
  if (componentContainer) {
    console.log('5. Found component container:', componentContainer);
    const containerIframes = componentContainer.querySelectorAll('iframe');
    console.log(`   Iframes in component container: ${containerIframes.length}`);
  } else {
    console.log('5. No specific component container found');
  }
  
  // Combine all found iframes
  const allIframes = new Set([...standardIframes, ...containerIframes, ...customIframes]);
  console.log(`Total unique iframes found: ${allIframes.size}`);
  
  return Array.from(allIframes);
}

// Test iframe communication with enhanced detection
async function testIframePostMessage() {
  console.log('📡 Testing iframe PostMessage communication...');
  
  const iframes = findAllIframes();
  
  if (iframes.length === 0) {
    console.log('❌ No iframes found for PostMessage testing');
    return { success: false, error: 'No iframes found' };
  }
  
  // Test each iframe
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    console.log(`Testing iframe ${i + 1}/${iframes.length}:`, iframe.src);
    
    try {
      const result = await testSingleIframe(iframe, i);
      if (result.success) {
        console.log(`✅ Iframe ${i + 1} responded successfully!`);
        return { success: true, iframe: iframe, result: result };
      }
    } catch (error) {
      console.log(`❌ Iframe ${i + 1} failed:`, error.message);
    }
  }
  
  return { success: false, error: 'No iframes responded to PostMessage' };
}

// Test a single iframe
function testSingleIframe(iframe, index) {
  return new Promise((resolve) => {
    const id = `iframe-test-${index}-${Date.now()}`;
    
    const handleResponse = (event) => {
      if (event.data && 
          event.data.type === 'RETOOL_COMPONENT_RESPONSE' && 
          event.data.id === id) {
        
        window.removeEventListener('message', handleResponse);
        clearTimeout(timeoutId);
        resolve({ success: true, response: event.data });
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    const timeoutId = setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      resolve({ success: false, error: 'timeout' });
    }, 2000);
    
    // Send ping to iframe
    try {
      iframe.contentWindow.postMessage({
        type: 'RETOOL_COMPONENT_COMMAND',
        action: 'ping',
        payload: null,
        id: id
      }, '*');
    } catch (error) {
      window.removeEventListener('message', handleResponse);
      clearTimeout(timeoutId);
      resolve({ success: false, error: error.message });
    }
  });
}

// Check if component is in a container that might affect iframe rendering
function checkComponentContainer() {
  console.log('📦 Checking component container setup...');
  
  // Look for the component in different ways
  const possibleContainers = [
    '[data-testid*="dynamicControl1"]',
    '[id*="dynamicControl1"]',
    '[class*="dynamicControl1"]',
    '[data-component="dynamicControl1"]'
  ];
  
  for (let selector of possibleContainers) {
    const container = document.querySelector(selector);
    if (container) {
      console.log(`Found component container with ${selector}:`, container);
      
      // Check container properties
      console.log('Container properties:');
      console.log('  - tagName:', container.tagName);
      console.log('  - className:', container.className);
      console.log('  - id:', container.id);
      console.log('  - data attributes:', Array.from(container.attributes).filter(attr => attr.name.startsWith('data-')));
      
      // Check if container has iframes
      const containerIframes = container.querySelectorAll('iframe');
      console.log(`  - iframes in container: ${containerIframes.length}`);
      
      return { found: true, container: container, iframes: containerIframes.length };
    }
  }
  
  console.log('No specific component container found');
  return { found: false };
}

// Wait for component to fully load and check for iframes
async function waitForComponentLoad() {
  console.log('⏳ Waiting for component to fully load...');
  
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`Attempt ${attempts}/${maxAttempts}: Checking for iframes...`);
      
      const iframes = document.querySelectorAll('iframe');
      console.log(`  Found ${iframes.length} iframes`);
      
      if (iframes.length > 0 || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        resolve(iframes.length);
      }
    }, 500); // Check every 500ms
  });
}

// Main comprehensive test
async function runComprehensiveTest() {
  console.log('🚀 Running comprehensive iframe and container test...');
  
  // Test 1: Check component container
  const containerCheck = checkComponentContainer();
  
  // Test 2: Wait for component to load
  const iframeCount = await waitForComponentLoad();
  console.log(`After waiting: ${iframeCount} iframes found`);
  
  // Test 3: Enhanced iframe detection
  const allIframes = findAllIframes();
  
  // Test 4: Test iframe PostMessage if any found
  let iframeTest = { success: false, error: 'No iframes to test' };
  if (allIframes.length > 0) {
    iframeTest = await testIframePostMessage();
  }
  
  // Test 5: Direct component access (fallback)
  const directAccess = {
    componentExists: typeof dynamicControl1 !== 'undefined',
    componentType: dynamicControl1?.pluginType,
    componentProperties: dynamicControl1 ? Object.keys(dynamicControl1) : []
  };
  
  return {
    containerCheck: containerCheck,
    iframeCount: iframeCount,
    allIframes: allIframes.length,
    iframeTest: iframeTest,
    directAccess: directAccess,
    recommendation: iframeTest.success ? 'Use iframe PostMessage' : 'Use direct component access'
  };
}

// Execute the comprehensive test
return await runComprehensiveTest();
