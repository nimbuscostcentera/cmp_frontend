export const openingTabs = [
  {
    tabName: "Tab1",
    title: "Vendor Opening Raw Material Wise",
    tableName: "Opening_Vendor_RawMaterial",
    layout: "Same Layout: Tab1, Tab2",
    gridFields: [
      { name: "Srl", label: "Srl", type: "number", width: "w-[60px]" },
      {
        name: "Vendor_Group_Name",
        label: "Vendor Group Name",
        type: "text",
        required: true,
      },
      {
        name: "Vendor_Name",
        label: "Vendor Name",
        type: "dropdown",
        idField: "Id_Vendor",
        required: true,
      },
      {
        name: "Metal_Master",
        label: "Metal Master",
        type: "dropdown",
        idField: "Id_Metal",
        required: true,
      },
      { name: "Qty", label: "Qty", type: "number", decimal: 7.3, required: true },
      {
        name: "DrCr",
        label: "Dr/Cr",
        type: "combo",
        options: ["Dr", "Cr"],
        required: true,
      },
    ],
    validation: {
      mandatory: true,
      rule: "If one field in a row has data, all fields must be filled.",
      duplicateCheck: ["Vendor_Name", "Metal_Master"],
      qtyMeaning: { Dr: "+Qty", Cr: "-Qty" },
      repeatValues: ["Vendor_Group_Name", "Vendor_Name"], // Until manually changed
    },
  },

  {
    tabName: "Tab2",
    title: "Self Opening Raw Material Wise",
    tableName: "Opening_RawMaterial",
    layout: "Same Layout: Tab1, Tab2",
    gridFields: [
      { name: "Srl", label: "Srl", type: "number", width: "w-[60px]" },
      {
        name: "Department_Name",
        label: "Department Name",
        type: "dropdown",
        idField: "Id_Department",
        required: true,
      },
      {
        name: "Metal_Master",
        label: "Metal Master",
        type: "dropdown",
        idField: "Id_Metal",
        required: true,
      },
      { name: "Qty", label: "Qty", type: "number", decimal: 7.3, required: true },
    ],
    validation: {
      mandatory: true,
      rule: "If one field in a row has data, all fields must be filled.",
      duplicateCheck: ["Department_Name", "Metal_Master"],
    },
  },

  {
    tabName: "Tab3",
    title: "Self Loose Stone Wise Opening Stock",
    layout: "Same Layout: Tab3, Tab3A",
    note: "Include into: Stone wise CP & SP Rate setting along with Opening Master",
    linkedModule: "Stone wise CP & SP Rate Setting",
    tableName: "Self_Stone_Opening", // inferred since not explicitly given
  },

  {
    tabName: "Tab3A",
    title: "Vendor Loose Stone Wise Opening Stock",
    layout: "Same Layout: Tab3, Tab3A",
    tableName: "Vendor_Stone_Opening",
    linkedModule: "Stone wise CP & SP Rate Setting",
    gridFields: [
      {
        name: "Vendor_Group_Name",
        label: "Vendor Group Name",
        type: "text",
        required: true,
      },
      {
        name: "Vendor_Name",
        label: "Vendor Name",
        type: "dropdown",
        idField: "Id_Vendor",
        required: true,
      },
      {
        name: "Stone_Main",
        label: "Stone Main",
        type: "dropdown",
        required: true,
      },
      {
        name: "Stone_Sub",
        label: "Stone Sub",
        type: "dropdown",
        required: true,
      },
      { name: "Color", label: "Color", type: "text", required: true },
      { name: "Pcs", label: "Pcs", type: "number", required: true },
      {
        name: "DrCr",
        label: "Dr/Cr",
        type: "combo",
        options: ["Dr", "Cr"],
        required: true,
      },
    ],
    validation: {
      mandatory: true,
      duplicateCheck: ["Vendor_Name", "Stone_Main", "Stone_Sub", "Color"],
      copyFrom: "Stone Master → Pcs column",
    },
  },

  {
    tabName: "Tab4",
    title: "Tab4 Layout (Reserved for future use)",
    layout: "Same Layout: Tab4",
    gridFields: [],
    validation: {},
  },
];
