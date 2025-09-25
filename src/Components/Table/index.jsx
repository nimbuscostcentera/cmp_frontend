// Components/Table.jsx
import React, { useCallback, useRef, useState } from "react";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";

// Action button component
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

// Cell content renderer
const RenderCellContent = ({
  item,
  field,
  index,
  ActionId,
  EditedData,
  OnChangeHandler,
  useInputRef,
}) => {
  if (ActionId === index && !field?.isNotEditable) {
    return (
      <input
        name={field.fieldname}
        maxLength={field.max}
        placeholder={field.label}
        value={EditedData[field.fieldname] || item[field.fieldname]}
        ref={field?.isUseInputRef ? useInputRef : null}
        type={field.type || "text"}
        onChange={(e) => OnChangeHandler(index, e)}
        className="input-cell form-input w-full"
        readOnly={field?.isReadOnly || false}
      />
    );
  }

  if (field.type === "Img" && ActionId !== index) {
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

  return item[field.fieldname] || "-";
};

// Main Table component
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
        <td colSpan={colspan} className="text-center text-gray-500 py-3 text-xs bg-gray-100">
          <i className="bi bi-exclamation-circle mr-1" />
          No Data Found
        </td>
      </tr>
    );
  };

  const renderDataRows = () =>
    tab.map((item, index) => (
      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
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
              <ActionButton icon="pencil-square" onClick={() => ActionFunc(index)} title="Edit" />
            </td>
            <td className="px-1 py-1 text-center w-12">
              <ActionButton
                icon="floppy"
                color={index === ActionId ? "green" : "lightgrey"}
                onClick={() => OnSaveHandler(index)}
                disabled={ActionId == null || ActionId === -1}
                title="Save"
              />
            </td>
          </>
        )}

        {isDelete && (
          <td className="px-1 py-1 text-center w-12">
            <ActionButton icon="trash" color="#ff0000" onClick={() => handleDelete(index)} title="Delete" />
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
          <thead className="bg-indigo-900 text-white sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 px-1 py-1 text-center z-30 w-8 font-normal">Row</th>
              {Col.map((col, idx) => (
                <th key={idx} className="px-1 py-1 text-center font-normal">
                  {col.label}
                </th>
              ))}
              {isEdit && (
                <>
                  <th className="px-1 py-1 text-center w-12 font-normal">Edit</th>
                  <th className="px-1 py-1 text-center w-12 font-normal">Save</th>
                </>
              )}
              {isDelete && <th className="px-1 py-1 text-center w-12 font-normal">Delete</th>}
            </tr>
          </thead>
          <tbody className="bg-white">
            {isLoading ? renderLoadingSkeleton() : tab.length === 0 ? renderNoDataRow() : renderDataRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
