import React, { use, useEffect, useMemo, useState } from "react";
import useLayout3Master from "../../Store/MasterStore/useLayout3Master";
import useLayout5Master from "../../Store/MasterStore/useLayout5Master";
import useLayout12Master from "../../Store/MasterStore/useLayout12Master";
import useTab1 from "../../Store/OpeningStore/useTab1";

const DynamicFormInline = ({ tab, tableData, onSubmit, onDelete, onEdit }) => {

  const [foreignData, setForeignData] = useState({});
  const tabOpening = tab.openingTab;

  ///centralized layout hooks
  const layout3master = useLayout3Master();
  const layout12master = useLayout12Master();
  const layout5master = useLayout5Master();

  const layoutHooks = useMemo(() => {
    return {
      layout3: layout3master,
      layout5: layout5master,
      layout12: layout12master,
    };
  }, [layout3master, layout12master, layout5master]);

  const tab1 = useTab1();

  const activeHook = tab1;

  const tabData = activeHook[tabOpening] || [];
  // console.log(tabData);

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



  ///fetching foreign key data

  const fetchAllRequiredData = async () => {
    const foreignLayouts = tab.fields.filter(
      (f) => f.foreignKey && f.foreignKeyType
    );

    for (const fk of foreignLayouts) {

      const fkLayout = layoutHooks[fk.foreignKey];
      const capatalize = fk.foreignKey.charAt(0).toUpperCase() + fk.foreignKey.slice(1);
    

      const fkFetchFn =
        fkLayout[`fetch${capatalize}`] || fkLayout[`fetch${capatalize}Master`];

      // console.log(fkLayout[`fetch${capatalize}`]);

      if (fkFetchFn) {
        try {
          await fkFetchFn(fk.foreignKeyType);
        } catch (error) {
          console.error(
            `Error fetching data for foreign key ${fk.foreignKey}:`,
            error
          );
        }
      }
    }
    
  };
  

  useEffect(() => {
    console.log("Fetching foreign data...");
    fetchAllRequiredData();
  }, []); // Fetch foreign key data on mount



  useEffect(() => {
    const updatedFkData = {};
    tab.fields.forEach((field) => {
      if (field.foreignKey) {
        const fkLayout = layoutHooks[field.foreignKey]
        console.log(fkLayout);
        
        if (fkLayout) {
          updatedFkData[field.name] = fkLayout[field.foreignKey]
        }
      }
    })
    setForeignData(updatedFkData);
  }, [layoutHooks, tab.fields])
  
  console.log(foreignData);
  

  const emptyRow =
    tab.fields?.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}) || {};

  const [formData, setFormData] = useState(emptyRow);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowSave = (index) => {
    onEdit(tab.tabName, index, formData);
    setFormData(emptyRow);
    setEditIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tab.tabName, formData);
    setFormData(emptyRow);
  };

 // Fetch foreign key data on mount

  return (
    <div>
      {/* ===== INLINE FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-4 mb-4 border p-4 rounded shadow-md"
      >
        {tab.fields?.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              {field.label}*
            </label>
            {field.type === "dropdown" || field.type === "combo" ? (
              <select
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              >{foreignData.map((option) => (<option value="">{option}</option>))}
                
                {field.options
                  ? field.options.map((op) => <option key={op}>{op}</option>)
                  : ["Option 1", "Option 2"].map((op) => (
                      <option key={op}>{op}</option>
                    ))}
              </select>
            ) : (
              <input
                type={field.type}
                step={field.decimal ? "any" : undefined}
                placeholder={field.label}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>

      {/* ===== TABLE BELOW ===== */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-3 py-2">Row</th>
              {tab.fields?.map((f) => (
                <th key={f.name} className="px-3 py-2">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-2">Edit</th>
              <th className="px-3 py-2">Save</th>
              <th className="px-3 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {(tableData.length > 0 ? tableData : [emptyRow]).map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{i + 1}</td>
                {tab.fields?.map((f) => (
                  <td key={f.name} className="px-3 py-2">
                    {editIndex === i ? (
                      <input
                        value={row[f.name]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [f.name]: e.target.value,
                          }))
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : f.type === "combo" && row[f.name] ? (
                      row[f.name]
                    ) : f.type === "dropdown" && row[f.name] ? (
                      row[f.name]
                    ) : (
                      row[f.name]
                    )}
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => {
                      setEditIndex(i);
                      setFormData(row);
                    }}
                    className="text-blue-600"
                  >
                    ✎
                  </button>
                </td>
                <td className="px-3 py-2 text-center">
                  {editIndex === i && (
                    <button
                      onClick={() => handleRowSave(i)}
                      className="text-green-600"
                    >
                      💾
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => onDelete(tab.tabName, i)}
                    className="text-red-600"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicFormInline;
