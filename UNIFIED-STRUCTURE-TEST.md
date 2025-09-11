# Unified Structure Testing Guide - Version 69

## 🎯 TESTING OBJECTIVE
Test the new unified config+responses structure with all three grid types incrementally.

## 📋 SETUP STEPS

### 1. Add StableGrid Component
1. In Retool, add Custom Component → DynamicControlLibrary → StableGrid
2. Component should show "🔧 Stable Grid (Unified Structure)" with test examples

### 2. Create State Variable
1. Create state variable named `gridConfig` (string type)
2. Set initial value to empty string `""`
3. Bind StableGrid's "Grid Config" property to `{{ gridConfig.value }}`

## 🧪 INCREMENTAL TESTS

### Test 1: Checkbox Grid with Unified Responses
**Set gridConfig to:**
```json
{"type":"checkbox","rows":["Question 1","Question 2"],"columns":["Option A","Option B","Option C"],"responses":{}}
```

**Expected Results:**
- ✅ Component shows "✅ CHECKBOX Grid"
- ✅ 2x3 grid of checkboxes appears
- ✅ Row labels: "Question 1", "Question 2"
- ✅ Column headers: "Option A", "Option B", "Option C"
- ✅ "Current Responses: {}" displayed at bottom

**Test Interaction:**
1. Click some checkboxes
2. Watch "Current Responses" update in real-time
3. Check that `gridConfig.value` contains updated responses

### Test 2: Radio Grid with Unified Responses
**Set gridConfig to:**
```json
{"type":"radio","rows":["Question 1","Question 2"],"columns":["Yes","No","Maybe"],"responses":{}}
```

**Expected Results:**
- ✅ Component shows "✅ RADIO Grid"
- ✅ 2x3 grid of radio buttons appears
- ✅ Only one selection per row allowed
- ✅ "Current Responses" updates when selections change

### Test 3: Textbox Grid (NEW - misc type)
**Set gridConfig to:**
```json
{"type":"misc","rows":["Name","Email","Comments"],"responses":{"Name":"","Email":"","Comments":""}}
```

**Expected Results:**
- ✅ Component shows "📝 TEXTBOX Grid"
- ✅ 3 labeled text input fields appear
- ✅ Labels: "Name", "Email", "Comments"
- ✅ Placeholder text shows "Enter [field name]..."
- ✅ "Current Responses" updates as you type

**Test Interaction:**
1. Type in each text field
2. Watch "Current Responses" update in real-time
3. Verify `gridConfig.value` contains typed text

## 🔍 VALIDATION CHECKLIST

### Component Stability
- [ ] No "dead computer icon" errors
- [ ] No React rendering crashes
- [ ] Component renders all three types correctly
- [ ] Safe rendering with `safeStringify()` working

### Unified Structure
- [ ] Single `gridConfig` state variable contains everything
- [ ] Responses automatically update within same config object
- [ ] No separate response state variable needed
- [ ] Inspector panel shows unified JSON structure

### Response Handling
- [ ] Checkbox responses: `{"Question 1": {"Option A": true, "Option B": false}}`
- [ ] Radio responses: `{"Question 1": {"Yes": true}}`
- [ ] Textbox responses: `{"Name": "John Doe", "Email": "john@example.com"}`

## 🚨 TROUBLESHOOTING

### If Component Shows Debug Screen
- Check that JSON is valid (use JSON validator)
- Ensure `type` field is present and valid ("checkbox", "radio", or "misc")
- Verify `rows` array is present

### If Responses Don't Update
- Check browser console for errors
- Verify state variable binding is correct
- Ensure `gridConfig.value` is updating in Retool

### If Textboxes Don't Appear (misc type)
- Verify `rows` array contains field labels
- Check that `responses` object has matching keys
- Ensure `type` is exactly "misc"

## 📊 SUCCESS CRITERIA

**PASS**: All three grid types render correctly and responses update in unified structure
**FAIL**: Any crashes, rendering errors, or response update failures

## 🔄 NEXT STEPS AFTER TESTING

Once unified structure testing passes:
1. Update `stablegrid-api.js` with unified functions
2. Create JavaScript migration guide
3. Test programmatic control with new API
4. Document any issues found during testing

---

**Ready for Testing**: Version 69 deployed with unified config+responses structure
