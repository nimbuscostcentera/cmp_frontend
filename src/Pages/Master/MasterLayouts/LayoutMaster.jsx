// LayoutMaster.jsx (fully edited to support multi-select fields)
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import useLayout1Master from "../../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../../Store/MasterStore/useLayout2Master";
import useLayout3Master from "../../../Store/MasterStore/useLayout3Master";
import useLayout4Master from "../../../Store/MasterStore/useLayout4Master";
import useLayout5Master from "../../../Store/MasterStore/useLayout5Master";
import useLayout6Master from "../../../Store/MasterStore/useLayout6Master";
import useLayout7Master from "../../../Store/MasterStore/useLayout7Master";
import useLayout8Master from "../../../Store/MasterStore/useLayout8Master";
import useLayout9Master from "../../../Store/MasterStore/useLayout9Master";
import useLayout10Master from "../../../Store/MasterStore/useLayout10Master";
import useLayout11Master from "../../../Store/MasterStore/useLayout11Master";
import useLayout12Master from "../../../Store/MasterStore/useLayout12Master";
import useLayout13Master from "../../../Store/MasterStore/useLayout13Master";
import useLayout14Master from "../../../Store/MasterStore/useLayout14Master";
import { masters } from "./MasterInitialData";
import LayoutTable from "./LayoutTable";
import MasterDropdownMenu from "../../../Components/Dropdown/MasterDropdown"; // <- existing
import MultiSelectInput from "./MultiSelectInput "; // multi-select component you saved from canvas

function LayoutMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  const [foreignData, setForeignData] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  // single source of truth for selected master type
  const [mastertype, setMasterType] = useState(null);

  useEffect(() => {
    const routeType = location?.state?.type;
    const storedType = localStorage.getItem("selectedMasterType");

    const validRoute =
      routeType && masters.find((m) => m.type === routeType)?.type;
    const validStored =
      storedType && masters.find((m) => m.type === storedType)?.type;

    const initial = validRoute || validStored || masters[0]?.type || null;

    setMasterType(initial);

    if (routeType) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masters]);

  useEffect(() => {
    if (mastertype) {
      localStorage.setItem("selectedMasterType", mastertype);
    }
  }, [mastertype]);

  // Active master details
  const currentMaster = masters.find((m) => m.type === mastertype);
  const fields = currentMaster?.fields || [];
  const layout = currentMaster?.layout || "layout1";

  // Centralized layout hooks
  const layout1Master = useLayout1Master();
  const layout2Master = useLayout2Master();
  const layout3Master = useLayout3Master();
  const layout4Master = useLayout4Master();
  const layout5Master = useLayout5Master();
  const layout6Master = useLayout6Master();
  const layout7Master = useLayout7Master();
  const layout8Master = useLayout8Master();
  const layout9Master = useLayout9Master();
  const layout10Master = useLayout10Master();
  const layout11Master = useLayout11Master();
  const layout12Master = useLayout12Master();
  const layout13Master = useLayout13Master();
  const layout14Master = useLayout14Master();

  const layoutHooks = useMemo(
    () => ({
      layout1: layout1Master,
      layout2: layout2Master,
      layout3: layout3Master,
      layout4: layout4Master,
      layout5: layout5Master,
      layout6: layout6Master,
      layout7: layout7Master,
      layout8: layout8Master,
      layout9: layout9Master,
      layout10: layout10Master,
      layout11: layout11Master,
      layout12: layout12Master,
      layout13: layout13Master,
      layout14: layout14Master,
    }),
    [
      layout1Master,
      layout2Master,
      layout3Master,
      layout4Master,
      layout5Master,
      layout6Master,
      layout7Master,
      layout8Master,
      layout9Master,
      layout10Master,
      layout11Master,
      layout12Master,
      layout13Master,
      layout14Master,
    ]
  );

  const activeHook = layoutHooks[layout] || {};

  const {
    addError,
    addIsLoading,
    addIsSuccess,
    fetchIsLoading,
    fetchIsSuccess,
    updateIsSuccess,
    deleteIsSuccess,
    clearAddState,
  } = activeHook;

  const layoutData = activeHook[layout] || [];

  const capitalizedLayout = layout.charAt(0).toUpperCase() + layout.slice(1);

  const fetchFn =
    activeHook[`fetch${capitalizedLayout}`] ||
    activeHook[`fetch${capitalizedLayout}Master`];

  const addFn =
    activeHook[`add${capitalizedLayout}`] ||
    activeHook[`add${capitalizedLayout}Master`];

  // Initialize form data (multiselect fields begin as arrays)
  const [itemData, setItemData] = useState(
    fields.reduce((acc, f) => {
      if (f.type === "checkbox") return { ...acc, [f.name]: false };
      if (f.multiple) return { ...acc, [f.name]: [] };
      return { ...acc, [f.name]: "" };
    }, {})
  );

  // Reset when master changes
  useEffect(() => {
    setItemData(
      fields.reduce((acc, f) => {
        if (f.type === "checkbox") return { ...acc, [f.name]: false };
        if (f.multiple) return { ...acc, [f.name]: [] };
        return { ...acc, [f.name]: "" };
      }, {})
    );
    inputRef.current?.focus();
  }, [mastertype, fields]);

  // Fetch data + foreign masters
  const fetchAllRequiredData = useCallback(async () => {
    if (!fetchFn) return;

    // don't fetch for static masters (they are routed)
    if (currentMaster?.isStatic) return;

    try {
      await fetchFn(mastertype);
    } catch {
      await fetchFn();
    }

    const foreignLayouts = fields
      .filter((f) => f.foreignKey && f.foreignKeyType)
      .map((f) => ({
        layoutKey: f.foreignKey,
        type: f.foreignKeyType,
        field: f.name,
      }));

    for (const fk of foreignLayouts) {
      const fkHook = layoutHooks[fk.layoutKey];
      if (!fkHook) continue;

      const cap = fk.layoutKey.charAt(0).toUpperCase() + fk.layoutKey.slice(1);
      const fkFetchFn = fkHook[`fetch${cap}`] || fkHook[`fetch${cap}Master`];

      if (fkFetchFn) {
        try {
          await fkFetchFn(fk.type);
        } catch (err) {
          console.error(`Foreign fetch failed for ${fk.layoutKey}`, err);
        }
      }
    }
  }, [fetchFn, fields, layoutHooks, mastertype, currentMaster]);

  useEffect(() => {
    fetchAllRequiredData();
  }, [mastertype]);

  useEffect(() => {
    if (addIsSuccess || updateIsSuccess || deleteIsSuccess) {
      fetchAllRequiredData();
    }
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // Build foreignData map from hooks
  useEffect(() => {
    const updatedForeignData = {};
    fields.forEach((f) => {
      if (f.foreignKey && f.foreignKeyType) {
        const fkHook = layoutHooks[f.foreignKey];
        if (fkHook) {
          // try a few keys — keeps existing behavior but safer
          updatedForeignData[f.name] =
            fkHook[f.foreignKey] ||
            fkHook[f.foreignKey + "Master"] ||
            fkHook[Object.keys(fkHook)[0]] ||
            [];
        }
      }
    });
    setForeignData(updatedForeignData);
  }, [fields, layoutHooks]);

  const SaveData = () => {
    for (const f of fields) {
      if (f.type === "checkbox") continue;

      if (f.required) {
        const val = itemData[f.name];
        if (f.multiple) {
          if (!Array.isArray(val) || val.length === 0) {
            toast.error(`${f.label} is mandatory`);
            return;
          }
        } else {
          if (!val) {
            toast.error(`${f.label} is mandatory`);
            return;
          }
        }
      }
    }

    if (addFn) {
      try {
        const payload = { ...itemData };

        // ✅ convert arrays into CSV strings, ONLY for multi-select fields
        fields.forEach((f) => {
          if (f.multiple && Array.isArray(payload[f.name])) {
            payload[f.name] = payload[f.name].join(",");
          }
        });

        addFn(mastertype, payload);
      } catch {
        addFn(itemData);
      }
    } else {
      toast.error("No save function available for this layout");
    }
  };

  // Success/error toasts
  useEffect(() => {
    if (addIsSuccess) {
      toast.success(`${currentMaster?.name} added successfully`);
      setItemData(
        fields.reduce((acc, f) => {
          if (f.type === "checkbox") return { ...acc, [f.name]: false };
          if (f.multiple) return { ...acc, [f.name]: [] };
          return { ...acc, [f.name]: "" };
        }, {})
      );
    }
    if (addError) toast.error(addError);
    clearAddState && clearAddState();
  }, [addIsSuccess, addError]);

  // Enter toggles checkbox
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.type === "checkbox") {
      e.preventDefault();
      e.target.click();
    }
  };

  const handleInputChange = (e, f) => {
    let value = e.target.value;

    // Prevent negative input for number fields
    if (f.type === "number") {
      if (e.nativeEvent && (e.nativeEvent.data === "-" || value === "-"))
        return;

      if (value !== "" && Number(value) < 0) {
        value = "0";
      }
    }

    // decimal52 validation
    if (f.validate === "decimal52") {
      const regex = /^\d{0,5}(\.\d{0,2})?$/;
      if (!regex.test(value) && value !== "") {
        return;
      }
    }

    // block special chars for Code
    if (f.name.toLowerCase() === "code") {
      const regex = /^[A-Za-z0-9_]*$/;
      if (!regex.test(value)) {
        toast.error("Special characters are not allowed in Code field");
        return;
      }
    }

    if (f.maxLength && value.length > f.maxLength) {
      value = value.slice(0, f.maxLength);
    }

    setItemData((prev) => ({ ...prev, [f.name]: value }));
  };

  // Render
  return (
    <div className="w-[98%] p-2">
      <ToastContainer />

      {/* Top header: Master dropdown + title */}
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex items-center gap-2">
          <label className="mr-2 text-sm font-semibold">Select Master:</label>
          <MasterDropdownMenu
            masters={masters}
            setType={setMasterType}
            selectedType={mastertype}
            layoutMasterRoute="/auth/master"
          />
        </div>
      </div>

      <hr className="my-1" />

      {/* Input Section */}
      <div className="w-full mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="overflow-x-auto">
            <table className="text-sm min-w-[300px] border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1"></th>
                  {fields.map((f) => (
                    <th key={f.name} className="px-2 py-1">
                      {f.label}{" "}
                      {f.required && <span className="text-red-600">*</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1"></td>
                  {fields.map((f, idx) => {
                    // support both 'options' and 'Options' keys
                    const rawOptions = f.options || f.Options || [];
                    const mappedOptions = rawOptions.map((o) => ({
                      value: o.value ?? o.Value ?? o.id ?? o,
                      label: o.label ?? o.Label ?? o.name ?? o,
                    }));

                    const fkOptions =
                      f.foreignKey &&
                      Array.isArray(foreignData[f.name]) &&
                      foreignData[f.name].length > 0
                        ? foreignData[f.name].map((d) => ({
                            value:
                              d[f.optionValueField] ??
                              d[f.optionValueField?.toLowerCase()] ??
                              d.id,
                            label:
                              d[f.optionLabelField] ??
                              d[f.optionLabelField?.toLowerCase()] ??
                              d[Object.keys(d)[0]],
                          }))
                        : [];

                    const optionsToUse =
                      fkOptions.length > 0 ? fkOptions : mappedOptions;

                    return (
                      <td key={f.name} className="px-2 py-1">
                        {f.type === "select" && f.multiple ? (
                          <MultiSelectInput
                            field={f}
                            value={
                              Array.isArray(itemData[f.name])
                                ? itemData[f.name]
                                : []
                            }
                            onChange={(arr) =>
                              setItemData((prev) => ({
                                ...prev,
                                [f.name]: arr,
                              }))
                            }
                            options={optionsToUse}
                            placeholder={`Select ${f.label}`}
                          />
                        ) : f.type === "select" ? (
                          <select
                            name={f.name}
                            value={itemData[f.name] ?? ""}
                            onChange={(e) =>
                              setItemData((prev) => ({
                                ...prev,
                                [f.name]: e.target.value,
                              }))
                            }
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          >
                            <option value="">Select {f.label}</option>
                            {optionsToUse.map((opt, i) => (
                              <option key={i} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : f.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            name={f.name}
                            checked={Boolean(itemData[f.name])}
                            onChange={(e) =>
                              setItemData((prev) => ({
                                ...prev,
                                [f.name]: e.target.checked,
                              }))
                            }
                            onKeyDown={handleKeyDown}
                            ref={idx === 0 ? inputRef : null}
                          />
                        ) : (
                          <input
                            type={f.type || "text"}
                            name={f.name}
                            value={itemData[f.name] ?? ""}
                            onChange={(e) => handleInputChange(e, f)}
                            ref={idx === 0 ? inputRef : null}
                            maxLength={f.maxLength || undefined}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={SaveData}
            disabled={isDisable || addIsLoading}
            className={`px-4 py-1 rounded text-white text-xs ${
              isDisable || addIsLoading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {addIsLoading ? "Please wait..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full mt-4">
        <LayoutTable
          Col={fields}
          setIsDisable={setIsDisable}
          search={searchData}
          setTextDetail={setTextDetail}
          type={mastertype}
          layout={layout}
          layoutData={layoutData}
          currentMaster={currentMaster}
          foreignData={foreignData}
        />
      </div>
    </div>
  );
}

export default LayoutMaster;
