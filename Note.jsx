<>
  {
  fileMenuOpen && (
                  <div className="absolute left-0 top-7 mt-2 w-40 bg-gray-800 text-white shadow-lg">
                    <ul className="list-none p-0 m-0">
                      {submenuInitial.map((menu, i) => (
                        <li key={i} className="px-4 py-2 hover:bg-gray-700 relative group cursor-pointer">{menu.title} ▸{/* Submenu */}
                          <div className="absolute left-full top-0 w-40 bg-gray-800 shadow-lg hidden group-hover:block">
                            <ul className="list-none p-0 m-0">
                              {menu.items.map((item, j) => (
                                <li
                                  key={j}
                                  className="py-2 px-4 hover:bg-gray-700 cursor-pointer"
                                >
                                  <Link
                                    to={item.link}
                                    className="text-white no-underline hover:no-underline block text-left"
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
    )}
  

  ///2nd design
  {fileMenuOpen && (
                  <div className="menu absolute left-0 top-7 bg-black rounded-md shadow-lg">
                    <ul>
                      {submenuInitial.map((menu, id) => (
                        <li
                          key={id}
                          className="relative group px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                          {menu.title}

                          {/* Submenu (only items matching parent.title) */}
                          <div className="submenu absolute left-full top-0 hidden group-hover:block bg-gray-800 text-white shadow-lg rounded-md">
                            <ul>
                              {menu.items
                                .filter((item) => item.id === menu.title) // ✅ match id with title
                                .map((item, j) => (
                                  <li
                                    key={j}
                                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                                  >
                                    <Link to={item.link}>{item.title}</Link>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AuthNavBar;
