# StableGrid Component - Setup Instructions

## ✅ CURRENT STATUS: Version 74 - External State Access Breakthrough

The StableGrid component provides **stable, reliable programmatic control** with full external state access for backend integration.

## 🚀 Quick Setup Guide

### Step 1: Deploy Component
```bash
# In your project directory
npm run build
npx retool-ccl deploy
```
**Expected Result**: "Successfully created a new version (74) of the library"

### Step 2: Add Component to Retool App
1. Open your Retool app
2. Click "Add Component" → "Custom Component"
3. Select "DynamicControlLibrary" from the dropdown
4. Choose "StableGrid" (NOT DynamicControl)
5. Component should render without "dead computer icon" errors

### Step 3: Test Inspector Panel (Recommended First Test)
1. Select the StableGrid component
2. In the Inspector panel on the right, find "Grid Config" field
3. Enter this exact JSON:
```json
{"type":"checkbox","rows":["Q1","Q2"],"columns":["A","B","C"]}
```
4. **Expected Result**: Grid displays with 2 rows and 3 columns of checkboxes

### Step 4: Set Up Programmatic Control
1. Create a new State variable:
   - Name: `gridConfig`
   - Type: String
   - Initial Value: `""` (empty string)

2. Bind the component:
   - Select StableGrid component
   - In Inspector panel, find "Grid Config" field
   - Click the binding icon (⚡)
   - Enter: `{{ gridConfig.value }}`

3. Test with JavaScript query:
```javascript
gridConfig.setValue(JSON.stringify({
  "type": "checkbox",
  "rows": ["Question 1", "Question 2", "Question 3"],
  "columns": ["Option A", "Option B", "Option C", "Option D"]
}));
```

### Step 5: Test External State Access (NEW in V74)
1. After setting up the grid and interacting with it (clicking checkboxes), test external state access:
```javascript
// Read user responses in JavaScript queries
const responses = stableGrid1.currentResponses;
console.log('User responses:', JSON.parse(responses || '{}'));

// Backend integration example
fetch('/api/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    responses: JSON.parse(stableGrid1.currentResponses || '{}')
  })
});
```

2. Set up event handler (optional):
   - In StableGrid Inspector panel, find "onResponsesChanged"
   - Add event handler with action: `console.log("Responses changed:", stableGrid1.currentResponses)`

## 🎯 What Should Work

### ✅ Success Indicators
- Component renders without errors
- Inspector panel updates work immediately
- State variable binding updates the grid
- JavaScript queries change the grid content
- Checkboxes are clickable and functional
- **External state access works** - `stableGrid1.currentResponses` returns user data
- **Event callbacks fire** - `onResponsesChanged` triggers on user interactions
- No "dead computer icon" appears

### ❌ If Something Fails
- **Component doesn't appear**: Refresh Retool app, check library version
- **Inspector doesn't work**: Verify JSON syntax is correct
- **State binding fails**: Check variable name is `gridConfig` and type is String
- **JavaScript fails**: Ensure you're using `JSON.stringify()` around the object

## 📋 Supported Configurations

### Checkbox Grid
```json
{
  "type": "checkbox",
  "rows": ["Question 1", "Question 2"],
  "columns": ["Option A", "Option B", "Option C"]
}
```

### Radio Grid
```json
{
  "type": "radio",
  "rows": ["Priority Level", "Urgency Level"],
  "columns": ["High", "Medium", "Low"]
}
```

### Textbox Grid
```json
{
  "type": "textbox",
  "rows": ["Name", "Email", "Comments"],
  "columns": ["Response"]
}
```

## 🔧 Production API Usage

Copy functions from `stablegrid-api.js` into your JavaScript queries:

### Basic Functions
```javascript
// Quick test
function testStableGrid() {
  const testData = {
    "columns": [
      {"field": "id", "headerName": "ID", "width": 80},
      {"field": "task", "headerName": "Task", "width": 250},
      {"field": "status", "headerName": "Status", "width": 120}
    ],
    "rows": [
      {"id": 1, "task": "Test task 1", "status": "Active"},
      {"id": 2, "task": "Test task 2", "status": "Complete"}
    ]
  };
  gridConfig.setValue(JSON.stringify(testData));
}

// Clear grid
function clearGrid() {
  gridConfig.setValue("");
}

// Update with custom data
function updateGrid(columns, rows) {
  const config = { columns: columns, rows: rows };
  gridConfig.setValue(JSON.stringify(config));
}
```

### Example Usage
```javascript
// Test the component
testStableGrid();

// Create custom survey grid
updateGrid(
  [
    {"field": "question", "headerName": "Question", "width": 300},
    {"field": "response", "headerName": "Response", "width": 150}
  ],
  [
    {"question": "How satisfied are you?", "response": "Very satisfied"},
    {"question": "Would you recommend us?", "response": "Yes"}
  ]
);
```

## 🔍 Troubleshooting

### Common Issues

**Issue**: Component shows "dead computer icon"
**Solution**: You're using DynamicControl instead of StableGrid. Switch to StableGrid.

**Issue**: Inspector panel doesn't update the grid
**Solution**: Check JSON syntax. Use online JSON validator if needed.

**Issue**: State variable binding doesn't work
**Solution**: 
- Ensure state variable is type "String"
- Check binding syntax: `{{ gridConfig.value }}`
- Verify variable name matches exactly

**Issue**: JavaScript query doesn't update grid
**Solution**:
- Use `JSON.stringify()` around your data object
- Check browser console for errors
- Ensure state variable binding is set up first

### Debug Steps
1. **Check Browser Console**: Press F12, look for errors
2. **Verify Component Version**: Should be version 74
3. **Test Inspector First**: Always test manual input before programmatic
4. **Check State Variable**: Ensure it's created and bound correctly
5. **Test External State Access**: Verify `stableGrid1.currentResponses` returns data after user interactions

## 📁 Related Files

### Essential Files
- `src/index.tsx` - StableGrid component code
- `stablegrid-api.js` - Production API functions
- `FINAL-STABLEGRID-SOLUTION.md` - Complete solution overview

### Testing Guides
- `INSPECTOR-FIRST-TEST.md` - Step-by-step Inspector testing
- `STEP-3-STATE-VARIABLES.md` - State variable testing guide
- `STABLEGRID-TESTING-GUIDE.md` - Comprehensive testing

### Development
- `V75-ENHANCEMENT-ROADMAP.md` - Future enhancement plans
- `V74-WORKAROUND-TEST-GUIDE.md` - External state access testing
- `V74-DETAILED-SETUP-GUIDE.md` - Detailed V74 setup procedures
- `README.md` - Project overview and current status

## 🎉 Success Confirmation

When everything is working correctly:
1. ✅ StableGrid component appears in your app
2. ✅ Inspector panel JSON input updates the grid immediately
3. ✅ State variable binding works
4. ✅ JavaScript queries update the grid content
5. ✅ **External state access works** - `stableGrid1.currentResponses` accessible in JavaScript
6. ✅ **Backend integration ready** - Perfect for JavaScript-based data processing
7. ✅ No crashes or "dead computer icon" errors
8. ✅ Grid is interactive (checkboxes clickable)

**You now have full programmatic control AND external state access for your grid component!**

---

**This solution provides the non-negotiable programmatic control requirement while maintaining complete stability.**
