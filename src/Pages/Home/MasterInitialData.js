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
      { name: "Code", label: "Item Code", maxLength: 6, width: "w-[100px]" },
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
    type: "smz",
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

  // ================= layout2 =================
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
      { name: "ID_master", label: "Unit", type: "select", width: "w-[200px]" },
    ],
  },
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
        width: "w-[150px]",
      },
    ],
  },
  {
    name: "Location Master",
    type: "lm",
    layout: "layout2",
    fields: [
      {
        name: "Code",
        label: "Location Code",
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

  // ================= layout3 =================
  {
    name: "Plating Polish Master",
    type: "ppm",
    layout: "layout3",
    fields: [
      {
        name: "Polish_Code",
        label: "Polish Code",
        maxLength: 6,
        width: "w-[100px]",
      },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      { name: "Rate", label: "Rate", type: "number", width: "w-[150px]" },
    ],
  },
  // {
  //   name: "Plating Master",
  //   type: "plm",
  //   layout: "layout3",
  //   fields: [
  //     { name: "Code", label: "Plating Code", maxLength: 6, width: "w-[100px]" },
  //     {
  //       name: "Description",
  //       label: "Description",
  //       maxLength: 15,
  //       width: "w-[180px]",
  //     },
  //   ],
  // },

  // ================= layout4 =================
  {
    name: "Stone Sub Master",
    type: "ssm",
    layout: "layout4",
    fields: [
      { name: "Sub_Code", label: "Sub Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      { name: "Pcs", label: "Pcs", type: "number", width: "w-[120px]" },
      { name: "Weight", label: "Weight", type: "number", width: "w-[150px]" },
      {
        name: "ID_Group",
        label: "Stone Main",
        type: "select",
        width: "w-[200px]",
      },
      { name: "Unit", label: "Unit", type: "select", width: "w-[200px]" },
    ],
  },

  // ================= layout5 =================
  {
    name: "System Master",
    type: "sysm",
    layout: "layout5",
    fields: [
      {
        name: "Metal_Type",
        label: "Metal Type",
        type: "select",
        width: "w-[120px]",
      },
      {
        name: "System_Name",
        label: "System Name",
        maxLength: 255,
        width: "w-[200px]",
      },
      {
        name: "Company_Name",
        label: "Company",
        type: "select",
        width: "w-[180px]",
      },
    ],
  },

  // ================= layout6 =================
  {
    name: "Raw Material Master",
    type: "rmm",
    layout: "layout6",
    fields: [
      { name: "Raw_Code", label: "Raw Code", maxLength: 6, width: "w-[100px]" },
      {
        name: "Raw_Description",
        label: "Description",
        maxLength: 15,
        width: "w-[180px]",
      },
      {
        name: "Tolerance_Lower",
        label: "Tolerance Lower",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "Tolerance_Upper",
        label: "Tolerance Upper",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "Metal_Type",
        label: "Metal Type",
        type: "select",
        width: "w-[150px]",
      },
    ],
  },

  // ================= layout7 =================
  {
    name: "Process Master",
    type: "prm",
    layout: "layout7",
    fields: [
      {
        name: "Process_Code",
        label: "Process Code",
        maxLength: 15,
        width: "w-[150px]",
      },
      {
        name: "Description",
        label: "Description",
        maxLength: 30,
        width: "w-[200px]",
      },
      {
        name: "Process_Serial",
        label: "Serial",
        type: "number",
        width: "w-[100px]",
      },
      {
        name: "Execution_Days",
        label: "Execution Days",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "Design_Stock_Effect",
        label: "Design Stock Effect",
        type: "checkbox",
        width: "w-[100px]",
      },
    ],
  },

  // ================= layout8 =================
  {
    name: "Design Master",
    type: "dsm",
    layout: "layout8",
    fields: [
      {
        name: "Design_Code",
        label: "Design Code",
        maxLength: 15,
        width: "w-[120px]",
      },
      {
        name: "Design_Description",
        label: "Description",
        maxLength: 30,
        width: "w-[200px]",
      },
      {
        name: "Design_Group",
        label: "Design Group",
        type: "select",
        width: "w-[150px]",
      },
      { name: "ID_master", label: "Item", type: "select", width: "w-[150px]" },
      {
        name: "ID_StoneM",
        label: "Stone Main",
        type: "select",
        width: "w-[150px]",
      },
      {
        name: "ID_StoneS",
        label: "Stone Sub",
        type: "select",
        width: "w-[150px]",
      },
      { name: "Pcs", label: "Pcs", type: "number", width: "w-[100px]" },
      { name: "Weight", label: "Weight", type: "number", width: "w-[100px]" },
      {
        name: "Gross_Weight",
        label: "Gross Weight",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "Tolerance_Lower",
        label: "Tolerance Lower",
        type: "number",
        width: "w-[120px]",
      },
      {
        name: "Tolerance_Upper",
        label: "Tolerance Upper",
        type: "number",
        width: "w-[120px]",
      },
    ],
  },

  // ================= layout9 =================

  {
    name: "Unit Master",
    type: "um",
    layout: "layout9",
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
      {
        name: "Conversion",
        label: "Conversion",
        type: "number",
        width: "w-[150px]",
      },
    ],
  },

  {
    name: "Company Master",
    type: "compm",
    layout: "layout9",
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
      { name: "GSTIN", label: "GSTIN", maxLength: 15, width: "w-[150px]" },
      { name: "Address", label: "Address", maxLength: 255, width: "w-[250px]" },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
      { name: "Active", label: "Active", type: "checkbox", width: "w-[100px]" },
    ],
  },
  {
    name: "Year Master",
    type: "ym",
    layout: "layout9",
    fields: [
      {
        name: "Year_Code",
        label: "Year Code",
        maxLength: 10,
        width: "w-[120px]",
      },
      {
        name: "Start_Date",
        label: "Start Date",
        type: "date",
        width: "w-[150px]",
      },
      { name: "End_Date", label: "End Date", type: "date", width: "w-[150px]" },
      { name: "active", label: "Active", type: "checkbox", width: "w-[100px]" },
    ],
  },
  {
    name: "User Master",
    type: "umst",
    layout: "layout9",
    fields: [
      {
        name: "User_Name",
        label: "User Name",
        maxLength: 255,
        width: "w-[200px]",
      },
      { name: "Contact", label: "Contact", maxLength: 30, width: "w-[150px]" },
      {
        name: "Password",
        label: "Password",
        maxLength: 128,
        width: "w-[200px]",
      },
      {
        name: "UType",
        label: "User Type",
        type: "select",
        width: "w-[150px]",
        options: [
          { value: "S", label: "SuperUser" },
          { value: "A", label: "Admin" },
          { value: "U", label: "User" },
        ],
      },
      { name: "active", label: "Active", type: "checkbox", width: "w-[100px]" },
    ],
  },
];
