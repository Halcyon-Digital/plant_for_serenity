import React, { useState } from "react";
import "../assets/css/Navbar.css";
import logo from "../assets/images/background/logo.png";
import search from "../assets/images/icons/search-icon.PNG";
import cart from "../assets/images/icons/cart-icon.PNG";
import menu from "../assets/images/icons/menu.webp";
import cross_button from "../assets/images/icons/cross_button.webp";

import { Link, useHistory } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Navbar(props) {
  const history = useHistory();
  const [showNav, setshowNav] = useState(false);
  function tooglenav() {
    setshowNav(!showNav);
  }

  return (
    <div className="nav-header">
      <div className="nav-bar">
        <div className="row">
          <div className="col-2 menu-icon">
            <span
              onClick={() => {
                tooglenav();
              }}
            >
              {showNav ? (
                <img src={cross_button} alt="cross bar"></img>
              ) : (
                <img src={menu} alt="menu bar"></img>
              )}
            </span>
          </div>
          <div className="col-2 logo">
            <div className="">
              <Link to="/" className="nav-link">
                <img src={logo} alt="logo"></img>
              </Link>
            </div>
          </div>
          <div className="col-2 mobile-icons mobile-show">
            <div className="row">
              <Link to="/cart" className="nav-link">
                <img src={cart} alt="cart-icon"></img>
                <span className="cart-text">
                  {JSON.parse(sessionStorage.getItem("itemlist")) === null
                    ? 0
                    : JSON.parse(sessionStorage.getItem("itemlist")).length}
                </span>
              </Link>
            </div>
          </div>
          <div className="col-2 fb-100  mobile-show">
            <form
              className="nav-search"
              onSubmit={(event) => {
                event.preventDefault();
                history.push(
                  `/search_items/${
                    document.getElementById("search_name").value
                  }`
                );
              }}
            >
              <input
                id="search_name"
                type="text"
                name="search"
                placeholder="Search..."
              ></input>
            </form>
          </div>

          <div className="col-6">
            <div className="row">
              <ul className="menu">
                <li className="menu-item">
                  <HashLink smooth to="/#" className="nav-link">
                    Home
                  </HashLink>
                </li>
                <li className="menu-item">
                  <HashLink
                    smooth
                    to={{
                      pathname: "/category/15",
                      hash: "Houseplants",
                    }}
                    className="nav-link"
                  >
                    Houseplants
                  </HashLink>
                </li>
                <li className="menu-item">
                  <HashLink
                    smooth
                    to={{
                      pathname: "/category/76",
                      hash: "Decorations",
                    }}
                    className="nav-link"
                  >
                    Decoration
                  </HashLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-4">
            <div className="row">
              <ul className="menu right-side">
                <li className="menu-item">
                  <div>
                    <form
                      className="nav-search"
                      onSubmit={(event) => {
                        event.preventDefault();
                        history.push(
                          `/search_items/${
                            document.getElementById("search_name").value
                          }`
                        );
                      }}
                    >
                      <input
                        id="search_name"
                        type="text"
                        name="search"
                        placeholder="Search.."
                      ></input>
                    </form>
                  </div>
                </li>
                <li className="menu-item">
                  <Link to="/cart" className="nav-link">
                    <img src={cart}></img>
                    <span className="cart-text desktop-cart-text">
                      {JSON.parse(sessionStorage.getItem("itemlist")) === null
                        ? 0
                        : JSON.parse(sessionStorage.getItem("itemlist")).length}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul
          className={showNav ? "mobile-menu show-mobile-menu" : "mobile-menu"}
        >
          <li className="mobile-menu-item">
            <Link
              to="/"
              className="nav-link"
              onClick={() => {
                tooglenav();
              }}
            >
              Home
            </Link>
          </li>
          <li className="mobile-menu-item">
            <Link
              to={{
                pathname: "/category/15",
                hash: "Houseplants",
              }}
              className="nav-link"
              onClick={() => {
                tooglenav();
              }}
            >
              Houseplants
            </Link>
          </li>
          <li className="mobile-menu-item">
            <Link
              to={{
                pathname: "/category/76",
                hash: "Decorations",
              }}
              className="nav-link"
              onClick={() => {
                tooglenav();
              }}
            >
              Decorations
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
