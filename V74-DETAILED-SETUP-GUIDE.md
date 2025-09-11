# V74 Detailed Setup Guide - How to Add Event Handlers in Retool

## 🎯 Step-by-Step: Adding Event Handlers for onResponsesChanged

### Step 1: Add the StableGrid Component
1. **Drag StableGrid** from the component library to your canvas
2. **Set the component ID** (e.g., `stableGrid1`)
3. **Configure the Grid Config** property with test data:
   ```json
   {"type":"checkbox","rows":["Question 1","Question 2"],"columns":["Option A","Option B","Option C"],"responses":{}}
   ```

### Step 2: Access Event Handlers
1. **Click on the StableGrid component** to select it
2. **Look at the right panel** (Inspector/Properties panel)
3. **Scroll down** to find the "Event handlers" section
4. **You should see**: `onResponsesChanged` listed as an available event

### Step 3: Add Event Handler
1. **Click the "+ Add handler" button** next to `onResponsesChanged`
2. **A new event handler row appears** with:
   - Event: `onResponsesChanged` (already selected)
   - Action: (dropdown to select action type)

### Step 4: Configure the Action
**Option A: Console Log (for testing)**
1. **Action dropdown**: Select "Run JavaScript code"
2. **Code field**: Enter:
   ```javascript
   console.log("Responses changed:", stableGrid1.currentResponses);
   ```

**Option B: Set Variable**
1. **Action dropdown**: Select "Set variable"
2. **Variable**: Select or create a variable (e.g., `gridResponses`)
3. **Value**: Enter `{{ stableGrid1.currentResponses }}`

**Option C: Trigger Query**
1. **Action dropdown**: Select "Trigger query"
2. **Query**: Select a query you want to run when responses change

### Step 5: Test the Event Handler
1. **Save your changes**
2. **Click checkboxes** in the grid
3. **Check the console** (F12 → Console tab) for log messages
4. **Verify** that the event fires on every interaction

## 🔍 Visual Guide: Where to Find Event Handlers

### In the Inspector Panel (Right Side):
```
┌─ Component Properties ─────────────┐
│ Grid Config: [text field]          │
│ Current Responses: [hidden]         │
├─ Interaction ──────────────────────┤
│ ✓ Show on desktop                   │
│ ✓ Show on mobile                    │
├─ Event handlers ───────────────────┤
│ onResponsesChanged                  │
│ [+ Add handler]                     │
└─────────────────────────────────────┘
```

### Event Handler Configuration:
```
┌─ Event Handler ────────────────────┐
│ Event: onResponsesChanged ▼        │
│ Action: Run JavaScript code ▼      │
│ Code: console.log("Changed:",       │
│       stableGrid1.currentResponses)│
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

## 🧪 Testing Different Access Methods

### Method 1: Direct Property Access
**Where to test:** Any text component or button
**Expression:** `{{ stableGrid1.currentResponses }}`
**Expected:** JSON string that updates when you interact with the grid

### Method 2: Event-Driven Variable
**Setup:**
1. Create variable `gridData` (type: string)
2. Add event handler: `onResponsesChanged` → Set variable `gridData` to `{{ stableGrid1.currentResponses }}`
3. Reference in other components: `{{ gridData.value }}`

### Method 3: Query-Based (Recommended)
**Setup:**
1. Create JavaScript query `getGridResponses`:
   ```javascript
   return JSON.parse(stableGrid1.currentResponses || '{}');
   ```
2. Set query trigger: `stableGrid1.onResponsesChanged`
3. Use in components: `{{ getGridResponses.data }}`

## 🚨 Troubleshooting

### "I don't see onResponsesChanged in Event handlers"
- **Solution**: Make sure you're using V74 of the component
- **Check**: Refresh the page and verify the component version

### "Event handler doesn't fire"
- **Solution**: Check the browser console for errors
- **Verify**: The component is properly configured with valid JSON

### "currentResponses is always empty"
- **Solution**: Make sure you're interacting with the grid (clicking checkboxes, typing in textboxes)
- **Check**: The component display should show "Current Responses" updating

## 🎯 Quick Test Script

**Add this to a JavaScript query to test everything:**
```javascript
// Test script - run this in a JS query
const responses = stableGrid1.currentResponses;
const parsed = JSON.parse(responses || '{}');
const count = Object.keys(parsed).length;

return {
  raw: responses,
  parsed: parsed,
  responseCount: count,
  working: count > 0 ? "✅ External access working!" : "❌ No responses yet"
};
```

## 🎉 Success Indicators

**✅ Working correctly when:**
- Event handlers appear in the Inspector
- Console logs fire when you interact with the grid
- `stableGrid1.currentResponses` shows JSON data
- External components can read and display the response data

**❌ Not working if:**
- No event handlers visible in Inspector
- Console logs don't appear on interaction
- `currentResponses` stays empty after clicking/typing
- External components show undefined or empty values

This should give you everything you need to set up and test the external state access in V74!
