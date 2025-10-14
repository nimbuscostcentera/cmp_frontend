// pages/LayoutMaster/LayoutMaster.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";

import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import useLayout2Master from "../../Store/MasterStore/useLayout2Master";
import useLayout3Master from "../../Store/MasterStore/useLayout3Master";
import useLayout4Master from "../../Store/MasterStore/useLayout4Master";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";
import useLayout6Master from "../../Store/MasterStore/useLayout6Master";
import useLayout7Master from "../../Store/MasterStore/useLayout7Master";
import useLayout8Master from "../../Store/MasterStore/useLayout8Master";
import useLayout9Master from "../../Store/MasterStore/useLayout9Master";
import useLayout10Master from "../../Store/MasterStore/useLayout10Master";
import useLayout11Master from "../../Store/MasterStore/useLayout11Master";
import useLayout12Master from "../../Store/MasterStore/useLayout12Master";
import useLayout13Master from "../../Store/MasterStore/useLayout13Master";

import { masters } from "../Home/MasterInitialData";
import LayoutTable from "./LayoutTable";
import masterMapping from "../../Utils/mastermapping";

function LayoutMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [mastertype, setMasterType] = useState("cm");
  const [foreignData, setForeignData] = useState({});

  /// Active master details
  const currentMaster = masters.find((m) => m.type === mastertype);
  const fields = currentMaster?.fields || [];
  const layout = currentMaster?.layout || "layout1";

  /// ✅ Centralized layout hooks
  const layoutHooks = {
    layout1: useLayout1Master(),
    layout2: useLayout2Master(),
    layout3: useLayout3Master(),
    layout4: useLayout4Master(),
    layout5: useLayout5Master(),
    layout6: useLayout6Master(),
    layout7: useLayout7Master(),
    layout8: useLayout8Master(),
    layout9: useLayout9Master(),
    layout10: useLayout10Master(),
    layout11: useLayout11Master(),
    layout12: useLayout12Master(),
    layout13: useLayout13Master(),
  };

  /// ✅ Active hook and states
  const activeHook = layoutHooks[layout] || {};
  const {
    addError,
    addIsLoading,
    addIsSuccess,
    fetchIsLoading,
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

  // ✅ Controlled form data
  const [itemData, setItemData] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );

  // Reset when master changes
  useEffect(() => {
    setItemData(fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}));
    inputRef.current?.focus();
  }, [mastertype, fields]);

  // 🧠 Smart unified data fetcher (main + foreign)
  const fetchAllRequiredData = useCallback(async () => {
    if (!fetchFn) return;

    try {
      await fetchFn(mastertype);
    } catch {
      await fetchFn();
    }

    /// 🔹 Fetch foreign key layouts
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
  }, [fetchFn, fields, layoutHooks, mastertype]);

  ///🔁 Fetch on master change
  useEffect(() => {
    fetchAllRequiredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mastertype]);

  /// 🔁 Refresh after CRUD actions
  useEffect(() => {
    if (addIsSuccess || updateIsSuccess || deleteIsSuccess) {
      fetchAllRequiredData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // ✅ Reactive sync for foreign key data (fix for missing options)
  useEffect(() => {
    const updatedForeignData = {};

    fields.forEach((f) => {
      if (f.foreignKey && f.foreignKeyType) {
        const fkHook = layoutHooks[f.foreignKey];
        if (fkHook) {
          updatedForeignData[f.name] = fkHook[f.foreignKey] || [];
        }
      }
    });

    setForeignData(updatedForeignData);
  }, [fields, layoutHooks]);

  // 🧾 Input change
  const OnChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 💾 Save handler
  const SaveData = () => {
    for (const f of fields) {
      if (f.type === "checkbox") continue;
      if (!itemData[f.name]) {
        toast.error(`${f.label} is mandatory`);
        return;
      }
    }

    if (addFn) {
      try {
        addFn(mastertype, itemData);
      } catch {
        addFn(itemData);
      }
    } else {
      toast.error("No save function available for this layout");
    }
  };

  // ✅ Success/error toasts
  useEffect(() => {
    if (addIsSuccess) {
      toast.success(`${currentMaster.name} added successfully`);
      setItemData(fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}));
    }
    if (addError) toast.error(addError);
    clearAddState && clearAddState();
  }, [addIsSuccess, addError]);

  // 🖼️ Render UI
  return (
    <div className="w-[98%] p-2">
      <ToastContainer />

      {/* Master Selector */}
      <div className="mb-3">
        <label className="mr-2 text-sm font-semibold">Select Master:</label>
        <select
          value={masters.find((m) => m.type === mastertype)?.name}
          onChange={(e) =>
            setMasterType(masters.find((m) => m.name === e.target.value)?.type)
          }
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {masters.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <h1 className="mb-0 text-sm font-semibold">
          {masterMapping[mastertype] || mastertype}
        </h1>
        <hr className="my-1" />
      </div>

      {/* Input Section */}
      <div className="w-full mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="overflow-x-auto">
            <table className="text-sm min-w-[300px] border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1">#</th>
                  {fields.map((f) => (
                    <th key={f.name} className="px-2 py-1">
                      {f.label}*
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1">→</td>
                  {fields.map((f, idx) => (
                    <td key={f.name} className="px-2 py-1">
                      {f.type === "select" ? (
                        <select
                          name={f.name}
                          value={itemData[f.name] ?? ""}
                          onChange={OnChangeHandler}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="">Select {f.label}</option>

                          {/* Dynamic options */}
                          {f.foreignKey &&
                          Array.isArray(foreignData[f.name]) &&
                          foreignData[f.name].length > 0
                            ? foreignData[f.name].map((d, i) => (
                                <option key={i} value={d[f.optionValueField]}>
                                  {d[f.optionLabelField]}
                                </option>
                              ))
                            : f.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                        </select>
                      ) : f.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          name={f.name}
                          checked={!!itemData[f.name]}
                          onChange={OnChangeHandler}
                          ref={idx === 0 ? inputRef : null}
                        />
                      ) : (
                        <input
                          type={f.type || "text"}
                          name={f.name}
                          value={itemData[f.name] ?? ""}
                          onChange={OnChangeHandler}
                          ref={idx === 0 ? inputRef : null}
                          className="border border-gray-300 rounded px-2 py-1 text-xs"
                        />
                      )}
                    </td>
                  ))}
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
        />
      </div>
    </div>
  );
}

export default LayoutMaster;
