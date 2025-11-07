import React, { useRef } from "react";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Action button
const ActionButton = ({ icon, color, onClick, disabled, title }) => (
  <button
    className="p-0 m-0 flex items-center justify-center h-7 w-7 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{ color: disabled ? "lightgrey" : color || "#ac4bec" }}
  >
    <i className={`bi bi-${icon} text-base`} />
  </button>
);

// ✅ Cell renderer with foreign key label support and select-on-edit for foreign keys
const RenderCellContent = ({
  item,
  field,
  index,
  ActionId,
  EditedData,
  OnChangeHandler,
  useInputRef,
}) => {
  const isEditing = ActionId === index && !field?.isNotEditable;
  const isCodeField = (field?.fieldname || "").toLowerCase().includes("code");

  // Checkbox editable
  if (isEditing && field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        name={field.fieldname}
        checked={!!EditedData[field.fieldname]}
        ref={field?.isUseInputRef ? useInputRef : null}
        onChange={(e) => OnChangeHandler(index, e)}
        className="cursor-pointer"
        disabled={isCodeField}
      />
    );
  }

  // 🧩 Dropdown for both foreign key and hardcoded options
  if (
    isEditing &&
    (field.foreignKey || (field.options && field.options.length))
  ) {
    const options = field.foreignKey
      ? Array.isArray(field.foreignOptions)
        ? field.foreignOptions
        : []
      : Array.isArray(field.options)
      ? field.options
      : [];

    const val = EditedData[field.fieldname] ?? item[field.fieldname] ?? "";

    return (
      <select
        name={field.fieldname}
        value={val}
        ref={field?.isUseInputRef ? useInputRef : null}
        onChange={(e) => OnChangeHandler(index, e)}
        className="form-select w-full border rounded px-1 py-0.5 text-sm"
      >
        <option value="" className="text-center">
          -- Select --
        </option>
        {options.map((opt, i) => {
          const value =
            (field.optionValueField && opt[field.optionValueField]) ||
            opt.value ||
            opt.id ||
            opt.ID ||
            opt[Object.keys(opt)[0]];
          const label =
            (field.optionLabelField && opt[field.optionLabelField]) ||
            opt.label ||
            opt.Code ||
            opt[Object.keys(opt)[1]] ||
            value;
          return (
            <option key={i} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    );
  }

  // Input editable
  // Editable: input or dropdown (for foreign key)
  // 🧾 Regular input field
  if (isEditing) {
    console.log("Foreign options for", field.fieldname, field.foreignOptions);

    // 🔽 Foreign key dropdown
    if (field.foreignKey && Array.isArray(field.foreignOptions)) {
      return (
        <select
          name={field.fieldname}
          value={EditedData[field.fieldname] || ""}
          onChange={(e) => OnChangeHandler(index, e)}
          ref={field?.isUseInputRef ? useInputRef : null}
          className="form-select w-full border rounded px-1 py-0.5 text-sm"
        >
          <option value="">-- Select --</option>
          {field.foreignOptions.map((opt, i) => (
            <option key={i} value={opt[field.optionValueField || "ID"]}>
              {opt[field.optionLabelField || "Name"]}
            </option>
          ))}
        </select>
      );
    }

    // ✅ BLOCK NEGATIVE VALUES FOR NUMBER TYPE
    const handleNumberInput = (e) => {
      const val = e.target.value;

      // If user tries to type '-' or negative number, stop it
      if (val.includes("-") || Number(val) < 0) {
        toast.error("Negative values are not allowed");
        return;
      }

      OnChangeHandler(index, e);
    };

    return (
      <input
        name={field.fieldname}
        maxLength={field.max}
        placeholder={field.label}
        value={EditedData[field.fieldname] || ""}
        ref={field?.isUseInputRef ? useInputRef : null}
        type={field.type || "text"}
        onChange={
          field.type === "no" || field.type === "number"
            ? handleNumberInput
            : (e) => OnChangeHandler(index, e)
        }
        className="input-cell form-input w-full"
        readOnly={field?.isReadOnly || isCodeField}
      />
    );
  }

  // Image view
  if (field.type === "Img") {
    const imageUrl = item[field.fieldname] || defaultimage;
    return (
      <img
        src={imageUrl}
        alt=""
        className="h-6 w-6 object-cover cursor-pointer"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultimage;
        }}
      />
    );
  }

  // Checkbox view
  if (field.type === "checkbox") {
    return (
      <span className="text-green-600 font-bold text-center">
        {item[field.fieldname] ? "✅" : "❌"}
      </span>
    );
  }

  // ✅ Special case: Customer Master - show ID_Type_Display instead of 1/2
  if (field.fieldname === "ID_Type" && item.ID_Type_Display) {
    return item.ID_Type_Display || "-";
  }

  // Foreign key display (non-edit)
  if (field.foreignKey) {
    const label =
      item[field.foreignKeyCode] ||
      item[`${field.fieldname}_Code`] ||
      item[`${field.fieldname}Code`] ||
      item[`${field.fieldname}_Label`] ||
      item[field.optionLabelField] ||
      item[field.fieldname];

    return label || "-";
  }

  return item[field.fieldname] || "-";
};

// ✅ Main Table component (unchanged props signature)
const Table = ({
  tab = [],
  Col = [],
  ActionId,
  ActionFunc,
  handleDelete,
  OnChangeHandler,
  OnSaveHandler,
  EditedData = {},
  isEdit,
  isDelete,
  isLoading,
  height,
  useInputRef,
}) => {
  const scrollRef = useRef(null);

  const renderRowNumber = (index) => index + 1;

  // ✅ New save handler wrapper to validate Description
  const handleSave = (index) => {
    const descriptionField = Col.find(
      (col) => col.fieldname?.toLowerCase() === "description"
    );

    if (descriptionField) {
      const descValue =
        EditedData["Description"] || EditedData["description"] || "";
      if (!descValue.trim()) {
        toast.error("Description cannot be empty");
        return;
      }
    }

    OnSaveHandler(index);
  };

  const renderLoadingSkeleton = () =>
    [...Array(12)].map((_, index) => (
      <tr key={index} className="border-b border-gray-200">
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1.5 text-center z-10">
          <Skeleton width={20} />
        </td>
        {Col.map((_, colIndex) => (
          <td key={colIndex} className="px-1 py-1.5 text-center">
            <Skeleton height={16} />
          </td>
        ))}
        {isEdit &&
          Array(2)
            .fill(0)
            .map((_, i) => (
              <td key={i} className="px-1 py-1.5 text-center">
                <Skeleton circle height={20} width={20} />
              </td>
            ))}
        {isDelete && (
          <td className="px-1 py-1.5 text-center">
            <Skeleton circle height={20} width={20} />
          </td>
        )}
      </tr>
    ));

  const renderNoDataRow = () => {
    const colspan = Col.length + (isEdit ? 2 : 0) + (isDelete ? 1 : 0);
    return (
      <tr>
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10" />
        <td
          colSpan={colspan}
          className="text-center text-gray-500 py-3 text-xs bg-gray-100"
        >
          <i className="bi bi-exclamation-circle mr-1" />
          No Data Found
        </td>
      </tr>
    );
  };

  const renderDataRows = () =>
    tab.map((item, index) => (
      <tr
        key={index}
        className="border-b border-gray-200 hover:bg-gray-50 text-sm"
      >
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10">
          {renderRowNumber(index)}
        </td>

        {Col.map((field, idx) => (
          <td
            key={idx}
            className="px-1 py-1 text-center"
            style={{ minWidth: field.width || "120px" }}
          >
            <RenderCellContent
              item={item}
              field={field}
              index={index}
              ActionId={ActionId}
              EditedData={EditedData}
              OnChangeHandler={OnChangeHandler}
              useInputRef={useInputRef}
            />
          </td>
        ))}

        {isEdit && (
          <>
            <td className="px-1 py-1 text-center w-12">
              <ActionButton
                icon="pencil-square"
                onClick={() => ActionFunc(index)}
                title="Edit"
              />
            </td>
            <td className="px-1 py-1 text-center w-12">
              <ActionButton
                icon="floppy"
                color={index === ActionId ? "green" : "lightgrey"}
                onClick={() => handleSave(index)} // ✅ Custom save validation
                disabled={ActionId == null || ActionId === -1}
                title="Save"
              />
            </td>
          </>
        )}

        {isDelete && (
          <td className="px-1 py-1 text-center w-12">
            <ActionButton
              icon="trash"
              color="#ff0000"
              onClick={() => handleDelete(index)}
              title="Delete"
              disabled={ActionId !== null && ActionId !== -1} // ✅ Disable delete during edit
            />
          </td>
        )}
      </tr>
    ));

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-auto border border-gray-200 rounded"
        style={{ maxHeight: height || "auto" }}
      >
        <table className="w-full border-collapse text-sm">
          <thead className="bg-indigo-900 text-white sticky top-0 z-500">
            <tr>
              <th className="sticky left-0 px-1 py-1 text-center z-9000 w-8 font-normal">
                Row
              </th>
              {Col.map((col, idx) => (
                <th
                  key={idx}
                  className="px-1 py-1 text-center font-normal"
                  style={{ minWidth: col.width || "120px" }}
                >
                  {col.label}
                </th>
              ))}
              {isEdit && (
                <>
                  <th className="px-1 py-1 text-center w-12 font-normal">
                    Edit
                  </th>
                  <th className="px-1 py-1 text-center w-12 font-normal">
                    Save
                  </th>
                </>
              )}
              {isDelete && (
                <th className="px-1 py-1 text-center w-12 font-normal">
                  Delete
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading
              ? renderLoadingSkeleton()
              : tab.length === 0
              ? renderNoDataRow()
              : renderDataRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
