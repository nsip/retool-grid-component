# StableGrid Component Reset API

## Overview
The StableGrid component now supports clearing its state even when not visible through a config-based reset mechanism.

## Reset Method

To clear both the component's config and currentResponses state:

```javascript
// Set the component config to the special reset command
assessorGrid.config = '{"type":"RESET_COMPONENT"}'
```

## What Gets Reset
- **Internal config state**: Cleared to empty string
- **External currentResponses state**: Reset to empty object `{}`
- **Component display**: Returns to initial debug/setup state
- **Event notification**: Fires `onResponsesChanged` event

## Usage Examples

### Basic Reset
```javascript
// Clear all component state
assessorGrid.config = '{"type":"RESET_COMPONENT"}'
```

### Reset in JavaScript Query
```javascript
// In a JavaScript query or event handler
return assessorGrid.config = '{"type":"RESET_COMPONENT"}'
```

### Reset When Component Not Visible
```javascript
// This works even when the component is hidden/not visible
if (!assessorGrid.visible) {
  assessorGrid.config = '{"type":"RESET_COMPONENT"}'
}
```

## Verification

After reset, you can verify the state is cleared:

```javascript
// Check that config is empty
console.log('Config:', assessorGrid.config) // Should be ""

// Check that responses are empty
console.log('Responses:', assessorGrid.currentResponses) // Should be "{}"
```

## Technical Details

- The reset is triggered by detecting `{"type":"RESET_COMPONENT"}` in the config
- Uses React useEffect to monitor config changes and trigger reset
- Clears both internal state (for component display) and external state (for external access)
- Works regardless of component visibility status
- Fires the `onResponsesChanged` event to notify external listeners

## Migration from Direct Assignment

**Old approach (doesn't work when not visible):**
```javascript
assessorGrid.currentResponses = {}  // ❌ Fails when component not visible
```

**New approach (works always):**
```javascript
assessorGrid.config = '{"type":"RESET_COMPONENT"}'  // ✅ Works when component not visible
