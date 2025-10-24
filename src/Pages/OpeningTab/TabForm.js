import React, { useState } from "react";
import Tab4Master from "./Tab4/Tab4Master";

const TabForm = () => {
  const tabs = [
    { id: "profile", label: "Tab 1", content: <ProfileForm /> },
    { id: "settings", label: "Tab 2", content: <SettingsForm /> },
    { id: "security", label: "Tab 3", content: <SecurityForm /> },
    { id: "tab3a", label: "Tab 3A", content: <SecurityForm /> },
    { id: "tab4", label: "Opening Design Stock", content: <Tab4Master /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-10 transition-all duration-300">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative 
              px-8 py-3   /* 👈 CHANGE TAB WIDTH & HEIGHT HERE */
              text-base   /* 👈 TAB TEXT SIZE */
              font-semibold rounded-t-lg
              transition-all duration-300
              ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50 after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[3px] after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        key={activeTab}
        className="animate-fadeIn transition-all duration-300 ease-in-out"
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// --- Example Forms ---

const ProfileForm = () => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter your name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter your email"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
    >
      Save
    </button>
  </form>
);

const SettingsForm = () => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Notification Preference
      </label>
      <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
        <option>Email</option>
        <option>SMS</option>
        <option>Push Notification</option>
      </select>
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
    >
      Update
    </button>
  </form>
);

const SecurityForm = () => (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Change Password
      </label>
      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter new password"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
    >
      Save Changes
    </button>
  </form>
);

export default TabForm;
