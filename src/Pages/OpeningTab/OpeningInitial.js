// /new form
export const openingInitial = [
  // ================= layout1 =================
  {
    name: "Opening Vendor Raw Material",
    type: "ovrm",
    openingTab: "tab1",
    fields: [
      {
        name: "VendorGroup",
        label: "Vendor Group",
        type: "Dropdown",
        foreignKey: "layout3", // VendorGroupMaster
        foreignKeyType: "vg",
        optionValueField: "VendorGrp_ID",
        optionLabelField: "VendorGrp_Code",
        width: "w-[180px]",
      },
      {
        name: "Vendor",
        label: "Vendor",
        type: "select",
        foreignKey: "layout12", // VendorMaster
        foreignKeyType: "ven",
        optionValueField: "Vendor_ID",
        optionLabelField: "Vendor_Code",
        width: "w-[180px]",
      },
      {
        name: "RawMaterial",
        label: "Raw Material",
        type: "select",
        foreignKey: "layout5", // RawMaterialMaster
        foreignKeyType: "rmm",
        optionValueField: "RawMaterial_ID",
        optionLabelField: "Raw_Code",
        width: "w-[180px]",
      },
      {
        name: "Qty",
        label: "Quantity",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "DrCr",
        label: "Dr / Cr",
        type: "select",
        options: [
          { value: "DR", label: "Debit" },
          { value: "CR", label: "Credit" },
        ],
        width: "w-[100px]",
      },
    ],
  },

  // ================= layout2 =================
  {
    name: "Opening Raw Material",
    type: "orm",
    openingTab: "layout2",
    fields: [
      // {
      //   name: "Srl",
      //   label: "Serial No",
      //   type: "number",
      //   width: "w-[100px]",
      //   disable: true,
      // },
      {
        name: "Department",
        label: "Department",
        type: "select",
        foreignKey: "layout2", // DepartmentMaster
        foreignKeyType: "dm",
        optionValueField: "Department_ID",
        optionLabelField: "Code",
        width: "w-[180px]",
      },
      {
        name: "RawMaterial",
        label: "Raw Material",
        type: "select",
        foreignKey: "layout5", // RawMaterialMaster
        foreignKeyType: "rmm",
        optionValueField: "RawMaterial_ID",
        optionLabelField: "Raw_Code",
        width: "w-[180px]",
      },
      {
        name: "Qty",
        label: "Quantity",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "DrCr",
        label: "Dr / Cr",
        type: "select",
        options: [
          { value: "DR", label: "Debit" },
          { value: "CR", label: "Credit" },
        ],
        width: "w-[100px]",
      },
    ],
  },

  // ================= layout3 =================
  {
    name: "Vendor Stone Opening",
    type: "vso",
    openingTab: "layout3",
    fields: [
      // {
      //   name: "Srl",
      //   label: "Serial No",
      //   type: "number",
      //   width: "w-[100px]",
      //   disable: true,
      // },
      {
        name: "VendorGroup",
        label: "Vendor Group",
        type: "Dropdown",
        foreignKey: "layout3", // VendorGroupMaster
        foreignKeyType: "vg",
        optionValueField: "VendorGrp_ID",
        optionLabelField: "VendorGrp_Code",
        width: "w-[180px]",
      },
      {
        name: "Vendor",
        label: "Vendor",
        type: "Dropdown",
        foreignKey: "layout14", // VendorMaster
        foreignKeyType: "ven",
        optionValueField: "Vendor_ID",
        optionLabelField: "Vendor_Code",
        width: "w-[180px]",
      },
      {
        name: "StoneMain",
        label: "Stone Main",
        type: "Dropdown",
        foreignKey: "layout2", // StoneMaster
        foreignKeyType: "sm",
        optionValueField: "Stone_ID",
        optionLabelField: "Code",
        width: "w-[150px]",
      },
      {
        name: "StoneSub",
        label: "Stone Sub",
        type: "Dropdown",
        foreignKey: "layout8", // StoneSubMaster
        foreignKeyType: "ssm",
        optionValueField: "Sub_ID",
        optionLabelField: "Sub_Code",
        width: "w-[150px]",
      },
      {
        name: "Color",
        label: "Color",
        type: "Dropdown",
        foreignKey: "layout1", // ColorMaster
        foreignKeyType: "cm",
        optionValueField: "Color_ID",
        optionLabelField: "Code",
        width: "w-[120px]",
      },
      {
        name: "Pcs",
        label: "Pieces",
        type: "number",
        width: "w-[100px]",
      },
      {
        name: "Qty",
        label: "Quantity",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "DrCr",
        label: "Dr / Cr",
        type: "Dropdown",
        options: [
          { value: "DR", label: "Debit" },
          { value: "CR", label: "Credit" },
        ],
        width: "w-[100px]",
      },
    ],
  },

  // ================= layout4 =================
  {
    name: "Self Stone Opening",
    type: "sso",
    openingTab: "layout4",
    fields: [
      // {
      //   name: "Srl",
      //   label: "Serial No",
      //   type: "number",
      //   width: "w-[100px]",
      //   disable: true,
      // },
      {
        name: "Department",
        label: "Department",
        type: "Dropdown",
        foreignKey: "layout2", // DepartmentMaster
        foreignKeyType: "dm",
        optionValueField: "Department_ID",
        optionLabelField: "Code",
        width: "w-[180px]",
      },
      {
        name: "StoneMain",
        label: "Stone Main",
        type: "Dropdown",
        foreignKey: "layout2", // StoneMaster
        foreignKeyType: "sm",
        optionValueField: "Stone_ID",
        optionLabelField: "Code",
        width: "w-[150px]",
      },
      {
        name: "StoneSub",
        label: "Stone Sub",
        type: "Dropdown",
        foreignKey: "layout8", // StoneSubMaster
        foreignKeyType: "ssm",
        optionValueField: "Sub_ID",
        optionLabelField: "Sub_Code",
        width: "w-[150px]",
      },
      {
        name: "Color",
        label: "Color",
        type: "Dropdown",
        foreignKey: "layout1", // ColorMaster
        foreignKeyType: "cm",
        optionValueField: "Color_ID",
        optionLabelField: "Code",
        width: "w-[120px]",
      },
      {
        name: "Pcs",
        label: "Pieces",
        type: "number",
        width: "w-[100px]",
      },
      {
        name: "Qty",
        label: "Quantity",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "DrCr",
        label: "Dr / Cr",
        type: "Dropdown",
        options: [
          { value: "DR", label: "Debit" },
          { value: "CR", label: "Credit" },
        ],
        width: "w-[100px]",
      },
    ],
  },
];
