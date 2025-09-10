# AssessorGrid Complete Setup Guide

## Overview
This guide provides complete instructions for setting up and using the AssessorGrid component with multipage support, direct method access, and app state persistence.

## What's Been Implemented

### ✅ Component Features (Version 54)
- **Clean Interface**: Only Debug Info and PostMessage Debug sections visible by default
- **Interactive Grids**: Checkbox, radio button, and text input grids
- **App State Integration**: Automatic sync between component and Retool app state
- **Multipage Support**: Works across different pages in your Retool app
- **Visual Updates**: Real-time updates when config/responses change

### ✅ API Features
- **Direct Method Access**: `assessorGrid.setConfig()`, `assessorGrid.getResponses()`, etc.
- **Multipage Persistence**: Data persists when navigating between pages
- **Auto-Sync**: Automatic synchronization between app state and component
- **Backward Compatibility**: Works with existing code patterns

## Setup Instructions

### Step 1: Load the PostMessage API

In your Retool app, create a JavaScript query called "Load AssessorGrid API" and paste the contents of `assessorGrid-postmessage-API.js`:

```javascript
// Copy the entire contents of assessorGrid-postmessage-API.js here
```

**Important**: 
1. Set this query to "Run this query on page load" so the API is always available for end users
2. **Run the query manually first** to load the API immediately for testing (development only)
3. Check the console for "✅ AssessorGrid PostMessage API loaded successfully!"

**Note for End Users:** The API will load automatically when they open the app - no manual steps required.

**Why PostMessage API?** The component runs in a cross-origin iframe, so PostMessage is the only way to communicate with it securely.

**If you get "assessorGrid.setConfig is not a function":**
- The API hasn't been loaded yet
- Run the "Load AssessorGrid API" query manually
- Check for JavaScript errors in the console
- Verify the query is set to run on page load

### Step 2: Add the Component

1. Add a Custom Component to your page
2. Set the component name to `assessorGrid` (important!)
3. Select your deployed library (Version 54)
4. Choose `DynamicControl` as the component type

### Step 3: Test the Setup

Run these commands in your browser console to verify everything works:

```javascript
// Test 1: Check API is loaded
console.log(typeof assessorGrid); // Should show "object"

// Test 2: Test PostMessage API (comprehensive test)
testAssessorGrid();

// Test 3: Check component detection
assessorGrid.getStatus(); // Shows if component is found and type (iframe/direct)

// Test 4: Create a test grid
assessorGrid.setConfig({
  type: "checkbox",
  rows: ["Question 1", "Question 2"],
  columns: ["Option A", "Option B", "Option C"]
});

// Test 5: Set some responses
assessorGrid.setResponses({
  "Question 1": {"Option A": true},
  "Question 2": {"Option B": true}
});

// Test 6: Get current data
const config = assessorGrid.getConfig();
const responses = assessorGrid.getResponses();
console.log('Config:', config);
console.log('Responses:', responses);
```

**Expected Results:**
- `assessorGrid` should be an object with methods
- `testAssessorGrid()` should complete successfully with async/await
- `getStatus()` should show component communication working
- Setting config should make the grid appear in the component
- PostMessage communication should work between iframe and parent

## API Reference

### Core Methods

#### Configuration
```javascript
// Set grid configuration
assessorGrid.setConfig({
  type: "checkbox", // or "radio" or "misc"
  rows: ["Question 1", "Question 2"],
  columns: ["Option A", "Option B"]
});

// Get current configuration
const config = assessorGrid.getConfig();
```

#### Responses
```javascript
// Set responses
assessorGrid.setResponses({
  "Question 1": {"Option A": true},
  "Question 2": {"Option B": true}
});

// Get current responses
const responses = assessorGrid.getResponses();

// Clear all responses
assessorGrid.clearResponses();
```

#### Component Control
```javascript
// Hide/show component
assessorGrid.hide();
assessorGrid.show();

// Scroll component into view
assessorGrid.scrollIntoView();

// Get component status
const status = assessorGrid.getStatus();
```

### Convenience Methods

```javascript
// Quick grid creation
assessorGrid.createCheckboxGrid(
  ["Satisfaction", "Recommendation"],
  ["Strongly Agree", "Agree", "Disagree"]
);

assessorGrid.createRadioGrid(
  ["Overall Rating"],
  ["Excellent", "Good", "Fair", "Poor"]
);

// Individual question responses
assessorGrid.setQuestionResponse("Question 1", "Option A", true);
const questionResponse = assessorGrid.getQuestionResponse("Question 1");
```

## Multipage Workflow

### Scenario: Set on Page 1, Display on Page 2

