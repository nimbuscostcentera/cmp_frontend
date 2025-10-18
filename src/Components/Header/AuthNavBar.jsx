// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "bootstrap-icons/font/bootstrap-icons.min.css"; // icons
// import Image from "../../Asset/Nimbus_Logo_Transparent_white.png"; // logo
// import { submenuInitial } from "../../InitialData/submenuInitial";

// function AuthNavBar() {
//   const navigate = useNavigate();
//   const [searchExpanded, setSearchExpanded] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMenu, setShowMenu] = useState(false);

//   // ✅ File dropdown state + timer
//   const [fileMenuOpen, setFileMenuOpen] = useState(false);
//   const fileMenuTimer = useRef(null);

//   const handleFileEnter = () => {
//     if (fileMenuTimer.current) clearTimeout(fileMenuTimer.current);
//     setFileMenuOpen(true);
//   };

//   const handleFileLeave = () => {
//     fileMenuTimer.current = setTimeout(() => {
//       setFileMenuOpen(false);
//     }, 300); // close after 0.3s
//   };

//   const searchRef = useRef(null);
//   const inputRef = useRef(null);

//   // Close search when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setSearchExpanded(false);
//         setSearchQuery("");
//       }
//     };
//     if (searchExpanded) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [searchExpanded]);

//   const handleLogout = () => {
//     localStorage.removeItem("auth-token");
//     navigate("/");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       console.log("Searching for:", searchQuery);
//       setSearchExpanded(false);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
//         <div className="flex items-center justify-between px-4 py-2">
//           {/* Left: Logo + Desktop Nav */}
//           <div className="flex items-center">
//             <Link to="/auth" className="flex items-center mr-4">
//               <img src={Image} alt="Nimbus Logo" className="h-8" />
//             </Link>

//             {/* Desktop Nav */}
//             <div className="hidden lg:flex space-x-6">
//               <Link
//                 to="/auth/home"
//                 className="flex items-center text-white no-underline hover:!text-blue-400 transition-colors duration-200"
//               >
//                 <i className="bi bi-house mr-1"></i> Home
//               </Link>

//               {/* File dropdown (hover with timer) */}
//               <div
//                 className="relative"
//                 onMouseEnter={handleFileEnter}
//                 onMouseLeave={handleFileLeave}
//               >
//                 <button
//                   className={`flex items-center px-2 py-1 rounded-md transition-all duration-200 ${
//                     fileMenuOpen
//                       ? "text-blue-400 bg-gray-800 shadow-md"
//                       : "text-white hover:text-blue-400 hover:bg-gray-800"
//                   }`}
//                 >
//                   <i
//                     className={`mr-1 bi ${
//                       fileMenuOpen ? "bi-folder2-open" : "bi-folder"
//                     }`}
//                   ></i>
//                   File
//                 </button>

//                 {/* Dropdown menu */}
//                 {fileMenuOpen && (
//                   <div className="menu absolute left-0 top-9 bg-black rounded-md shadow-lg min-w-[160px]">
//                     <ul className="list-none p-0 m-0">
//                       {submenuInitial.map((menu, i) => (
//                         <li
//                           key={i}
//                           className="relative group px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer flex justify-between items-center"
//                         >
//                           <span>{menu.title}</span>
//                           <span className="ml-2">▸</span>
//                           {/* Submenu */}
//                           <div className="submenu absolute left-full top-0 hidden group-hover:block bg-gray-800 text-white shadow-lg rounded-md">
//                             <ul className="list-none p-0 m-0">
//                               {menu.items
//                                 .filter((item) => item.id === menu.title)
//                                 .map((subitem, idx) => (
//                                   <li
//                                     key={idx}
//                                     className="px-4 py-2 hover:bg-gray-600 cursor-pointer w-40"
//                                   >
//                                     <Link to={subitem.link} className="text-white no-underline hover:no-underline block text-left">
//                                       {subitem.title}
//                                     </Link>
//                                   </li>
//                                 ))}
//                             </ul>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right: Search + Profile/Icons */}
//           <div className="flex items-center space-x-4">
//             {/* Desktop Search */}
//             <div
//               ref={searchRef}
//               className={`hidden lg:flex items-center transition-all duration-300 ${
//                 searchExpanded ? "w-64" : "w-8"
//               }`}
//             >
//               {searchExpanded ? (
//                 <form
//                   onSubmit={handleSearch}
//                   className="flex items-center w-full bg-gray-800 rounded-md px-2"
//                 >
//                   <input
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Search menus..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="bg-transparent outline-none w-full px-2 py-1 text-sm"
//                   />
//                   <button
//                     type="button"
//                     className="ml-2"
//                     onClick={() => {
//                       setSearchExpanded(false);
//                       setSearchQuery("");
//                     }}
//                   >
//                     <i className="bi bi-x"></i>
//                   </button>
//                 </form>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setSearchExpanded(true);
//                     setTimeout(() => inputRef.current?.focus(), 10);
//                   }}
//                 >
//                   <i className="bi bi-search"></i>
//                 </button>
//               )}
//             </div>

