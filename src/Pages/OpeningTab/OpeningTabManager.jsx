import React, { useState } from "react";
import { openingInitial } from "./OpeningInitial";
import DynamicFormInline from "./DynamicFormInline";


const OpeningTabManager = () => {
  const [activeTab, setActiveTab] = useState(openingInitial[0]);
  const [tableData, setTableData] = useState({}); // store submitted rows

  const handleSubmit = (name, data) => {
    setTableData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), data],
    }));
  };

  const handleDelete = (name, index) => {
    setTableData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (name, index, updatedRow) => {
    setTableData((prev) => ({
      ...prev,
      [name]: prev[name].map((row, i) => (i === index ? updatedRow : row)),
    }));
  };

  return (
    <div className="p-4">
      {/* TAB HEADERS */}
      <div className="flex space-x-4 border-b mb-4">
        {/* {openingInitial.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab.name === tab.name
                ? "border-2 border-blue-500 border-b-0 bg-blue-100 text-blue-700 rounded-t-lg px-4 py-2 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.name}
          </button>
        ))} */}
        {openingInitial.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold ${
              activeTab.name === tab.name
                ? "border-2 border-blue-500 border-b-0 bg-blue-100 text-blue-700 rounded-t-lg px-4 py-2 font-medium"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >{tab.name}</button>)
        )}
      </div>

      {/* INLINE FORM + TABLE */}
      <DynamicFormInline
        tab={activeTab}
        tableData={tableData[activeTab.name] || []}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default OpeningTabManager;
