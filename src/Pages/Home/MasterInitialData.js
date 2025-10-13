export const masters = [
  // ================= layout1 =================
  {
    name: "Color Master",
    type: "cm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Color Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
    ],
  },
  {
    name: "Plating Master",
    type: "pm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Plating Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
    ],
  },
  {
    name: "Misc Charge Master",
    type: "mm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Charge Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
    ],
  },
  {
    name: "Item Master",
    type: "im",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Item Code", maxLength: 6, width: "w-[100px]",disable:true },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      { name: "Size", label: "Has Size", type: "checkbox", width: "w-[100px]" },
    ],
  },
  {
    name: "Design Group Master",
    type: "dgm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
    ],
  },
  {
    name: "Size Master",
    type: "szm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Size Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 30,
        width: "w-[200px]",
      },
    ],
  },
  {
    name: "Item Type Master",
    type: "itmtype",
    layout: "layout1",
    fields: [
      { name: "Item_ID", label: "Item Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Item_Name",
        label: "Item Name",
        maxLength: 100,
        width: "w-[250px]",
      },
    ],
  },

  // ================= layout2 =================
  {
    name: "Department Master",
    type: "dm",
    layout: "layout2",
    fields: [
      {
        name: "Code",
        label: "Department Code",
        maxLength: 6,
        width: "w-[100px]",
      },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      {
        name: "ID_master",
        label: "Process",
        type: "select",
        foreignKey: "layout6", // points to ProcessMaster
        foreignKeyType: "prm",
        optionLabelField: "Process_Code",
        optionValueField: "Process_ID",
        width: "w-[150px]",
      },
    ],
  },
  {
    name: "Stone Master",
    type: "sm",
    layout: "layout2",
    fields: [
      { name: "Code", label: "Stone Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      {
        name: "ID_master",
        label: "Unit",
        type: "select",
        foreignKey: "layout11", // points to UnitMaster
        foreignKeyType: "um",
        optionLabelField: "Unit_Code",
        optionValueField: "Unit_ID",
        width: "w-[200px]",
      },
    ],
  },

  // ================= layout3 =================
  {
    name: "Vendor Group Master",
    type: "vg",
    layout: "layout3", // replace with actual layout name used
    fields: [
      {
        name: "VendorGrp_ID",
        label: "Vendor Group ID",
        type: "number",
        readOnly: true,
        hidden: true,
      },
      {
        name: "VendorGrp_Name",
        label: "Vendor Group Name",
        type: "text",
        maxLength: 100,
        required: true,
      },
      {
        name: "Address1",
        label: "Address Line 1",
        type: "text",
        maxLength: 255,
        required: false,
      },
      {
        name: "Address2",
        label: "Address Line 2",
        type: "text",
        maxLength: 255,
        required: false,
      },
      {
        name: "Address3",
        label: "Address Line 3",
        type: "text",
        maxLength: 255,
        required: false,
      },
      {
        name: "Contact",
        label: "Contact Number",
        type: "text",
        maxLength: 30,
        required: false,
      },
      {
        name: "ID_Type",
        label: "ID Type",
        type: "select",
        required: true,
        options: [
          { value: "A", label: "Artisan" },
          { value: "D", label: "Dealer" },
          { value: "S", label: "Staff" },
        ],
      },
      {
        name: "Has_Process",
        label: "Has Process",
        type: "checkbox",
        required: false,
      },
    ],
  },

  {
    name: "Vendor Master",
    type: "ven",
    layout: "layout3",
    fields: [
      {
        name: "Vendor_Name",
        label: "Vendor Name",
        maxLength: 120,
        width: "w-[250px]",
      },
      {
        name: "ID_master",
        label: "Vendor Group",
        type: "select",
        foreignKey: "layout3", // points to VendorGroupMaster
        foreignKeyType: "vg",
        optionLabelField: "VendorGrp_ID",
        optionValueField: "VendorGrp_ID",
        width: "w-[200px]",
      },
    ],
  },

  // ================= layout4 =================
  {
    name: "Customer Master",
    type: "cust",
    layout: "layout4",
    fields: [
      {
        name: "Customer_ID",
        label: "Customer Code",
        maxLength: 6,
        width: "w-[100px]",
      },
      {
        name: "Customer_Name",
        label: "Customer Name",
        maxLength: 100,
        width: "w-[200px]",
      },
      {
        name: "Address1",
        label: "Address1",
        maxLength: 255,
        width: "w-[250px]",
      },
      {
        name: "Address2",
        label: "Address2",
        maxLength: 255,
        width: "w-[250px]",
      },
      {
        name: "Address3",
        label: "Address3",
        maxLength: 255,
        width: "w-[250px]",
      },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
      {
        name: "ID_Type",
        label: "ID Type",
        type: "select",
        options: [
          { value: "1", label: "Self" },
          { value: "2", label: "Customer" },
        ],
        width: "w-[150px]",
      },
    ],
  },

  // ================= layout5 =================
  {
    name: "Raw Material Master",
    type: "rmm",
    layout: "layout5",
    fields: [
      { name: "Raw_Code", label: "Raw Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Raw_Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      {
        name: "Metal_Type",
        label: "Metal Type",
        type: "select",
        foreignKey: "layout12", // points to SystemMaster
        foreignKeyType: "sysm",
        optionLabelField: "System_Name",
        optionValueField: "ID",
        width: "w-[150px]",
      },
    ],
  },

  // ================= layout8 =================
  {
    name: "Stone Sub Master",
    type: "ssm",
    layout: "layout8",
    fields: [
      {
        name: "Sub_Code",
        label: "Sub Code",
        maxLength: 6,
        width: "w-[100px]",
      },
      {
        name: "Description",
        label: "Description",
        maxLength: 30,
        width: "w-[200px]",
      },
      {
        name: "ID_Group",
        label: "Stone Master",
        type: "select",
        foreignKey: "layout2", // points to StoneMaster
        foreignKeyType: "sm", // identifies master type
        optionValueField: "ID", // ✅ actual primary key field from StoneMaster
        optionLabelField: "Code", // ✅ visible label in dropdown
      },
      {
        name: "Unit", // ✅ ensure this matches your Django model FK name
        label: "Unit",
        type: "select",
        foreignKey: "layout11", // points to UnitMaster
        foreignKeyType: "um",
        optionValueField: "Unit_ID", // ✅ numeric primary key
        optionLabelField: "Unit_Code", // ✅ visible name
      },
      {
        name: "Weight", // ✅ add missing field to avoid backend error
        label: "Weight",
        type: "number",
        width: "w-[100px]",
      },
    ],
  },

  // ================= layout9 =================
  // {
  //   name: "Stone Rate Setting",
  //   type: "header", // short code for the master (use consistent naming)
  //   layout: "layout9", // or whichever layout number you assign

  //   fields: [
  //     {
  //       name: "ID_StoneM",
  //       label: "Stone Master",
  //       type: "select",
  //       foreignKey: "layout2", // 🔗 links to StoneMaster
  //       foreignKeyType: "sm", // master type for StoneMaster
  //       optionValueField: "ID", // 🔑 actual primary key from StoneMaster
  //       optionLabelField: "Code", // 🏷️ visible label in dropdown
  //       width: "w-[160px]",
  //     },
  //     {
  //       name: "ID_StoneS",
  //       label: "Stone Sub Master",
  //       type: "select",
  //       foreignKey: "layout8", // 🔗 links to StoneSubMaster
  //       foreignKeyType: "ssm",
  //       optionValueField: "Sub_ID", // 🔑 primary key from StoneSubMaster
  //       optionLabelField: "Sub_Code", // 🏷️ visible label
  //       width: "w-[160px]",
  //     },
  //     {
  //       name: "ID_Color",
  //       label: "Color Master",
  //       type: "select",
  //       foreignKey: "layout1", // 🔗 links to ColorMaster
  //       foreignKeyType: "cm",
  //       optionValueField: "Color_ID", // 🔑 primary key
  //       optionLabelField: "Code", // 🏷️ visible label
  //       width: "w-[140px]",
  //     },
  //     {
  //       name: "Srl_Col",
  //       label: "Serial No",
  //       type: "number",
  //       width: "w-[100px]",
  //     },
  //     {
  //       name: "Pcs",
  //       label: "Pieces",
  //       type: "number",
  //       width: "w-[100px]",
  //     },
  //     {
  //       name: "Weight",
  //       label: "Weight",
  //       type: "number",
  //       width: "w-[100px]",
  //     },
  //     {
  //       name: "CP",
  //       label: "Cost Price",
  //       type: "number",
  //       width: "w-[120px]",
  //     },
  //     {
  //       name: "MiscCharges",
  //       label: "Misc Charges",
  //       type: "number",
  //       width: "w-[120px]",
  //     },
  //     {
  //       name: "SP",
  //       label: "Selling Price",
  //       type: "number",
  //       width: "w-[120px]",
  //     },
  //   ],
  // },

  {
    name: "Stone Rate Setting Misc Charge",
    type: "detail",
    layout: "layout9",
    fields: [
      {
        name: "ID_StoneRateSetting",
        label: "Stone Rate Setting",
        type: "select",
        foreignKey: "layout9",
        foreignKeyType: "header",
        optionValueField: "id",
        optionLabelField: "ID_StoneM",
      },
      {
        name: "ID_MiscCharge",
        label: "Misc Charge",
        type: "select",
        foreignKey: "layout1",
        foreignKeyType: "mm",
        optionValueField: "id",
        optionLabelField: "Code",
      },
    ],
  },

  // ================= layout11 =================
  {
    name: "Unit Master",
    type: "um",
    layout: "layout11",
    fields: [
      {
        name: "Unit_Code",
        label: "Unit Code",
        maxLength: 6,
        width: "w-[100px]",
      },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
    ],
  },

  // ================= layout12 =================
  {
    name: "System Master",
    type: "sysm",
    layout: "layout12",
    fields: [
      {
        name: "Metal_Type",
        label: "Metal Type",
        type: "select",
        options: [
          { value: "P", label: "Pure" },
          { value: "B", label: "Brass" },
          { value: "A", label: "Alloy" },
          { value: "M", label: "Model" },
          { value: "S", label: "Scrap" },
          { value: "O", label: "Others" },
        ],
        width: "w-[150px]",
      },
      {
        name: "System_Name",
        label: "System Name",
        maxLength: 255,
        width: "w-[250px]",
      },
    ],
  },

  // ================= layout13 =================
  {
    name: "Company Master",
    type: "com",
    layout: "layout13",
    fields: [
      {
        name: "Company_Code",
        label: "Company Code",
        maxLength: 15,
        width: "w-[150px]",
      },
      {
        name: "Company_Name",
        label: "Company Name",
        maxLength: 50,
        width: "w-[200px]",
      },
    ],
  },
];
