import * as React from "react";
import { useState, forwardRef, useImperativeHandle } from "react";



// --- DynamicControl Component ---
const DynamicControl = forwardRef(function DynamicControl({ config, onChange }, ref) {
  const [state, setState] = useState(config || { rows: [], columns: [], type: null, responses: {} });

  const updateResponses = (newResponses) => {
    const updated = { ...state, responses: newResponses };
    setState(updated);
    if (onChange) onChange(updated);
  };

  // --- Clear method ---
  useImperativeHandle(ref, () => ({
    clearValue: () => {
      const cleared = { rows: [], columns: [], type: null, responses: {} };
      setState(cleared);
      if (onChange) onChange(cleared);
    }
  }));

  if (!state || !state.type) return <div>No configuration</div>;

  if (state.type === "checkbox" || state.type === "radio") {
    return (
      <table className="border-collapse border">
        <thead>
          <tr>
            <th></th>
            {state.columns.map((col, idx) => (
              <th key={idx} className="border p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.rows.map((row, rIdx) => (
            <tr key={rIdx}>
              <td className="border p-2">{row}</td>
              {state.columns.map((col, cIdx) => {
                const checked = !!state.responses?.[row]?.[col];
                const inputProps = {
                  checked,
                  onChange: (e?: any) => {
                    if (state.type === "checkbox") {
                      const newResponses = {
                        ...state.responses,
                        [row]: { ...(state.responses?.[row] || {}), [col]: e.target.checked },
                      };
                      updateResponses(newResponses);
                    } else if (state.type === "radio") {
                      const newResponses = { ...state.responses, [row]: { [col]: true } };
                      updateResponses(newResponses);
                    }
                  }
                };
                return (
                  <td key={cIdx} className="border p-2 text-center">
                    <input type={state.type} {...inputProps} name={row} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (state.type === "misc") {
    return (
      <div className="space-y-2">
        {Object.entries(state.responses || {}).map(([label, value], idx) => (
          <div key={idx} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type="text"
              value={value}
              className="border rounded p-1"
              onChange={(e) => {
                const newResponses = { ...state.responses, [label]: e.target.value };
                updateResponses(newResponses);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return <div>Unknown type: {state.type}</div>;
});

// --- Named export for CCL v2 ---
export { DynamicControl };

