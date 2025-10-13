import useLayout11Master from "../Store/MasterStore/useLayout11Master";
import useLayout6Master from "../Store/MasterStore/useLayout6Master"; 
import useLayout12Master from "../Store/MasterStore/useLayout12Master";
import useLayout13Master from "../Store/MasterStore/useLayout13Master";

// Extend this as your project grows
const storeMap = {
  Layout11Master: useLayout11Master,
  ProcessMaster: useLayout6Master,
  SystemMaster: useLayout12Master,
  CompanyMaster: useLayout13Master,
};

export default function useForeignData(foreignKey) {
  const storeHook = storeMap[foreignKey];
  if (!storeHook) return { data: [], fetchData: () => {} };

  const store = storeHook();
  const dataKey = Object.keys(store).find((k) => Array.isArray(store[k])); // auto-detect data array
  const fetchKey = Object.keys(store).find((k) => k.startsWith("fetch"));

  return {
    data: store[dataKey],
    fetchData: store[fetchKey],
  };
}
