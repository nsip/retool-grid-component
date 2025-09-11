# V74 Workaround Test Guide - External State Access Solution

## 🎯 What's New in V74

**BREAKTHROUGH**: V74 implements the forum-tested workaround for CCL2 state propagation issues!

### New Features Added
1. **Hidden `currentResponses` property** - Externally accessible JSON string of user responses
2. **`onResponsesChanged` event callback** - Fires whenever user interactions change responses
3. **Dual state pattern** - Updates both internal display and external accessible state

## 🧪 Testing V74

### 1. Basic Setup
1. **Refresh Retool** to load Version 74
2. **Add StableGrid component** to your app
3. **Set up test configuration**:

**Checkbox Test:**
```json
{"type":"checkbox","rows":["Question 1","Question 2"],"columns":["Option A","Option B","Option C"],"responses":{}}
```

### 2. External State Access Tests

#### Test A: Direct Property Access
**What to test:** `{{ stableGrid1.currentResponses }}`

**Expected behavior:**
- Initially shows: `{}`
- After clicking checkboxes: `{"Question 1":{"Option A":true}}`
- Updates in real-time as user interacts

#### Test B: Event-Driven Updates
**Setup:**
1. Add event handler for `onResponsesChanged`
2. In event handler, add action: `console.log("Responses changed:", stableGrid1.currentResponses)`

**Expected behavior:**
- Console logs fire every time user clicks checkboxes/radios or types in textboxes
- Logs show current response state

#### Test C: Query-Based Access
**Setup:**
1. Create JavaScript query: `return JSON.parse(stableGrid1.currentResponses || '{}')`
2. Set query to trigger on `stableGrid1.onResponsesChanged` event

**Expected behavior:**
- Query result updates with parsed response object
- Other components can reference query result reliably

### 3. All Grid Types Testing

#### Checkbox Grid
```json
{"type":"checkbox","rows":["Q1","Q2"],"columns":["A","B","C"],"responses":{}}
```
**Test:** Click multiple checkboxes, verify `currentResponses` shows all selections

#### Radio Grid  
```json
{"type":"radio","rows":["Q1","Q2"],"columns":["Yes","No","Maybe"],"responses":{}}
```
**Test:** Select radios, verify `currentResponses` shows single selection per row

#### Textbox Grid
```json
{"type":"misc","rows":["Name","Email"],"responses":{"Name":"","Email":""}}
```
**Test:** Type in fields, verify `currentResponses` updates with text content

## 🔍 What Should Work Now

### ✅ Internal Functionality (Unchanged)
- Component display updates correctly
- All three grid types render properly
- User interactions work smoothly

### ✅ External State Access (NEW!)
- `stableGrid1.currentResponses` provides JSON string of responses
- `onResponsesChanged` event fires on every user interaction
- External components can read and react to state changes
- Queries can access and parse response data

### ✅ Backward Compatibility
- Unified `config` structure still works
- All existing functionality preserved
- No breaking changes to existing implementations

## 📋 Success Criteria

**PASS if:**
- ✅ Component display works (same as V73)
- ✅ `stableGrid1.currentResponses` updates with user interactions
- ✅ `onResponsesChanged` event fires on changes
- ✅ External components can access response data
- ✅ All three grid types work with external access

**FAIL if:**
- ❌ `currentResponses` stays empty after user interactions
- ❌ Events don't fire on user changes
- ❌ External components can't read response data

## 🚀 Usage Patterns for Apps

### Pattern 1: Direct Access
```javascript
// In button disabled property:
{{ JSON.parse(stableGrid1.currentResponses || '{}').Question1?.OptionA !== true }}

// In text component:
{{ "User selected: " + Object.keys(JSON.parse(stableGrid1.currentResponses || '{}')).length + " items" }}
```

### Pattern 2: Event-Driven
```javascript
// Event handler on onResponsesChanged:
// Action 1: Set variable
responseData.setValue(stableGrid1.currentResponses)

// Action 2: Trigger validation query
validateResponses.trigger()
```

### Pattern 3: Query-Based (Most Reliable)
```javascript
// JavaScript query "getGridResponses":
return JSON.parse(stableGrid1.currentResponses || '{}')

// Trigger: stableGrid1.onResponsesChanged
// Usage in other components: {{ getGridResponses.data }}
```

## 🎉 Expected Outcome

V74 should **FINALLY** solve the external state access issue that has persisted through V69-V73. Users can now:

1. **Read response data** from external components
2. **React to changes** via event callbacks  
3. **Build complex logic** using reliable state access
4. **Integrate with workflows** that depend on grid responses

This makes the StableGrid component truly useful for interactive applications where you need to act on user responses!
