import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; 
import './navbar.css'

function Navbar() {
   const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div className={`sidenav ${isOpen ? "open" : ""}`}>
        <h2 className="sidenav-title">SideNav</h2>
        <ul className="sidenav-links">
          <li>
            {/* <Link to="/" onClick={() => setIsOpen(false)}> */}
            Home
            {/* </Link> */}
            </li>
          <li>
            {/* <Link to="/user" onClick={() => setIsOpen(false)}> */}
            Users
          {/* </Link> */}
          </li>
        </ul>
      </div>
    </>
  );
    }

export default Navbar
