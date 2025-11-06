import React, { useState, useRef, useEffect } from "react";

/**
 * MultiSelectInput (fixed + string mode support)
 * - Dropdown now positions immediately below input.
 * - Input remains fixed height with horizontal scrolling for chips.
 * - Supports string output mode for backend fields expecting a single character or comma-separated string.
 */
export default function MultiSelectInput({ field, value = [], onChange, options = [], placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 220 });
  const containerRef = useRef();

  const selected = Array.isArray(value) ? value : [];

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // compute dropdown position
  useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const preferBelow = spaceBelow >= 180 || spaceBelow >= spaceAbove;
    const maxHeight = preferBelow ? Math.min(320, spaceBelow - 12) : Math.min(320, spaceAbove - 12);
    const top = preferBelow ? rect.bottom + 6 : rect.top - maxHeight - 6;

    setDropdownPos({ top, left: rect.left, width: rect.width, maxHeight });
  }, [open]);

  // handle option toggle
  const toggleOption = (optValue) => {
    let newSelected;
    if (selected.includes(optValue)) newSelected = selected.filter((v) => v !== optValue);
    else newSelected = [...selected, optValue];

    // if only one selection is allowed or field expects string, send as string
    if (!field.multiple || field.forceString) {
      onChange(optValue);
    } else if (field.stringMode) {
      onChange(newSelected.join(",")); // convert to comma-separated string
    } else {
      onChange(newSelected);
    }
  };

  const removeChip = (optValue) => {
    const newSelected = selected.filter((v) => v !== optValue);
    if (field.stringMode) onChange(newSelected.join(","));
    else onChange(newSelected);
  };

  const labelFor = (val) => {
    const o = options.find((it) => String(it.value) === String(val));
    return o ? o.label : val;
  };

  return (
    <div ref={containerRef} className="relative min-w-[220px] max-w-[600px]">
      <div
        className="flex items-center gap-2 border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer min-h-[36px] bg-white"
        onClick={() => setOpen((s) => !s)}
        role="button"
        aria-expanded={open}
      >
        <div className="flex gap-1 items-center overflow-x-auto whitespace-nowrap max-w-[85%]">
          {selected.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            selected.map((v) => (
              <span key={v} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-0.5 text-[11px] mr-1">
                <span className="max-w-[200px] truncate inline-block">{labelFor(v)}</span>
                <button
                  type="button"
                  className="ml-1 text-gray-500 hover:text-gray-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(v);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        <div className="ml-auto text-gray-500">▾</div>
      </div>

      {open && (
        <div
          className="z-[9999] bg-white border border-gray-200 rounded shadow-md overflow-auto text-sm"
          style={{
            position: "fixed",
            top: dropdownPos.top + "px",
            left: dropdownPos.left + "px",
            width: dropdownPos.width + "px",
            maxHeight: dropdownPos.maxHeight + "px",
            overflowY: "auto",
          }}
        >
          {options.length === 0 ? (
            <div className="p-2 text-gray-500">No options</div>
          ) : (
            options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                />
                <span className="truncate">{opt.label}</span>
              </label>
            ))
          )}
        </div>
      )}

      <input type="hidden" name={field.name} value={Array.isArray(selected) ? selected.join(",") : selected} />
    </div>
  );
}
