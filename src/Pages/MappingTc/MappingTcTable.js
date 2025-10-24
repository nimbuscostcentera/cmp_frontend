import React, { useEffect, useMemo, useState } from "react";
import Table from "../../Components/Table";
import { toast, ToastContainer } from "react-toastify";
import useMappingTc from "../../Store/MasterStore/useMappingTc";

function MappingTcTable() {
  const [filteredData, setFilteredData] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [isAllEditable, setIsAllEditable] = useState(false);

  const {
    mappingTc,
    fetchMappingTc,
    fetchIsLoading,
    updateMappingTc,
    updateIsSuccess,
    updateError,
    clearUpdateState,
  } = useMappingTc();

  useEffect(() => {
    fetchMappingTc();
  }, []);

  const vendorList = useMemo(
    () => [
      { label: "Artisian", value: 1 },
      { label: "Staff", value: 2 },
      { label: "Dealer", value: 3 },
    ],
    []
  );

  // Transform backend data for table use
  const transformData = (data) => {
    return data.map((row) => {
      const ids =
        typeof row.id_enum === "string" && row.id_enum !== "null"
          ? row.id_enum.split(",").map((id) => Number(id.trim()))
          : [];

      const selectedOptions = vendorList.filter((opt) =>
        ids.includes(opt.value)
      );

      return {
        ...row,
        data: ids,
        selectedValue: selectedOptions,
        enumvalue: selectedOptions.map((item) => item.label).join(", ") || "",
      };
    });
  };

  useEffect(() => {
    if (mappingTc && mappingTc.length > 0) {
      setFilteredData(transformData(mappingTc));
    }
  }, [mappingTc, vendorList]);

  // Handle single input change
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const row = filteredData[index];

    const newPrefix =
      name === "Prefix_Voucher" ? value : row.Prefix_Voucher || "";
    const newMaxLength =
      name === "maxlength" ? parseInt(value) || 0 : row.maxlength || 0;

    const zeroCount = newMaxLength - newPrefix.length;
    const Max_Serial = zeroCount > 0 ? "0".repeat(zeroCount) : "";

    // Update edited rows
    setEditedRows((prev) => ({
      ...prev,
      [row.ID]: {
        ...prev[row.ID],
        Tc: row.Trancode,
        Prefix_Voucher: newPrefix,
        maxlength: newMaxLength,
        Max_Serial,
        id_enum: row.data?.join(",") || "",
      },
    }));

    // Update table data
    setFilteredData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [name]: value,
        Max_Serial,
      };
      return newData;
    });
  };

  // Handle multi-selection change
  const handleMultiSelectionChange = (selectedOptions, index, fieldName) => {
    const row = filteredData[index];
    if (!row) return;

    let array = selectedOptions?.map((item) => Number(item?.value)) || [];
    array = [...new Set(array)];

    const updatedRow = {
      Tc: row.Trancode,
      Prefix_Voucher: row.Prefix_Voucher,
      maxlength: row.maxlength,
      Max_Serial: row.Max_Serial,
      id_enum: array.join(","),
    };

    setEditedRows((prev) => ({
      ...prev,
      [row.ID]: {
        ...prev[row.ID],
        ...updatedRow,
      },
    }));

    setFilteredData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        data: array,
        selectedValue: selectedOptions,
        enumvalue: selectedOptions.map((item) => item.label).join(", ") || "",
      };
      return newData;
    });
  };

  const handleEnableEdit = () => {
    setIsAllEditable(true);
    toast.info(
      "Edit mode enabled. You can now edit all Prefix Voucher fields."
    );
  };

  const handleCancelEdit = () => {
    setIsAllEditable(false);
    setEditedRows({});
    setFilteredData(transformData(mappingTc));
    toast.info("Edit mode cancelled.");
  };

  const handleSaveAll = () => {
    const payload = Object.values(editedRows);
    if (!payload.length) {
      toast.info("No changes to save");
      return;
    }

    const invalidRow = payload.find(
      (item) =>
        item?.Prefix_Voucher?.length > item?.maxlength ||
        !item?.Max_Serial ||
        item.Max_Serial.length < 4 ||
        item?.Prefix_Voucher?.length > item?.maxlength - 4
    );

    if (invalidRow) {
      if (invalidRow.Prefix_Voucher?.length > invalidRow.maxlength) {
        toast.error(
          `Row with Tc ${invalidRow.Tc} exceeds Visible length of ${invalidRow.maxlength}.`
        );
      } else if (!invalidRow.Max_Serial || invalidRow.Max_Serial.length < 4) {
        toast.error(
          `Row with Tc ${invalidRow.Tc}: Serial number part must have at least 4 zeros.`
        );
      } else {
        toast.error(
          `Row with Tc ${invalidRow.Tc}: Prefix too long. Leave at least 4 characters for serial zeros.`
        );
      }
      return;
    }

    updateMappingTc(payload);
  };

  useEffect(() => {
    if (updateIsSuccess) {
      toast.success("MappingTC Updated Successfully");
      setEditedRows({});
      fetchMappingTc();
      setIsAllEditable(false);
    }
    if (updateError) toast.error(updateError);
    clearUpdateState();
  }, [updateIsSuccess, updateError]);

  const Col = [
    {
      headername: "Trancode",
      fieldname: "Trancode",
      width: "120px",
      isReadOnly: true,
    },
    {
      headername: "Interface",
      fieldname: "Interface",
      width: "200px",
      isReadOnly: true,
    },
    { headername: "Visible L.", fieldname: "maxlength", width: "150px" },
    {
      headername: "Prefix Voucher",
      fieldname: "Prefix_Voucher",
      width: "150px",
    },
    {
      headername: "Filled By",
      fieldname: "Max_Serial",
      width: "150px",
      isReadOnly: true,
    },
    {
      headername: "Enum Selection",
      fieldname: "enumvalue",
      selectionname: "selectedValue",
      labelname: "data",
      isMultiSelection: true,
      isSelection: true,
      options: vendorList,
      placeholder: "--Select Entry--",
    },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <ToastContainer />

      {/* ✅ Responsive Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center md:text-left">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Mapping TC Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isAllEditable
              ? "Edit mode active - modify Prefix Voucher values"
              : "View mode - click 'Edit All' to make changes"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-2">
          {!isAllEditable ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition duration-200 w-full sm:w-auto"
              onClick={handleEnableEdit}
              disabled={fetchIsLoading}
            >
              <i className="bi bi-pencil-square"></i>
              <span>Edit All</span>
            </button>
          ) : (
            <>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 transition duration-200 w-full sm:w-auto"
                onClick={handleCancelEdit}
              >
                <i className="bi bi-x-circle"></i>
                <span>Cancel</span>
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 w-full sm:w-auto"
                onClick={handleSaveAll}
                disabled={
                  Object.keys(editedRows).length === 0 || fetchIsLoading
                }
              >
                <i className="bi bi-check-all"></i>
                <span>Save All ({Object.keys(editedRows).length})</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ✅ Banner */}
      {isAllEditable && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg text-yellow-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-sm">
          <span>
            <i className="bi bi-exclamation-triangle mr-2"></i>
            Editing mode active — {Object.keys(editedRows).length} row(s)
            modified
          </span>
          <span className="text-sm text-yellow-600">
            Click any Prefix Voucher field to edit
          </span>
        </div>
      )}

      {/* ✅ Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto max-h-[60vh]">
        <Table
          tab={filteredData}
          OnChangeHandler={handleInputChange}
          Col={Col}
          isEdit={false}
          EditedData={editedRows}
          isLoading={fetchIsLoading}
          height="50vh"
          isAllEditable={isAllEditable}
          HandleMultiSelection={handleMultiSelectionChange}
        />
      </div>
    </div>
  );
}

export default MappingTcTable;
