// LayoutMasterUI.jsx
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { masters } from "../Master/MasterLayouts/MasterInitialData";

function LayoutPrac() {
  const [ masterType, setMasterType ] = useState("im");

  const currMaster = masters.find((m) => m.type === masterType);

  ///                                         ui                                        ///
  return (
    <div className="w-[98%] p-2">
      <ToastContainer />

      {/* Master Selector */}
      {/* <div className="mb-3">
        <label className="mr-2 text-sm font-semibold">Select Master:</label>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm">
          <option>Master 1</option>
          <option>Master 2</option>
          <option>Master 3</option>
        </select>
      </div> */}

      <div className="masterDrop">
        <label className="mr-2 text-sm font-semibold">Select Master:</label>
        <select value={masters.find((m) => m.type === masterType)?.name} onChange={(e) => setMasterType(masters.find((m) => m.type === e.target.value)?.type)}>
       
          {masters.map((item) => (
            <option key={item.type} value={item.type}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Header */}
      <div className="w-full">
        <h1 className="mb-0 text-sm font-semibold">
          {currMaster?.name || "Unknown Master"}
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
                  <th className="px-2 py-1"></th>
                  <th className="px-2 py-1">Field 1*</th>
                  <th className="px-2 py-1">Field 2*</th>
                  <th className="px-2 py-1">Field 3*</th>
                  <th className="px-2 py-1">Field 4*</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1"></td>
                  <td className="px-2 py-1">
                    <input
                      type="text"
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                      placeholder="Enter value"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                      <option>Select option</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      className="border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                      placeholder="123"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="px-4 py-1 rounded text-white text-xs bg-green-600 hover:bg-green-700">
            Submit
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full mt-4">
        <h2 className="text-sm font-semibold mb-2">Table Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[400px] text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 border">#</th>
                <th className="px-2 py-1 border">Column 1</th>
                <th className="px-2 py-1 border">Column 2</th>
                <th className="px-2 py-1 border">Column 3</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border">1</td>
                <td className="px-2 py-1 border">Data A</td>
                <td className="px-2 py-1 border">Data B</td>
                <td className="px-2 py-1 border">Data C</td>
                <td className="px-2 py-1 border text-center">
                  <button className="text-blue-600 text-xs hover:underline mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 text-xs hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LayoutPrac;
