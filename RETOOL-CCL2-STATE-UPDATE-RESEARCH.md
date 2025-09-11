# Retool CCL2 State Update Research - Critical Findings

## 🎯 Executive Summary

After extensive research into Retool Custom Component Libraries (CCL2) state update patterns, we discovered that:

1. **`window.Retool.modelUpdate()` is LEGACY API** - documented only for old custom components
2. **CCL2 uses `setStateValue()` pattern** - but has known state propagation issues
3. **State updates work internally** but don't always propagate to external Retool components
4. **Workarounds exist** using queries and events

## 📚 Research Sources

### Official Retool Documentation
- **CCL2 TypeScript API**: Uses `Retool.useStateString()` hooks with setter functions
- **Legacy Custom Components**: Documents `window.Retool.modelUpdate()` for old iframe-based components
- **Official Examples**: MaterialInput uses `setValue(e.target.value)` pattern

### Community Forum Evidence
- **State Update Issues**: Multiple reports of CCL2 components not propagating state changes
- **Workaround Solutions**: Users resort to queries and event triggers
- **Official Team Responses**: Confirm CCL2 uses inspector properties, not external setValue

## 🔍 Key Findings

### 1. Correct CCL2 Pattern (What We Should Use)
```typescript
const [configString, setConfigString] = Retool.useStateString({ 
  name: 'config',
  // ... other options
})

// Update state using the setter function
const updateResponses = (newResponses: any) => {
  const updatedConfig = { ...config, responses: newResponses }
  setConfigString(JSON.stringify(updatedConfig))  // ✅ CORRECT
}
```

### 2. Legacy Pattern (What We Mistakenly Tried)
```typescript
// ❌ LEGACY - Only for old iframe custom components
window.Retool.modelUpdate({ config: JSON.stringify(updatedConfig) })
```

### 3. Known CCL2 Limitations
From forum research, CCL2 has documented issues where:
- Component internal state updates correctly (display works)
- External components (buttons, variables) don't see the updates
- Workaround: Use queries that return component values

## 🐛 The Real Problem

Our issue isn't the update method - it's a **known CCL2 limitation**:

1. **Internal Updates Work**: Component display updates correctly
2. **External Propagation Fails**: `gridConfig.value` doesn't update
3. **Timing Issues**: State changes don't trigger external re-evaluation

## 🔧 Proven Workarounds

### Forum-Tested Solution
From community post: "Create a query which returns the value of auditQuestions.ready_to_submit and trigger this to run on the event trigger. The buttons etc.. all seem to be able to read the query correctly."

### Our Implementation Options
1. **Add Event Callbacks**: Use `Retool.useEventCallback()` to notify external components
2. **Query-Based Access**: Create queries that return component state
3. **Hybrid Approach**: Combine internal state with external event triggers

## 📋 Version History

- **V69**: Initial unified structure (no external updates)
- **V70**: Complex state re-parsing attempt (failed)
- **V71**: Official CCL2 pattern with `setConfigString()` (partial success)
- **V72**: Legacy `window.Retool.modelUpdate()` attempt (broke functionality)
- **V73**: Back to V71 pattern (current - working internally)

## 🎯 Current Status

**Version 73** uses the correct CCL2 pattern:
- ✅ Component display updates correctly
- ✅ Internal state management works
- ❌ External `gridConfig.value` doesn't update (known CCL2 issue)

## 🚀 Next Steps

1. **Accept Current Limitation**: V73 works for internal component functionality
2. **Implement Workaround**: Add event callbacks for external state access
3. **Document Limitation**: Update user guides about CCL2 state propagation issues
4. **Consider Query Pattern**: Implement query-based state access if needed

## 📖 Documentation Updates Needed

### RETOOL_COMPONENT_DEVELOPMENT_GUIDE.md
- Add section on CCL2 state propagation limitations
- Document `window.Retool.modelUpdate()` as legacy-only
- Include forum-tested workarounds
- Reference official examples and patterns

### User Guides
- Explain that component display updates work
- Document query-based workarounds for external access
- Set proper expectations about CCL2 limitations

## 🔗 Reference Links

- [Official CCL2 TypeScript API](https://docs.retool.com/apps/guides/custom/custom-component-libraries/typescript-api)
- [Legacy Custom Components](https://docs.retool.com/apps/guides/custom/legacy-custom)
- [Forum: State Update Issues](https://community.retool.com/t/bug-button-variable-not-reading-custom-component-output/58825)
- [Forum: CCL2 Development](https://community.retool.com/t/custom-components-library-development-using-typescript/57901)
- [Official Examples Repository](https://github.com/tryretool/custom-component-examples)

---

**Conclusion**: We're using the correct CCL2 pattern. The issue is a known limitation of CCL2 state propagation, not our implementation.
