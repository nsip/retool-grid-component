# AssessorGrid Migration Guide: Old API → New PostMessage API

## Overview

This guide helps you migrate from the old assessorGrid global methods to the new PostMessage API that provides reliable programmatic control of the DynamicControl component.

## Migration Summary

**Before (Old - Not Working):**
```javascript
// These methods don't work due to iframe isolation
setAssessorGridConfig(config);
setAssessorGridResponses(responses);
const config = getAssessorGridConfig();
const responses = getAssessorGridResponses();
```

**After (New - Working):**
```javascript
// Include the API script first
// <script src="retool-component-api.js"></script>

const api = new RetoolComponentAPI();
await api.setConfig('DynamicControl', config);
await api.setResponses('DynamicControl', responses);
const config = await api.getConfig('DynamicControl');
const responses = await api.getResponses('DynamicControl');
```

## Step-by-Step Migration

### Step 1: Include the API Script

Add this to your Retool app or external page:

```html
<script src="retool-component-api.js"></script>
```

Or if using in Retool JavaScript queries, you can copy the API class directly.

### Step 2: Replace Global Method Calls

#### Setting Configuration

**Old:**
```javascript
setAssessorGridConfig({
  type: "checkbox",
  rows: ["Question 1", "Question 2", "Question 3"],
  columns: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
});
```

**New:**
```javascript
const api = new RetoolComponentAPI();
await api.setConfig('DynamicControl', {
  type: "checkbox",
  rows: ["Question 1", "Question 2", "Question 3"],
  columns: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
});
```

#### Getting Configuration

**Old:**
```javascript
const config = getAssessorGridConfig();
```

**New:**
```javascript
const api = new RetoolComponentAPI();
const config = await api.getConfig('DynamicControl');
```

#### Setting Responses

**Old:**
```javascript
setAssessorGridResponses({
  "Question 1": {"Agree": true},
  "Question 2": {"Strongly Agree": true},
  "Question 3": {"Neutral": true}
});
```

**New:**
```javascript
const api = new RetoolComponentAPI();
await api.setResponses('DynamicControl', {
  "Question 1": {"Agree": true},
  "Question 2": {"Strongly Agree": true},
  "Question 3": {"Neutral": true}
});
```

#### Getting Responses

**Old:**
```javascript
const responses = getAssessorGridResponses();
```

**New:**
```javascript
const api = new RetoolComponentAPI();
const responses = await api.getResponses('DynamicControl');
```

### Step 3: Handle Async Operations

The new API is promise-based, so you need to handle async operations:

**Sequential Operations:**
```javascript
const api = new RetoolComponentAPI();

// Set configuration first
await api.setConfig('DynamicControl', {
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Yes", "No", "Maybe"]
});

// Then set responses
await api.setResponses('DynamicControl', {
  "Question 1": {"Yes": true},
  "Question 2": {"Maybe": true}
});

// Get current state
const config = await api.getConfig('DynamicControl');
const responses = await api.getResponses('DynamicControl');
```

**Error Handling:**
```javascript
const api = new RetoolComponentAPI();

try {
  await api.setConfig('DynamicControl', config);
  console.log('Configuration set successfully');
} catch (error) {
  console.error('Failed to set configuration:', error.message);
}
```

## Retool-Specific Implementation

### For Retool JavaScript Queries

If you're using this within Retool JavaScript queries, you can either:

1. **Include the full API class** (copy from `retool-component-api.js`)
2. **Use direct PostMessage calls** (for lighter implementation)

#### Option 1: Full API Class in Retool

```javascript
// Copy the RetoolComponentAPI class definition here
class RetoolComponentAPI {
  // ... (full class from retool-component-api.js)
}

// Use it
const api = new RetoolComponentAPI();
await api.setConfig('DynamicControl', {
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Agree", "Disagree"]
});
```

#### Option 2: Direct PostMessage (Lightweight)

```javascript
// Helper function for Retool
function sendComponentCommand(action, payload) {
  return new Promise((resolve, reject) => {
    const iframe = document.querySelector('iframe[src*="retool"]');
    if (!iframe) {
      reject(new Error('Component iframe not found'));
      return;
    }
    
    const id = 'req-' + Date.now();
    
    // Listen for response
    const handleResponse = (event) => {
      if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE' && event.data.id === id) {
        window.removeEventListener('message', handleResponse);
        if (event.data.success) {
          resolve(event.data.payload);
        } else {
          reject(new Error(event.data.payload?.error || 'Unknown error'));
        }
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    // Send command
    iframe.contentWindow.postMessage({
      type: 'RETOOL_COMPONENT_COMMAND',
      action: action,
      payload: payload,
      id: id
    }, '*');
    
    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      reject(new Error('Request timeout'));
    }, 5000);
  });
}

// Usage in Retool JavaScript
await sendComponentCommand('setConfig', {
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Agree", "Disagree"]
});

const config = await sendComponentCommand('getConfig', null);
const responses = await sendComponentCommand('getResponses', null);
```

## Testing Your Migration

### 1. Component Availability Test

```javascript
const api = new RetoolComponentAPI();
const isAvailable = await api.ping('DynamicControl');
console.log('Component available:', isAvailable);
```

### 2. Full Workflow Test

```javascript
const api = new RetoolComponentAPI();

// Test complete workflow
try {
  // 1. Check component status
  const status = await api.getStatus('DynamicControl');
  console.log('Component status:', status);
  
  // 2. Set configuration
  await api.setConfig('DynamicControl', {
    type: "checkbox",
    rows: ["Test Question 1", "Test Question 2"],
    columns: ["Option A", "Option B", "Option C"]
  });
  
  // 3. Verify configuration was set
  const config = await api.getConfig('DynamicControl');
  console.log('Current config:', config);
  
  // 4. Set some responses
  await api.setResponses('DynamicControl', {
    "Test Question 1": {"Option A": true},
    "Test Question 2": {"Option B": true}
  });
  
  // 5. Verify responses were set
  const responses = await api.getResponses('DynamicControl');
  console.log('Current responses:', responses);
  
  console.log('✅ Migration test successful!');
} catch (error) {
  console.error('❌ Migration test failed:', error.message);
}
```

## Convenience Functions

For simpler usage, you can also use the global convenience functions:

```javascript
// These are automatically available when you include retool-component-api.js
await setRetoolComponentConfig('DynamicControl', config);
await setRetoolComponentResponses('DynamicControl', responses);
const config = await getRetoolComponentConfig('DynamicControl');
const responses = await getRetoolComponentResponses('DynamicControl');
```

## Troubleshooting

### Common Issues

1. **"Component iframe not found"**
   - Make sure the DynamicControl component is visible on the page
   - Check that the component has been deployed (Version 51+)

2. **"Request timeout"**
   - Component may not be responding to PostMessage
   - Check browser console for component errors
   - Verify component is using the updated version with PostMessage support

3. **"Unknown action" errors**
   - Make sure you're using the correct action names: `setConfig`, `getConfig`, `setResponses`, `getResponses`, `ping`, `getStatus`

### Debug Mode

Enable debug logging:

```javascript
// Listen for all component responses
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE') {
    console.log('Component Response:', event.data);
  }
});
```

## Summary

The new PostMessage API provides:
- ✅ **Reliable communication** across iframe boundaries
- ✅ **Promise-based async operations** with proper error handling
- ✅ **Complete programmatic control** of the DynamicControl component
- ✅ **Production-ready implementation** with timeouts and debugging

This migration enables the programmatic control that was originally required and provides a robust foundation for dynamic grid interactions.
