import { useCallback, useRef, useState } from "react";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";

// ActionButton Component
const ActionButton = ({ icon, color, onClick, disabled, title }) => (
  <button
    className="p-0 m-0 flex items-center justify-center h-7 w-7 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{
      color: disabled ? "lightgrey" : color || "#ac4bec",
    }}
  >
    <i className={`bi bi-${icon} text-base`} />
  </button>
);

// RenderCellContent Component - Updated with input-cell classes
const RenderCellContent = ({
  item,
  field,
  index,
  toaster,
  CloseBongCal,
  ActionId,
  HandleMultiSelection,
  EditedData,
  OnChangeHandler,
  bongView,
  setBongView,
  useInputRef,
  isUseInputRef,
  PictureHandler,
}) => {
  const handleDateCheck = useCallback(
    (event) => {
      const regex = /^(?:14|15)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[02])$/;
      if (!regex.test(event.target.value)) {
        toaster.error(
          "Invalid Date Format. It should be YYYY-MM-DD. Also make sure day and month number contain 0 if less than 10."
        );
      }
    },
    [toaster]
  );

  const handleBongSave = useCallback(
    (bengalidate) => {
      const obj = {
        target: {
          value: bengalidate,
          name: `${field?.fieldname}`,
        },
      };
      OnChangeHandler(index, obj);
      CloseBongCal();
    },
    [index, OnChangeHandler, CloseBongCal]
  );

  if (field?.isIconicData) {
    return item[field.fieldname] != 0 && item[field.fieldname] != null
      ? field.iconSuccess(item)
      : field.iconError(item);
  }

  // Show input fields for new items or when in edit mode
  if ((item.isNew || ActionId === index) && !field?.isNotEditable) {
    if (field?.isSelection) {
      return field?.isMultiSelection ? (
        <div className="input-cell form-input w-100">
          <MultipleSelection
            options={field.options}
            handleChange={HandleMultiSelection}
            selectedVal={
              EditedData[field.selectionname] || item[field.selectionname]
            }
            label={field.labelname}
            placeholder={field.placeholder}
            defaultval={EditedData[field.labelname]}
          />
        </div>
      ) : (
        <div className="input-cell form-input w-100">
          <SearchableDropDown
            options={field.options}
            handleChange={(e) => OnChangeHandler(index, e)}
            selectedVal={
              EditedData[field.selectionname] || item[field.selectionname]
            }
            label={field.selectionname}
            placeholder={field.headername}
            defaultval={item[field.fieldname]}
          />
        </div>
      );
    }
    if (field?.isBongDate) {
      return (
        <div className="input-cell form-input w-100 flex items-center">
          <input
            type="text"
            placeholder="yyyy-mm-dd"
            name={field.fieldname}
            onChange={(event) => OnChangeHandler(index, event)}
            onBlur={(e) => {
              handleDateCheck(e);
              field?.LostFocus?.(index, e.target.value);
            }}
            className="form-input flex-1"
            value={EditedData[field.fieldname] || item[field.fieldname] || ""}
          />
          <button
            className="ml-0.5 p-0.5 text-gray-600 hover:text-gray-800"
            onClick={() => setBongView(true)}
          >
            <i className="bi bi-calendar text-xs" />
          </button>
        </div>
      );
    }

    if (field?.type === "Img") {
      return (
        <input
          type="file"
          name={"Img"}
          accept="image/*"
          ref={field?.isUseInputRef ? useInputRef : null}
          onChange={(e) => PictureHandler(index, e)}
          className="input-cell form-input w-100 text-xs"
          readOnly={field?.isReadOnly || false}
        />
      );
    }

    return (
      <input
        name={field.fieldname}
        maxLength={field.max}
        placeholder={field.headername}
        value={EditedData[field.fieldname] || item[field.fieldname] || ""}
        ref={field?.isUseInputRef ? useInputRef : null}
        type={field.type || "text"}
        onChange={(e) => OnChangeHandler(index, e)}
        className="input-cell form-input w-100"
        readOnly={field?.isReadOnly || false}
      />
    );
  }

  if (field?.type === "Img") {
    const imageUrl = item[field.fieldname] || defaultimage;

    return (
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center"
      >
        <img
          src={imageUrl}
          alt=""
          className="h-6 w-6 object-cover cursor-pointer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultimage;
          }}
        />
      </a>
    );
  }

  return item[field.fieldname] == 0 || item[field.fieldname] == null
    ? "-"
    : item[field.fieldname];
};

