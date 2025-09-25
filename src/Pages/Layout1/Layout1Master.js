// pages/Layout1Master/Layout1Master.js
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Layout1Table from "./Layout1Table";
import useLayout1Master from "../../Store/MasterStore/useLayout1Master";
import "../../Components/Table/table.css";
import masterMapping from "../../Utils/mastermapping";

function Layout1Master() {
  const inputRef = useRef();
  const [searchData, setSearchData] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [textDetail, setTextDetail] = useState("");
  const [type, setType] = useState("cm");

  const [itemData, setItemData] = useState({
    Code: "",
    Description: "",
  });

  const {
    addError,
    addIsLoading,
    addIsSuccess,
    addLayout1,
    clearAddState,
  } = useLayout1Master();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [type]);

  // Handle input changes
  const OnChangeHandler = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  // Save new item
  const SaveData = () => {
    const { Code, Description } = itemData;
    if (!Code || !Description) {
      toast.error("Fill the mandatory fields");
      return;
    }
    if (!/^[a-zA-Z0-9]{1,6}$/.test(Code)) {
      toast.error("Code must be max 6 chars");
      return;
    }
    if (!/^[a-zA-Z0-9 ]{1,15}$/.test(Description)) {
      toast.error("Description must be max 15 chars");
      return;
    }
    addLayout1(type, { Code, Description });
  };

  // Handle Add state changes
  useEffect(() => {
    if (addIsSuccess) {
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Added Successfully`
      );
      setItemData({ Code: "", Description: "" });
    }
    if (addError) {
      toast.error(addError);
    }
    clearAddState();
  }, [addIsSuccess, addError]);

  ///////////////////////////
  return (
    <div className="w-[98%] p-2">
      <ToastContainer />

      {/* Header */}
      <div className="w-full">
        <div className="flex items-center">
          <h5 className="mb-0 text-sm md:text-base font-semibold">
            {masterMapping[type]}
          </h5>
        </div>
        <hr className="my-1" />
      </div>

      {/* Input Section */}
      <div className="w-full mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Table for inputs */}
          <div className="overflow-x-auto">
            <table className="text-sm min-w-[300px] border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[30px] px-2 py-1">
                    <i className="bi bi-tag text-xs md:text-sm"></i>
                  </th>
                  <th className="text-left px-2 py-1 text-xs md:text-sm">
                    Code*
                  </th>
                  <th className="text-left px-2 py-1 text-xs md:text-sm">
                    Description*
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-2 py-1">
                    <i className="bi bi-caret-right-fill text-xs md:text-sm"></i>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      placeholder="Enter Code"
                      name="Code"
                      value={itemData?.Code || ""}
                      onChange={OnChangeHandler}
                      maxLength={6}
                      ref={inputRef}
                      className="border border-gray-300 rounded px-2 py-1 text-xs md:text-sm w-[100px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      placeholder="Enter Description"
                      name="Description"
                      value={itemData?.Description || ""}
                      onChange={OnChangeHandler}
                      maxLength={15}
                      className="border border-gray-300 rounded px-2 py-1 text-xs md:text-sm w-[180px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Submit button */}
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
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
            {/* Textarea */}
            <textarea
              value={textDetail}
              readOnly
              placeholder="Detail View"
              className="w-full border border-blue-400 rounded p-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none min-w-[180px]"
              rows={2}
            />

            {/* Search */}
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
      </div>

      {/* Data Table */}
      <div className="w-full">
        <Layout1Table
          isDisable={isDisable}
          setIsDisable={setIsDisable}
          search={searchData}
          setTextDetail={setTextDetail}
          type={type}
        />
      </div>
    </div>
  );
}

export default Layout1Master;
