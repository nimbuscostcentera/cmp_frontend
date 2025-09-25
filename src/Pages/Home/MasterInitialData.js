export const masters = [
  // ================= layout1 =================
  {
    name: "Color Master",
    type: "cm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Color Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
    ],
  },
  {
    name: "Plating Master",
    type: "pm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Plating Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
    ],
  },
  {
    name: "Misc Charge Master",
    type: "mm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Charge Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
    ],
  },
  {
    name: "Item Master",
    type: "im",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Item Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
    ],
  },
  {
    name: "Unit Master",
    type: "um",
    layout: "layout1",
    fields: [
      { name: "Unit_Code", label: "Unit Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "Conversion", label: "Conversion", type: "number", width: "w-[150px]" },
    ],
  },
  {
    name: "Design Group Master",
    type: "dgm",
    layout: "layout1",
    fields: [
      { name: "Code", label: "Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
    ],
  },

  // ================= layout2 =================
  {
    name: "Stone Master",
    type: "sm",
    layout: "layout2",
    fields: [
      { name: "Code", label: "Stone Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "ID_master", label: "Unit", type: "select", width: "w-[200px]" },
    ],
  },
  {
    name: "Department Master",
    type: "dm",
    layout: "layout2",
    fields: [
      { name: "Code", label: "Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "ID_master", label: "Process", type: "select", width: "w-[150px]" },
    ],
  },

  // ================= layout3 =================
  {
    name: "Artisan Master",
    type: "am",
    layout: "layout3",
    fields: [
      { name: "Code", label: "Code", maxLength: 6, width: "w-[100px]" },
      { name: "Name", label: "Name", maxLength: 100, width: "w-[200px]" },
      { name: "Address1", label: "Address1", maxLength: 255, width: "w-[200px]" },
      { name: "Address2", label: "Address2", maxLength: 255, width: "w-[200px]" },
      { name: "Address3", label: "Address3", maxLength: 255, width: "w-[200px]" },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
    ],
  },
  {
    name: "Dealer Master",
    type: "dlm",
    layout: "layout3",
    fields: [
      { name: "Code", label: "Code", maxLength: 6, width: "w-[100px]" },
      { name: "Name", label: "Name", maxLength: 100, width: "w-[200px]" },
      { name: "Address1", label: "Address1", maxLength: 255, width: "w-[200px]" },
      { name: "Address2", label: "Address2", maxLength: 255, width: "w-[200px]" },
      { name: "Address3", label: "Address3", maxLength: 255, width: "w-[200px]" },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
    ],
  },

  // ================= layout4 =================
  {
    name: "Staff Master",
    type: "stm",
    layout: "layout4",
    fields: [
      { name: "Staff_Code", label: "Staff Code", maxLength: 6, width: "w-[100px]" },
      { name: "Staff_Name", label: "Staff Name", maxLength: 100, width: "w-[180px]" },
      { name: "Address1", label: "Address1", maxLength: 255, width: "w-[200px]" },
      { name: "Address2", label: "Address2", maxLength: 255, width: "w-[200px]" },
      { name: "Address3", label: "Address3", maxLength: 255, width: "w-[200px]" },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
      { name: "ID_master", label: "Process", type: "select", width: "w-[150px]" },
    ],
  },

  // ================= layout5 =================
  {
    name: "Customer Master",
    type: "csm",
    layout: "layout5",
    fields: [
      { name: "Code", label: "Customer Code", maxLength: 6, width: "w-[100px]" },
      { name: "Name", label: "Name", maxLength: 100, width: "w-[200px]" },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
    ],
  },

  // ================= layout6 =================
  {
    name: "Raw Material Master",
    type: "rmm",
    layout: "layout6",
    fields: [
      { name: "Raw_Code", label: "Raw Code", maxLength: 6, width: "w-[100px]" },
      { name: "Raw_Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "Tolerance_Lower", label: "Tolerance Lower", type: "number", width: "w-[120px]" },
      { name: "Tolerance_Upper", label: "Tolerance Upper", type: "number", width: "w-[120px]" },
      { name: "Metal_Type", label: "Metal Type", type: "select", width: "w-[150px]" },
    ],
  },

  // ================= layout7 =================
  {
    name: "Process Master",
    type: "prm",
    layout: "layout7",
    fields: [
      { name: "Process_Code", label: "Process Code", maxLength: 15, width: "w-[150px]" },
      { name: "Description", label: "Description", maxLength: 30, width: "w-[200px]" },
      { name: "Process_Serial", label: "Serial", type: "number", width: "w-[100px]" },
      { name: "Execution_Days", label: "Execution Days", type: "number", width: "w-[120px]" },
      { name: "Design_Stock_Effect", label: "Design Stock Effect", type: "checkbox", width: "w-[100px]" },
    ],
  },

  // ================= layout8 =================
  {
    name: "Plating Polish Master",
    type: "ppm",
    layout: "layout8",
    fields: [
      { name: "Polish_Code", label: "Polish Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "Rate", label: "Rate", type: "number", width: "w-[150px]" },
    ],
  },

  // ================= layout9 =================
  {
    name: "Design Master",
    type: "dsm",
    layout: "layout9",
    fields: [
      { name: "Design_Code", label: "Design Code", maxLength: 15, width: "w-[120px]" },
      { name: "Ref_Code", label: "Ref Code", maxLength: 15, width: "w-[120px]" },
      { name: "Design_Description", label: "Description", maxLength: 30, width: "w-[200px]" },
      { name: "Design_Group", label: "Design Group", type: "select", width: "w-[150px]" },
      { name: "ID_master", label: "Item", type: "select", width: "w-[150px]" },
      { name: "Picture", label: "Picture", maxLength: 255, width: "w-[200px]" },
      { name: "Gross_Weight", label: "Gross Weight", type: "number", width: "w-[120px]" },
      { name: "Tolerance_Lower", label: "Tolerance Lower", type: "number", width: "w-[120px]" },
      { name: "Tolerance_Upper", label: "Tolerance Upper", type: "number", width: "w-[120px]" },
    ],
  },

  // ================= layout10 =================
  {
    name: "Stone Sub Master",
    type: "ssm",
    layout: "layout10",
    fields: [
      { name: "Sub_Code", label: "Sub Code", maxLength: 6, width: "w-[100px]" },
      { name: "Description", label: "Description", maxLength: 15, width: "w-[180px]" },
      { name: "Pcs", label: "Pcs", type: "number", width: "w-[120px]" },
      { name: "Weight", label: "Weight", type: "number", width: "w-[150px]" },
      { name: "ID_Group", label: "Stone Main", type: "select", width: "w-[200px]" },
      { name: "Unit", label: "Unit", type: "select", width: "w-[200px]" },
    ],
  },

  // ================= layout11 =================
  {
    name: "System Master",
    type: "sysm",
    layout: "layout11",
    fields: [
      { name: "Metal_Type", label: "Metal Type", type: "select", width: "w-[120px]" },
      { name: "System_Name", label: "System Name", maxLength: 255, width: "w-[200px]" },
      { name: "Company_Name", label: "Company", type: "select", width: "w-[180px]" },
    ],
  },
];
