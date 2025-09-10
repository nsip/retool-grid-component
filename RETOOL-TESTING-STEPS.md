# How to Test DynamicControl API in Retool - Step by Step

## Step 1: Add the DynamicControl Component

1. **Open your Retool app**
2. **Add a Custom Component:**
   - Click the "+" button to add a new component
   - Select "Custom Component" from the list
   - In the component settings, select your deployed library (should show Version 51)
   - Choose "DynamicControl" from the available components
3. **Make sure the component is visible** on your page (drag it to a visible area)

## Step 2: Create a JavaScript Query to Test the API

1. **Create a new JavaScript query:**
   - In the left panel, click "+" next to "Code"
   - Select "JavaScript"
   - Name it something like "testDynamicControlAPI"

2. **Copy the test code:**
   - Open the file `retool-test-script.js` 
   - Copy the ENTIRE contents of that file
   - Paste it into your JavaScript query

3. **Your JavaScript query should now contain all the test functions**

## Step 3: Run the Test

**Method A: Run the Full Test Suite**

1. **At the bottom of your JavaScript query, add this line:**
   ```javascript
   return await testDynamicControlAPI();
   ```

2. **Click the "Run" button** (or press Ctrl/Cmd + Enter)

3. **Check the results:**
   - Look at the query result panel - it should show success/failure
   - Open browser DevTools (F12) and check the Console tab for detailed logs

**Method B: Run Individual Tests**

Instead of the full test, you can add any of these at the bottom of your query:

```javascript
// Test if component is responding
return await quickPing();

// Set a configuration
return await quickSetConfig({
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Yes", "No", "Maybe"]
});

// Get current configuration
return await quickGetConfig();

// Set responses
return await quickSetResponses({
  "Question 1": {"Yes": true},
  "Question 2": {"Maybe": true}
});

// Get current responses
return await quickGetResponses();
```

## Step 4: What You Should See

### ✅ Success Indicators:
- **Query Result Panel:** Shows success message and test results
- **Browser Console:** Shows green checkmarks and "All tests passed!"
- **Component Visual:** Grid should update when you set configuration
- **No Error Messages:** No red errors in console or query results

### ❌ Failure Indicators:
- **"Component iframe not found"** - Component not visible on page
- **"Request timeout"** - Component not responding (wrong version?)
- **Red error messages** - Check browser console for details

## Step 5: Visual Verification

After running the test:
1. **Look at your DynamicControl component** - it should show a grid
2. **The grid should have:**
   - Questions as rows: "How satisfied are you with the service?", "Would you recommend us?", "Rate the user experience"
   - Columns: "Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"
   - Some checkboxes should be checked based on the test responses

## Complete Example JavaScript Query

Here's exactly what your JavaScript query should look like:

```javascript
// Paste the ENTIRE contents of retool-test-script.js here
// (all the functions: sendComponentCommand, testDynamicControlAPI, quickPing, etc.)

// Then add this at the very end to run the test:
return await testDynamicControlAPI();
```

## Troubleshooting

### Problem: "Component iframe not found"
**Solution:** 
- Make sure DynamicControl component is added to your page
- Make sure it's visible (not hidden or collapsed)
- Try refreshing the page

### Problem: "Request timeout"
**Solution:**
- Check you're using Version 51+ of the component library
- Try redeploying: run `npx retool-ccl deploy` again
- Check browser console for component errors

### Problem: No visual changes in component
**Solution:**
- The component might be working but not showing changes
- Check the query results - if they show success, the API is working
- Try setting a simpler configuration first

## Quick Test Commands

If you want to test quickly without the full script, create a JavaScript query with just this:

```javascript
// Minimal test function
function sendComponentCommand(action, payload = null) {
  return new Promise((resolve, reject) => {
    const iframe = document.querySelector('iframe[src*="retool"]') || 
                   document.querySelector('iframe[src*="custom-component"]');
    
    if (!iframe || !iframe.contentWindow) {
      reject(new Error('Component not found'));
      return;
    }
    
    const id = 'test-' + Date.now();
    
    const handleResponse = (event) => {
      if (event.data && event.data.type === 'RETOOL_COMPONENT_RESPONSE' && event.data.id === id) {
        window.removeEventListener('message', handleResponse);
        resolve(event.data.payload);
      }
    };
    
    window.addEventListener('message', handleResponse);
    
    setTimeout(() => {
      window.removeEventListener('message', handleResponse);
      reject(new Error('Timeout'));
    }, 5000);
    
    iframe.contentWindow.postMessage({
      type: 'RETOOL_COMPONENT_COMMAND',
      action: action,
      payload: payload,
      id: id
    }, '*');
  });
}

// Test it
return await sendComponentCommand('ping');
```

This should return something like: `{"status": "alive", "timestamp": "2024-..."}`

## Success! 🎉

If the test passes, you now have working programmatic control of your Retool custom component! You can use the API functions in any Retool JavaScript query to control the grid dynamically.
