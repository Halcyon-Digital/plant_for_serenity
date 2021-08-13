import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import add_button from "../assets/images/icons/add_button.webp";
import cross_button from "../assets/images/icons/cross_button.webp";
import up_arrow from "../assets/images/icons/up_arrow.webp";
import down_arrow from "../assets/images/icons/down_arrow.webp";
// import AccessoryProducts from "../Components/AccessoryProducts";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

import { read_cookie } from "sfcookies";

export default function Cart() {
  const proxy = process.env.REACT_APP_PROXY;
  const ck = process.env.REACT_APP_CK;
  const cs = process.env.REACT_APP_CS;
  const [cartDetails, setcartDetails] = useState([]);
  const [cartnotAvailable, setcartnotAvailable] = useState(false);
  const [subtotal, setsubtotal] = useState(0);
  const [cartupdated, setcartupdated] = useState(false);
  const history = useHistory();
  const [userinfo, setuserinfo] = useState([]);
  const [islogged, setislogged] = useState(false);

  useEffect(() => {
    if (read_cookie("user_id").length !== 0) {
      axios
        .get(`${proxy}wc/v3/customers/${read_cookie("user_id")}`, {
          auth: {
            username: ck,
            password: cs,
          },
        })
        .then((res, err) => {
          if (err) {
            console.log(err);
          } else {
            setuserinfo(res.data);
            setislogged(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    let _cartDetails =
      JSON.parse(sessionStorage.getItem("itemlist")) === null
        ? []
        : JSON.parse(sessionStorage.getItem("itemlist"));
    let sub = 0;
    _cartDetails.map((cartitem) => {
      sub += cartitem.price * cartitem.quantity;
    });

    setsubtotal(sub);
    setcartDetails(_cartDetails);
    setcartnotAvailable(true);
  }, [cartupdated]);

  function increase(id) {
    cartDetails.map((cartiem) => {
      if (
        cartiem.id === id &&
        (cartiem.stock === null || cartiem.stock > cartiem.quantity)
      ) {
        cartiem.quantity += 1;
      }
      sessionStorage.setItem("itemlist", JSON.stringify(cartDetails));
      setcartupdated(!cartupdated);
    });
  }

  function item_delete(id) {
    let tempcart = cartDetails.filter((x) => x.id !== id);
    sessionStorage.setItem("itemlist", JSON.stringify(tempcart));
    setcartupdated(!cartupdated);
    document.getElementsByClassName("cart-text")[0].innerHTML = JSON.parse(
      sessionStorage.getItem("itemlist")
    ).length;
  }

  function remove(id) {
    cartDetails.map((cartiem) => {
      if (cartiem.id === id && cartiem.quantity !== 1) {
        cartiem.quantity -= 1;
        sessionStorage.setItem("itemlist", JSON.stringify(cartDetails));
        setcartupdated(!cartupdated);
      } else if (cartiem.id === id && cartiem.quantity === 1) {
        item_delete(cartiem.id);
        return;
      }
    });
  }

  //Confirm Popup
  function popup(id) {
    // console.log("popup")
    document.getElementById(`dialog-overlay-${id}`).style.display = "block";
  }
  //cancel Popup
  function cancelPopup(id) {
    document.getElementById(`dialog-overlay-${id}`).style.display = "none";
  }

  function fillform() {
    document.getElementById("s_first_name").value =
      document.getElementById("b_first_name").value;
    document.getElementById("s_last_name").value =
      document.getElementById("b_last_name").value;
    document.getElementById("s_address").value =
      document.getElementById("b_address").value;
    document.getElementById("s_city").value =
      document.getElementById("b_city").value;
    document.getElementById("s_postcode").value =
      document.getElementById("b_postcode").value;
    document.getElementById("s_country").value =
      document.getElementById("b_country").value;
  }

  if (
    JSON.parse(sessionStorage.getItem("itemlist")) === null ||
    JSON.parse(sessionStorage.getItem("itemlist")).length == 0
  ) {
    return (
      <div className="container">
        <div className="row">
          <h4>No Item In your Cart.</h4>
        </div>
      </div>
    );
  }
  return (
    <div className="main">
      <div className="container">
        <div className="cart-page">
          <div className="row ">
            <div className="col-6 cart-item-list">
              <div className="row">
                <h1>Plants </h1>
              </div>
              {cartDetails.map((cartitem, key) =>
                Array.from(Array(cartitem.quantity).keys()).map((q) => (
                  <div key={key} className="row single-cart-item">
                    <div
                      id={`dialog-overlay-${cartitem.id}`}
                      className="dialog-overlay"
                    >
                      <div className="dialog-box">
                        <h2>Confirmation Request</h2>
                        <p>Are you sure you want to Remove this item?</p>
                        <button
                          className="btn"
                          onClick={() => {
                            remove(cartitem.id);
                            cancelPopup(cartitem.id);
                          }}
                        >
                          yes
                        </button>

                        <button
                          className="btn"
                          onClick={() => {
                            cancelPopup(cartitem.id);
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <div className="col-2">
                      <img
                        alt="cross icon"
                        className="cross-button"
                        src={cross_button}
                        onClick={() => {
                          if (cartitem.quantity < 2) {
                            popup(cartitem.id);
                          } else {
                            remove(cartitem.id);
                          }
                        }}
                      ></img>
                      <img src={cartitem.img} alt={cartitem.name} />
                    </div>
                    <div className="col-4">
                      <h2 className="row name">{cartitem.name}</h2>
                      <div
                        className="row add-more"
                        onClick={() => {
                          increase(cartitem.id);
                        }}
                      >
                        <img
                          alt="add-button"
                          className="add-button"
                          src={add_button}
                        ></img>
                        Add One More Item
                      </div>
                    </div>
                    <div className="col-2">
                      {/* <img alt="curency" src={bdt}></img> */}
                      <p>
                        BDT. <b>{cartitem.price}</b>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="col-4 summery-section">
              <div className="cart-summery">
                <h2>Cart Summery</h2> <br />
                <div className="row">
                  <div className="col-6">Sub Total</div>
                  <div className="col-6">
                    <b>{subtotal}</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">Shipping</div>
                  <div className="col-6" id="shipping_amount">
                    <b>{100}</b>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">Total</div>
                  <div className="col-6">
                    <b>{subtotal + 100}</b>
                  </div>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <Checkout></Checkout>
      </div>
    </div>
  );
}