//             {/* Desktop Profile/Settings/Logout */}
//             <div className="hidden lg:flex items-center space-x-6">
//               <Link to="/auth/profile" className="hover:text-blue-400">
//                 <i className="bi bi-person-circle"></i>
//               </Link>
//               <Link to="/auth/setup" className="hover:text-blue-400">
//                 <i className="bi bi-gear-fill"></i>
//               </Link>
//               <button onClick={handleLogout} className="hover:text-red-400">
//                 <i className="bi bi-box-arrow-right"></i>
//               </button>
//             </div>

//             {/* Mobile Buttons */}
//             <div className="lg:hidden flex items-center space-x-3">
//               <button
//                 onClick={() => {
//                   setSearchExpanded(true);
//                   setTimeout(() => inputRef.current?.focus(), 10);
//                 }}
//               >
//                 <i className="bi bi-search"></i>
//               </button>
//               <button onClick={() => setShowMenu(!showMenu)}>
//                 <i className="bi bi-list text-2xl"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Dropdown Menu */}
//       {showMenu && (
//         <div className="lg:hidden bg-gray-800 text-white px-4 py-4 space-y-3 shadow-md">
//           <Link to="/auth/home" className="block hover:text-blue-400">
//             <i className="bi bi-house mr-2"></i> Home
//           </Link>
//           <Link to="/auth/file" className="block hover:text-blue-400">
//             <i className="bi bi-folder mr-2"></i> File
//           </Link>
//           <Link to="/auth/profile" className="block hover:text-blue-400">
//             <i className="bi bi-person-circle mr-2"></i> Profile
//           </Link>
//           <Link to="/auth/setup" className="block hover:text-blue-400">
//             <i className="bi bi-gear-fill mr-2"></i> Settings
//           </Link>
//           <hr className="border-gray-700" />
//           <button
//             onClick={handleLogout}
//             className="block text-left w-full hover:text-red-400"
//           >
//             <i className="bi bi-box-arrow-right mr-2"></i> Logout
//           </button>
//         </div>
//       )}

//       {/* Mobile Search Overlay */}
//       {searchExpanded && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center pt-20 z-50 lg:hidden">
//           <div className="bg-gray-900 w-11/12 p-3 rounded-lg flex items-center">
//             <form
//               onSubmit={handleSearch}
//               className="flex items-center w-full bg-gray-800 rounded-md px-2"
//             >
//               <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search menus..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-transparent outline-none w-full px-2 py-1 text-sm text-white"
//                 autoFocus
//               />
//               <button
//                 type="button"
//                 className="ml-2 text-gray-300 hover:text-white"
//                 onClick={() => {
//                   setSearchExpanded(false);
//                   setSearchQuery("");
//                 }}
//               >
//                 <i className="bi bi-x"></i>
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Padding to prevent content overlap with fixed navbar */}
//       <div className="pt-16"></div>
//     </>
//   );
// }

// export default AuthNavBar;


// ///
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.min.css"; // icons
import Image from "../../Asset/Nimbus_Logo_Transparent_white.png"; // logo

// Only top-level menus (no submenus)
export const menuInitial = [
  { title: "Master", link: "/auth/layout" },
  { title: "Transaction", link: "/auth/home/transaction" },
  { title: "Reports", link: "/auth/home/reports" },
];

