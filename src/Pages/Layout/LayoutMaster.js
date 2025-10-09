// pages/LayoutMaster/LayoutMaster.js
import React, { useEffect, useRef, useState } from "react";
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
import masterMapping from "../../Utils/mastermapping";
import { masters } from "../Home/MasterInitialData";
import LayoutTable from "./LayoutTable";

function LayoutMaster() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");

  // 👇 default master
  const [mastertype, setMasterType] = useState("im");

  /// get master info
  const currentMaster = masters.find((m) => m.type === mastertype);
  const fields = currentMaster?.fields || [];
  const layout = currentMaster?.layout || "layout1";

  /// initialize form data
  const [itemData, setItemData] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );

  // all layout hooks grouped
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
  };

  // get correct hook for current layout
  const activeHook = layoutHooks[layout] || {};

  const {
    addError,
    addIsLoading,
    addIsSuccess,
    // dynamic function names (like addLayout1, addLayout9, etc.)
    [`add${layout.charAt(0).toUpperCase() + layout.slice(1)}`]: addFn,
    [`fetch${layout.charAt(0).toUpperCase() + layout.slice(1)}`]: fetchFn,
    fetchIsLoading,
    updateIsSuccess,
    deleteIsSuccess,
    clearAddState,
    [layout]: layoutData,
  } = activeHook;

  // fetch on change
  useEffect(() => {
    if (mastertype && fetchFn) fetchFn(mastertype);
  }, [mastertype, addIsSuccess, updateIsSuccess, deleteIsSuccess]);

  // reset form when mastertype changes
  useEffect(() => {
    setItemData(fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}));
    inputRef.current?.focus();
  }, [mastertype, fields]);

  const OnChangeHandler = (e) => {
    const { name, value, type: elType, checked } = e.target;
    // handle checkbox values too
    setItemData((prev) => ({
      ...prev,
      [name]: elType === "checkbox" ? checked : value,
    }));
  };

  ///saveData function
  const SaveData = () => {
    for (const f of fields) {
      if (!itemData[f.name]) {
        toast.error(`${f.label} is mandatory`);
        return;
      }
    }
    if (itemData.Code && !/^[a-zA-Z0-9]{1,6}$/.test(itemData.Code)) {
      toast.error("Code must be max 6 alphanumeric chars");
      return;
    }
    if (
      itemData.Description &&
      !/^[a-zA-Z0-9 ]{1,15}$/.test(itemData.Description)
    ) {
      toast.error("Description must be max 15 chars");
      return;
    }
    if (addFn) {
      // pass type first — store expects (type, payload)
      addFn(mastertype, itemData);
    } else {
      toast.error("No save function available for this layout");
    }
  };

  useEffect(() => {
    if (addIsSuccess) {
      toast.success(`${mastertype} Added Successfully`);
      setItemData(fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}));
    }
    if (addError) {
      toast.error(addError);
    }
    clearAddState && clearAddState();
  }, [addIsSuccess, addError, fields, mastertype]);

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

      {/* Header */}
      <div className="w-full">
        <h1 className="mb-0 text-sm md:text-base font-semibold">
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
                  <th className="w-[30px] px-2 py-1">
                    <i className="bi bi-tag text-xs md:text-sm"></i>
                  </th>
                  {fields.map((f) => (
                    <th
                      key={f.name}
                      className="text-left px-2 py-1 text-xs md:text-sm"
                    >
                      {f.label}*
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-2 py-1">
                    <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                  </td>
                  {fields.map((f, idx) => (
                    <td key={f.name} className="px-2 py-1">
                      {f.type === "select" ? (
                        <select
                          name={f.name}
                          value={itemData[f.name]}
                          onChange={OnChangeHandler}
                          className={`border border-gray-300 rounded px-2 py-1 text-xs md:text-sm ${f.width} focus:outline-none focus:ring-1 focus:ring-blue-400`}
                        >
                          <option value="">Select {f.label}</option>
                          {/* dynamic options placeholder — keep existing */}
                          <option value="1">Option 1</option>
                          <option value="2">Option 2</option>
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
                          placeholder={`Enter ${f.name}`}
                          name={f.name}
                          value={itemData[f.name]}
                          onChange={OnChangeHandler}
                          maxLength={f.maxLength}
                          ref={idx === 0 ? inputRef : null}
                          className={`border border-gray-300 rounded px-2 py-1 text-xs md:text-sm ${f.width} focus:outline-none focus:ring-1 focus:ring-blue-400`}
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
            className={`px-4 py-1 rounded text-white text-xs md:text-sm ${
              isDisable || addIsLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {addIsLoading ? "Please wait..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Textarea & Search */}
      <div className="w-full my-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <textarea
            value={textDetail}
            readOnly
            placeholder="Detail View"
            className="w-full border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none min-w-[180px]"
            rows={2}
          />
          <div className="flex-grow min-w-[180px]">
            <div className="flex items-center border border-blue-400 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-blue-300">
              <i className="bi bi-search text-gray-400 mr-2"></i>
              <input
                value={searchData}
                type="search"
                placeholder="Search here..."
                onChange={(e) => setSearchData(e.target.value)}
                className="w-full border-0 outline-none bg-transparent text-xs md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full">
        <LayoutTable
          Col={fields}
          setIsDisable={setIsDisable}
          search={searchData}
          setTextDetail={setTextDetail}
          type={mastertype}      // master short type like 'im'
          layout={layout}        // layout string like 'layout1' etc — important!
          layoutData={layoutData}
        />
      </div>
    </div>
  );
}

export default LayoutMaster;
