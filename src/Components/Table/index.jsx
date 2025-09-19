import { useCallback, useRef, useState } from "react";
import defaultimage from "../../Asset/default.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchableDropDown from "../SearchableDropDown";
import MultipleSelection from "../MultipleSelection";

// ActionButton (slightly larger icons)
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

  if (ActionId === index && !field?.isNotEditable) {
    if (field?.isSelection) {
     return field?.isMultiSelection ? (
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
     ) : (
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
     );
    }
    if (field?.isBongDate) {
      return (
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="yyyy-mm-dd"
            name={field.fieldname}
            onChange={(event) => OnChangeHandler(index, event)}
            onBlur={(e) => {
              handleDateCheck(e);
              field?.LostFocus?.(index, e.target.value);
            }}
            className="input-cell form-input w-100"
            value={EditedData[field.fieldname] || item[field.fieldname]}
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
    return (
      <input
        name={field.fieldname}
        maxLength={field.max}
        placeholder={field.headername}
        value={EditedData[field.fieldname] || ""}
        ref={field?.isUseInputRef ? useInputRef : null}
        type={field.type || "text"}
        onChange={(e) => OnChangeHandler(index, e)}
        className="input-cell form-input w-100"
        readOnly={field?.isReadOnly || false}
      />
    );
  }

  if (field?.type === "Img" && ActionId !== index) {
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

  if (field?.type === "Img" && ActionId === index) {
    return (
      <input
        type="file"
        name={"Img"}
        accept="image/*"
        ref={field?.isUseInputRef ? useInputRef : null}
        onChange={(e) => PictureHandler(index, e)}
        className="w-full text-xs"
        readOnly={field?.isReadOnly || false}
      />
    );
  }

  return item[field.fieldname] == 0 ? "-" : item[field.fieldname];
};

const Table = ({
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
}) => {
  const scrollRef = useRef(null);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10">
          {/* {renderRowNumber(0)} */}
        </td>
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
        className="border-b border-gray-200 hover:bg-gray-50 text-sm"
      >
        <td className="sticky left-0 bg-indigo-900 text-white px-1 py-1 text-center z-10">
          {renderRowNumber(index)}
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
                OnChangeHandler={OnChangeHandler}
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
                onClick={() => handleDelete(index)}
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

export default Table;