// Enhanced Table Component with CRUD Operations
const EditableTable = ({
  grandtotal = 0,
  checkedIds = [],
  isCheck,
  isFooter,
  isPrint,
  isView,
  isDelete,
  isEdit,
  viewPref,
  tab = [],
  ActionId,
  ActionFunc,
  onSorting,
  Col = [],
  OnChangeHandler,
  OnSaveHandler,
  EditedData = {},
  HandleMultiSelection,
  isLoading,
  PageNumber,
  rowsperpage,
  height,
  handleViewClick,
  handleprint,
  handleDelete,
  onCheckChange,
  getFocusText,
  useInputRef,
  showScrollButtons,
  FooterBody,
  toaster,
  bongView,
  setBongView,
  CloseBongCal,
  isUseInputRef,
  actions = [],
  PictureHandler,
  // New props for CRUD operations
  onAddNew = () => {},
  onBulkSave = () => {},
  showBulkSave = true,
  addButtonText = "Add New",
  saveButtonText = "Save All Changes",
}) => {
  const scrollRef = useRef(null);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [newItems, setNewItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);

  // Handle adding new item - Modified to auto-edit new items
  const handleAddNew = useCallback(() => {
    const newItem = {
      id: `new-${Date.now()}`,
      isNew: true,
      // Initialize all fields with empty values
      ...Object.fromEntries(Col.map((col) => [col.fieldname, ""])),
    };
    setNewItems((prev) => [...prev, newItem]);
    onAddNew(newItem);

    // Auto-set edit mode for new items by calling ActionFunc if available
    if (ActionFunc) {
      const newIndex = tab.length + newItems.length;
      // Use setTimeout to ensure the item is added before setting edit mode
      setTimeout(() => ActionFunc(newIndex), 0);
    }
  }, [onAddNew, Col, ActionFunc, tab.length, newItems.length]);

  // Handle item update
  const handleItemUpdate = useCallback(
    (index, updates) => {
      const item = tab[index];
      if (item.isNew) {
        // Update in new items
        setNewItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, ...updates } : i))
        );
      } else {
        // Update in existing items
        setUpdatedItems((prev) => {
          const existingUpdate = prev.find((u) => u.id === item.id);
          if (existingUpdate) {
            return prev.map((u) =>
              u.id === item.id ? { ...u, ...updates } : u
            );
          }
          return [...prev, { ...item, ...updates }];
        });
      }
    },
    [tab]
  );

  // Handle item delete
  const handleItemDelete = useCallback(
    (index) => {
      const item = tab[index];
      if (item.isNew) {
        // Remove from new items
        setNewItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        // Add to deleted items
        setDeletedItems((prev) => [...prev, item]);
      }
      handleDelete(index);
    },
    [tab, handleDelete]
  );

  // Handle bulk save
  const handleBulkSave = useCallback(() => {
    const changes = {
      new: newItems,
      updated: updatedItems,
      deleted: deletedItems,
    };

    onBulkSave(changes);

    // Reset tracking arrays after successful save
    setNewItems([]);
    setUpdatedItems([]);
    setDeletedItems([]);
  }, [newItems, updatedItems, deletedItems, onBulkSave]);

  // Enhanced OnChangeHandler to track updates
  const enhancedOnChangeHandler = useCallback(
    (index, event) => {
      const { name, value } = event.target;
      OnChangeHandler(index, event);
      handleItemUpdate(index, { [name]: value });
    },
    [OnChangeHandler, handleItemUpdate]
  );

  // Enhanced handleDelete to track deletions
  const enhancedHandleDelete = useCallback(
    (index) => {
      handleItemDelete(index);
    },
    [handleItemDelete]
  );

  // Check if there are pending changes
  const hasPendingChanges =
    newItems.length > 0 || updatedItems.length > 0 || deletedItems.length > 0;

  // Enhanced actions with tracking
  const enhancedActions = [
    ...actions,
    {
      type: "add",
      icon: "plus-circle",
      color: "#10b981",
      onClick: handleAddNew,
      title: addButtonText,
      label: "Add",
      showAsButton: true,
    },
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollTo({
        top: direction === "up" ? 0 : container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSort = (fieldName, type) => {
    setSortField(fieldName);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    if (onSorting) {
      onSorting(fieldName, type);
    }
  };

  const renderActionButtons = (item, index) => {
    return actions.map((action, i) => {
      if (action.type === "checkbox") {
        return (
          <td key={i} className=" text-center">
            <input
              type="checkbox"
              checked={action.checkedItems?.some(
                (i) => i[action.checkKey] === item[action.checkKey]
              )}
              onChange={(e) => action.onChange(item, e.target.checked)}
              className="cursor-pointer h-3 w-3 mx-auto"
            />
          </td>
        );
      }

      if (action.showAsButton) {
        return null; // These will be rendered separately
      }

      return (
        <td key={i} className=" text-center">
          <div className="flex justify-center">
            <ActionButton
              icon={action.icon}
              color={action.color}
              onClick={() => action.handler(index, item)}
              disabled={
                action.disabledCondition?.(index, ActionId, item) ?? false
              }
              title={action.title}
            />
          </div>
        </td>
      );
    });
  };

  const renderRowNumber = (index) => {
    return PageNumber && rowsperpage
      ? (PageNumber - 1) * rowsperpage + index + 1
      : index + 1;
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
        {actions.map((_, i) => (
          <td key={i} className="px-1 py-1.5 text-center">
            <Skeleton circle height={20} width={20} />
          </td>
        ))}
      </tr>
    ));

  const renderNoDataRow = () => {
    const colspan =
      Col.length +
      (isEdit ? 2 : 0) +
      (isView ? 1 : 0) +
      (isPrint ? 1 : 0) +
      (isCheck ? 1 : 0) +
      (isDelete ? 1 : 0) +
      actions.length +
      1;

    return (
      <tr>
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10"></td>
        <td
          colSpan={colspan}
          className="text-center text-gray-500 bg-gray-100 py-3 text-xs"
          style={{
            height: "35vh",
          }}
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
        className={`border-b border-gray-200 hover:bg-gray-50 text-sm ${
          item.isNew
            ? "bg-green-50"
            : updatedItems.some((u) => u.id === item.id)
            ? "bg-blue-50"
            : ""
        }`}
      >
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10">
          {renderRowNumber(index)}
          {item.isNew && (
            <span className="block text-xs text-green-300">New</span>
          )}
        </td>
        {Col?.map((field, indexfield) => (
          <td
            key={indexfield}
            className="px-1 py-1 text-center"
            style={{
              minWidth: field?.width || "auto",
              maxWidth: field?.width || "140px",
            }}
            onClick={() => getFocusText?.(item[field?.fieldname])}
          >
            <div
              className="truncate mx-auto"
              style={{ width: field?.width || "auto" }}
            >
              <RenderCellContent
                item={item}
                field={field}
                index={index}
                toaster={toaster}
                CloseBongCal={CloseBongCal}
                ActionId={ActionId}
                HandleMultiSelection={HandleMultiSelection}
                EditedData={EditedData}
                OnChangeHandler={enhancedOnChangeHandler}
                bongView={bongView}
                setBongView={setBongView}
                useInputRef={useInputRef}
                isUseInputRef={isUseInputRef}
                PictureHandler={PictureHandler}
              />
            </div>
          </td>
        ))}

        {isEdit && (
          <>
            <td className="px-1 py-1 text-center w-12">
              <div className="flex justify-center">
                <ActionButton
                  icon="pencil-square"
                  color="#ac4bec"
                  onClick={() => ActionFunc(index)}
                  title="Edit"
                />
              </div>
            </td>
            <td className="px-1 py-1 text-center w-12">
              <div className="flex justify-center">
                <ActionButton
                  icon="floppy"
                  color={index === ActionId ? "green" : "lightgrey"}
                  onClick={() => OnSaveHandler(index)}
                  disabled={ActionId == null || ActionId === -1}
                  title="Save"
                />
              </div>
            </td>
          </>
        )}

        {isView && (
          <td className="px-1 py-1 text-center w-12">
            <div className="flex justify-center">
              <ActionButton
                icon="eye"
                color="#ac4bec"
                onClick={() => handleViewClick(index)}
                title={`${viewPref} View`}
              />
            </div>
          </td>
        )}

        {isPrint && (
          <td className="px-1 py-1 text-center w-12">
            <div className="flex justify-center">
              <ActionButton
                icon="printer"
                color="#ac4bec"
                onClick={() => handleprint(index)}
                title="Print"
              />
            </div>
          </td>
        )}

        {isCheck && (
          <td className="px-1 py-1 text-center w-12">
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={checkedIds.some(
                  (i) => i?.LotNo === item.LotNo && i?.SRL === item.SRL
                )}
                onChange={(e) => onCheckChange(item, e.target.checked)}
                className="cursor-pointer h-3 w-3"
              />
            </div>
          </td>
        )}

        {isDelete && (
          <td className="px-1 py-1 text-center w-12">
            <div className="flex justify-center">
              <ActionButton
                icon="trash"
                color="#ff0000"
                onClick={() => enhancedHandleDelete(index)}
                title="Delete"
              />
            </div>
          </td>
        )}

        {renderActionButtons(item, index)}
      </tr>
    ));

  return (
    <div className="relative">
      {/* Action Buttons Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg border">
        <div className="flex space-x-2">
          {enhancedActions
            .filter((action) => action.showAsButton)
            .map((action, index) => (
              <button
                key={index}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                onClick={action.onClick}
                title={action.title}
              >
                <i className={`bi bi-${action.icon} mr-2`} />
                {action.title}
              </button>
            ))}
        </div>

        {showBulkSave && (
          <button
            className={`flex items-center px-4 py-2 rounded-md transition-colors text-sm ${
              hasPendingChanges
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleBulkSave}
            disabled={!hasPendingChanges}
          >
            <i className="bi bi-check-circle mr-2" />
            {saveButtonText}
            {(newItems.length > 0 ||
              updatedItems.length > 0 ||
              deletedItems.length > 0) && (
              <span className="ml-2 bg-white text-green-600 rounded-full px-2 py-1 text-xs">
                {newItems.length + updatedItems.length + deletedItems.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Changes Summary */}
      {hasPendingChanges && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <div className="flex space-x-4 text-xs">
            {newItems.length > 0 && (
              <span className="flex items-center">
                <i className="bi bi-plus-circle text-green-600 mr-1" />
                {newItems.length} new item(s)
              </span>
            )}
            {updatedItems.length > 0 && (
              <span className="flex items-center">
                <i className="bi bi-pencil-square text-blue-600 mr-1" />
                {updatedItems.length} updated item(s)
              </span>
            )}
            {deletedItems.length > 0 && (
              <span className="flex items-center">
                <i className="bi bi-trash text-red-600 mr-1" />
                {deletedItems.length} deleted item(s)
              </span>
            )}
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-auto border border-gray-200 rounded"
        style={{ maxHeight: height || "auto" }}
      >
        <table className="w-full border-collapse text-sm">
          <thead className="bg-indigo-900 text-white sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 px-1 py-1 text-center z-30 w-8 font-normal">
                Row
              </th>
              {Col.map((col, index) => (
                <th
                  key={index}
                  className="px-1 py-1 text-center whitespace-nowrap font-normal"
                  style={{ minWidth: col?.width || "90px" }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{col.headername}</span>
                    {!col?.isShortingOff && (
                      <button
                        className="p-0.5 text-white hover:bg-indigo-700 rounded"
                        onClick={() => handleSort(col.fieldname, col.type)}
                        aria-label={`Sort by ${col.headername}`}
                      >
                        <i className="bi bi-arrow-down-up text-xs" />
                      </button>
                    )}
                  </div>
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
              {isView && (
                <th className="px-1 py-1 text-center w-12 font-normal">
                  {viewPref} View
                </th>
              )}
              {isPrint && (
                <th className="px-1 py-1 text-center w-12 font-normal">
                  Print
                </th>
              )}
              {isCheck && (
                <th className="px-1 py-1 text-center w-12 font-normal">
                  Check
                </th>
              )}
              {isDelete && (
                <th className="px-1 py-1 text-center w-12 font-normal">
                  Delete
                </th>
              )}
              {actions.map((action, i) => (
                <th
                  key={i}
                  className="px-1 py-1 text-center font-normal"
                  style={{ minWidth: action.width || "70px" }}
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {isLoading
              ? renderLoadingSkeleton()
              : tab.length === 0
              ? renderNoDataRow()
              : renderDataRows()}

            {isFooter &&
              (FooterBody || (
                <tr className="sticky bottom-0 bg-gray-100 z-10 text-sm">
                  <td
                    colSpan={Col.length + 1}
                    className="px-1 py-1 font-semibold text-center"
                  >
                    Grand Total: {grandtotal === 0 ? "-" : grandtotal}
                  </td>
                  {actions.length > 0 && <td colSpan={actions.length} />}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showScrollButtons && (
        <div
          className="absolute right-2 flex flex-col space-y-2 z-40"
          style={{ bottom: "50%", transform: "translateY(50%)" }}
        >
          <button
            className="bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => handleScroll("up")}
            aria-label="Scroll up"
          >
            <i className="bi bi-arrow-up-circle text-xl"></i>
          </button>
          <button
            className="bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => handleScroll("down")}
            aria-label="Scroll down"
          >
            <i className="bi bi-arrow-down-circle text-xl"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableTable;