function AuthNavBar() {
  const navigate = useNavigate();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // File dropdown state + timer
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const fileMenuTimer = useRef(null);

  const handleFileEnter = () => {
    if (fileMenuTimer.current) clearTimeout(fileMenuTimer.current);
    setFileMenuOpen(true);
  };

  const handleFileLeave = () => {
    fileMenuTimer.current = setTimeout(() => {
      setFileMenuOpen(false);
    }, 300);
  };

  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchExpanded(false);
        setSearchQuery("");
      }
    };
    if (searchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchExpanded]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchExpanded(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center">
            <Link to="/auth" className="flex items-center mr-4">
              <img src={Image} alt="Nimbus Logo" className="h-8" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-6">
              <Link
                to="/auth/home"
                className="flex items-center text-white no-underline hover:!text-blue-400 transition-colors duration-200"
              >
                <i className="bi bi-house mr-1"></i> Home
              </Link>

              {/* File dropdown (hover with timer) */}
              <div
                className="relative"
                onMouseEnter={handleFileEnter}
                onMouseLeave={handleFileLeave}
              >
                <button
                  className={`flex items-center px-2 py-1 rounded-md transition-all duration-200 ${
                    fileMenuOpen
                      ? "text-blue-400 bg-gray-800 shadow-md"
                      : "text-white hover:text-blue-400 hover:bg-gray-800"
                  }`}
                >
                  <i
                    className={`mr-1 bi ${
                      fileMenuOpen ? "bi-folder2-open" : "bi-folder"
                    }`}
                  ></i>
                  File
                </button>

                {/* Dropdown menu */}
                {fileMenuOpen && (
                  <div className="absolute left-0 top-9 bg-black rounded-md shadow-lg min-w-[160px]">
                    <ul className="list-none p-0 m-0">
                      {menuInitial.map((menu, i) => (
                        <li
                          key={i}
                          className="px-4 py-2 text-left cursor-pointer hover:bg-gray-700 transition-colors duration-200 rounded-md"
                        >
                          <Link
                            to={menu.link}
                            className="text-white no-underline hover:text-blue-400 block"
                          >
                            {menu.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Search + Profile/Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div
              ref={searchRef}
              className={`hidden lg:flex items-center transition-all duration-300 ${
                searchExpanded ? "w-64" : "w-8"
              }`}
            >
              {searchExpanded ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center w-full bg-gray-800 rounded-md px-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search menus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full px-2 py-1 text-sm text-white"
                  />
                  <button
                    type="button"
                    className="ml-2"
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchQuery("");
                    }}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setSearchExpanded(true);
                    setTimeout(() => inputRef.current?.focus(), 10);
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              )}
            </div>

            {/* Desktop Profile/Settings/Logout */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/auth/profile" className="hover:text-blue-400">
                <i className="bi bi-person-circle"></i>
              </Link>
              <Link to="/auth/setup" className="hover:text-blue-400">
                <i className="bi bi-gear-fill"></i>
              </Link>
              <button onClick={handleLogout} className="hover:text-red-400">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>

            {/* Mobile Buttons */}
            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => {
                  setSearchExpanded(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                }}
              >
                <i className="bi bi-search"></i>
              </button>
              <button onClick={() => setShowMenu(!showMenu)}>
                <i className="bi bi-list text-2xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {showMenu && (
        <div className="lg:hidden bg-gray-800 text-white px-4 py-4 space-y-3 shadow-md">
          <Link to="/auth/home" className="block hover:text-blue-400">
            <i className="bi bi-house mr-2"></i> Home
          </Link>
          {menuInitial.map((menu, i) => (
            <Link
              key={i}
              to={menu.link}
              className="block text-left hover:text-blue-400"
            >
              <i className="bi bi-folder mr-2"></i> {menu.title}
            </Link>
          ))}
          <Link to="/auth/profile" className="block hover:text-blue-400">
            <i className="bi bi-person-circle mr-2"></i> Profile
          </Link>
          <Link to="/auth/setup" className="block hover:text-blue-400">
            <i className="bi bi-gear-fill mr-2"></i> Settings
          </Link>
          <hr className="border-gray-700" />
          <button
            onClick={handleLogout}
            className="block text-left w-full hover:text-red-400"
          >
            <i className="bi bi-box-arrow-right mr-2"></i> Logout
          </button>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {searchExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center pt-20 z-50 lg:hidden">
          <div className="bg-gray-900 w-11/12 p-3 rounded-lg flex items-center">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full bg-gray-800 rounded-md px-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full px-2 py-1 text-sm text-white"
                autoFocus
              />
              <button
                type="button"
                className="ml-2 text-gray-300 hover:text-white"
                onClick={() => {
                  setSearchExpanded(false);
                  setSearchQuery("");
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Padding to prevent content overlap with fixed navbar */}
      <div className="pt-16"></div>
    </>
  );
}

export default AuthNavBar;


