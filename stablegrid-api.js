// StableGrid Programmatic Control API
// Use this after confirming StableGrid component works in your Retool app

// SETUP INSTRUCTIONS:
// 1. Add StableGrid component to your app
// 2. Create a state variable named 'gridConfig' (string type, initial value: "")
// 3. Bind StableGrid's "Grid Config" property to {{ gridConfig.value }}
// 4. Use the functions below in your JavaScript queries

// Basic grid update function
function updateGrid(columns, rows) {
  const config = {
    columns: columns,
    rows: rows
  };
  
  gridConfig.setValue(JSON.stringify(config));
}

// Example usage:
// updateGrid(
//   [
//     {"field": "name", "headerName": "Name", "width": 150},
//     {"field": "age", "headerName": "Age", "width": 100}
//   ],
//   [
//     {"name": "John", "age": 30},
//     {"name": "Jane", "age": 25}
//   ]
// );

// Quick test function - run this to verify programmatic control works
function testStableGrid() {
  const testData = {
    "columns": [
      {"field": "id", "headerName": "ID", "width": 80},
      {"field": "task", "headerName": "Task", "width": 250},
      {"field": "status", "headerName": "Status", "width": 120}
    ],
    "rows": [
      {"id": 1, "task": "Test task 1", "status": "Active"},
      {"id": 2, "task": "Test task 2", "status": "Complete"},
      {"id": 3, "task": "Test task 3", "status": "Pending"}
    ]
  };
  
  gridConfig.setValue(JSON.stringify(testData));
  console.log("StableGrid test data loaded");
}

// Clear grid function
function clearGrid() {
  gridConfig.setValue("");
}

// Load data from Retool query result
function loadGridFromQuery(queryResult) {
  if (!queryResult || !queryResult.data) {
    console.error("Invalid query result");
    return;
  }
  
  // Assuming your query returns data with columns and rows
  const config = {
    columns: queryResult.data.columns || [],
    rows: queryResult.data.rows || []
  };
  
  gridConfig.setValue(JSON.stringify(config));
}

// Example for dynamic data updates
function updateGridWithDynamicData(dataArray, columnDefinitions) {
  const config = {
    columns: columnDefinitions,
    rows: dataArray
  };
  
  gridConfig.setValue(JSON.stringify(config));
}

// TESTING CHECKLIST:
// □ StableGrid component added to app
// □ State variable 'gridConfig' created and bound
// □ testStableGrid() function runs without errors
// □ Grid updates when function is called
// □ No "dead computer icon" appears
// □ Component remains stable during rapid updates

console.log("StableGrid API loaded. Run testStableGrid() to verify programmatic control.");