**Page 1 (Setup):**
```javascript
// Configure the grid before user sees it
assessorGrid.setConfig({
  type: "checkbox",
  rows: ["How satisfied are you?", "Would you recommend us?"],
  columns: ["Very", "Somewhat", "Not at all"]
});

// Pre-populate if needed
assessorGrid.setResponses({
  "How satisfied are you?": {"Very": true}
});
```

**Page 2 (Display):**
- Component automatically loads with the configuration from Page 1
- User can interact with the grid
- All interactions are automatically saved to app state

**Page 3 (Results):**
```javascript
// Retrieve user responses
const responses = assessorGrid.getResponses();
console.log('User responses:', responses);

// Process responses with your existing routine
processUserResponses(responses);
```

## Grid Types

### Checkbox Grid
- Multiple selections per row
- Use `type: "checkbox"`
- Responses: `{"Question": {"Option1": true, "Option2": false}}`

### Radio Button Grid
- Single selection per row
- Use `type: "radio"`
- Responses: `{"Question": {"SelectedOption": true}}`

### Text Input Grid
- Free text input
- Use `type: "misc"`
- Responses: `{"Label": "User entered text"}`

## Troubleshooting

### Component Not Showing Grid
1. Check if config is set: `assessorGrid.getConfig()`
2. Verify component name is `assessorGrid`
3. Check console for sync messages

### API Not Available
1. Ensure the API loading query is set to "Run this query on page load"
2. Check console for "AssessorGrid Multipage API loaded successfully!"
3. Verify no JavaScript errors in console

### Data Not Persisting
1. Check app state: `assessorGrid.getStatus()`
2. Verify auto-sync is working (check console logs)
3. Test with `assessorGrid.sync()` to force sync

### Visual Updates Not Working
1. Refresh the page to load Version 54
2. Check if component is receiving config: Look at Debug Info section
3. Verify config format is correct (valid JSON)

### Iframe Issues (Component in iframe but API not working)
1. Check component detection: `assessorGrid.getStatus()` should show `componentType: "iframe"`
2. Verify the component name is exactly `assessorGrid` (case-sensitive)
3. Look for console messages like "✅ Synced app state to component (iframe)"
4. If component not detected, try: `assessorGrid.sync()` to force detection
5. Check browser console for any cross-origin or security errors

### API Returns "undefined" or "setConfig is not a function"
1. **First, check if API is loaded**: `console.log(typeof assessorGrid)` should show "object"
2. **If shows "undefined"**: API not loaded
   - Run the "Load AssessorGrid API" query manually
   - Look for "✅ AssessorGrid Multipage API loaded successfully!" in console
   - Check the query is set to "Run this query on page load"
   - Verify no JavaScript errors prevented the API from loading
3. **If shows "object" but methods missing**: Partial load issue
   - Refresh the page completely
   - Check for JavaScript errors in console
   - Verify the complete `assessorGrid-multipage-API.js` content was copied

### Quick Diagnostic Commands
```javascript
// Check API status
console.log('API loaded:', typeof assessorGrid);
console.log('Available methods:', Object.keys(assessorGrid || {}));

// If API loaded, test basic functionality
if (typeof assessorGrid === 'object') {
  console.log('Status:', assessorGrid.getStatus());
  console.log('Test API:', testMultipageAPI());
}
```

## Migration from Old API

If you have existing code using global functions, update as follows:

```javascript
// Old way
setAssessorGridConfig(config);
const responses = getAssessorGridResponses();

// New way
assessorGrid.setConfig(config);
const responses = assessorGrid.getResponses();
```

## Testing Checklist

- [ ] API loads on app startup
- [ ] Component displays clean interface (only Debug Info and PostMessage Debug)
- [ ] `assessorGrid.setConfig()` creates visible grid
- [ ] User can click checkboxes/radio buttons
- [ ] User interactions update responses in real-time
- [ ] Data persists when navigating between pages
- [ ] `assessorGrid.getResponses()` returns current user selections
- [ ] Component works when not visible (multipage support)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Run `testMultipageAPI()` to verify setup
3. Use `assessorGrid.getStatus()` to check component state
4. Verify you're using Version 54 of the component library

## Success Indicators

When everything is working correctly, you should see:
- ✅ Clean component interface with only debug sections
- ✅ Interactive grid that responds to user clicks
- ✅ Real-time updates in the "Current Responses" section
- ✅ Console messages showing successful sync operations
- ✅ Data persistence across page navigation
- ✅ Direct method access working: `assessorGrid.setConfig()`, etc.

The AssessorGrid component is now ready for production use with full multipage support and direct method access!
