import * as React from "react";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

// --- DynamicControl Component with setValue method ---
const DynamicControl = forwardRef(function DynamicControl({ config, value, onChange }: any, ref: any) {
  const [state, setState] = useState((config || value) || { rows: [], columns: [], type: null, responses: {} });

  // Sync with parent when props change
  useEffect(() => {
    const newValue = config || value;
    if (newValue) setState(newValue);
  }, [config, value]);

  const updateResponses = (newResponses: any) => {
    const updated = { ...state, responses: newResponses };
    setState(updated);
    if (onChange) onChange(updated);
  };

  // --- Expose setValue, getValue, and clearValue methods via ref ---
  useImperativeHandle(ref, () => ({
    setValue: (newValue: any) => {
      setState(newValue);
      if (onChange) onChange(newValue);
    },
    getValue: () => state,
    clearValue: () => {
      const cleared = { rows: [], columns: [], type: null, responses: {} };
      setState(cleared);
      if (onChange) onChange(cleared);
    }
  }), [state, onChange]);

  if (!state || !state.type) return <div>No configuration</div>;

  // Checkbox / Radio grid
  if (state.type === "checkbox" || state.type === "radio") {
    return (
      <table className="border-collapse border">
        <thead>
          <tr>
            <th></th>
            {state.columns.map((col: any, idx: number) => (
              <th key={idx} className="border p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.rows.map((row: any, rIdx: number) => (
            <tr key={rIdx}>
              <td className="border p-2">{row}</td>
              {state.columns.map((col: any, cIdx: number) => {
                const checked = !!state.responses?.[row]?.[col];
                const inputProps = {
                  checked,
                  onChange: (e: any) => {
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

  // Textbox grid
  if (state.type === "misc") {
    return (
      <div className="space-y-2">
        {Object.entries(state.responses || {}).map(([label, value], idx) => (
          <div key={idx} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type="text"
              value={String(value || '')}
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

// --- Dual export: individual component for rendering + library for CCL detection ---
export { DynamicControl };
export const AlchemerImitiation = {
  DynamicControl
};
