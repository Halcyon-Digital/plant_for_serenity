import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import up_arrow from "../assets/images/icons/up_arrow.webp";
import down_arrow from "../assets/images/icons/down_arrow.webp";
import sslBanner from "../assets/images/background/ssl-banner.jpeg";
import { read_cookie } from "sfcookies";
import { Link } from "react-router-dom";

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
  var delivery_date = new Date();
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  delivery_date.setDate(delivery_date.getDate() + 3);

  //   console.log(delivery_date.toLocaleDateString("en-US", options));

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
      sub += cartitem.totalprice * cartitem.quantity;
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

  // Checkout
  function checkout() {
    let all_line_items = [];
    cartDetails.map((cart) => {
      let _line_item = {
        product_id: cart.id,
        quantity: cart.quantity,
        total: `${cart.price * cart.quantity}`,
      };
      all_line_items.push(_line_item);
    });
    let payment_method = "";
    var ele = document.getElementsByName("pay");

    for (let i = 0; i < ele.length; i++) {
      if (ele[i].checked) payment_method = ele[i].value;
    }

    const data = {
      customer_id:
        read_cookie("user_id").length === 0 ? 0 : read_cookie("user_id"),
      payment_method: payment_method,

      payment_method_title:
        payment_method === "COD"
          ? "Cash On Delivery"
          : "Online Payment Via SSLCOMMERZ",
      set_paid: false,
      status: payment_method === "COD" ? "on-hold" : "pending",
      billing: {
        first_name: document.getElementById("b_first_name").value,
        last_name: document.getElementById("b_last_name").value,
        address_1: document.getElementById("b_address").value,
        address_2: "",
        city: document.getElementById("b_city").value,
        state: "",
        postcode: document.getElementById("b_postcode").value,
        country: "BD",
        email: document.getElementById("b_email").value,
        phone: document.getElementById("b_cell").value,
      },
      shipping: {
        first_name: document.getElementById("s_first_name").value,
        last_name: document.getElementById("s_last_name").value,
        address_1: document.getElementById("s_address").value,
        address_2: "",
        city: document.getElementById("s_city").value,
        state: "",
        postcode: document.getElementById("s_postcode").value,
        country: "BD",
      },
      line_items: all_line_items,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: "100.00",
        },
      ],
    };
    //post order to database
    axios
      .post(`${proxy}wc/v3/orders`, data, {
        auth: {
          username: ck,
          password: cs,
        },
      })
      .then((res, err) => {
        if (err) {
          console.log(err);
        } else {
          sessionStorage.removeItem("itemlist");
          sessionStorage.setItem(
            "checkout",

            res.data.id
          );
          if (res.data.payment_method !== "COD") {
            window.location.href = `${process.env.REACT_APP_PAYURL}/${res.data.id}/?key=${res.data.order_key}`;
          } else {
            history.push("/success");
          }
        }
      });
  }

  if (
    JSON.parse(sessionStorage.getItem("itemlist")) === null ||
    JSON.parse(sessionStorage.getItem("itemlist")).length == 0
  ) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h4>No Item In your Shopping Bag.</h4>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="cart-page checkout-page">
      <div className="row w-r">
        <div className="col-6 fb-100 form-section">
          <form
            onSubmit={(event) => {
              document.getElementById("btn").innerHTML = "Loading...";
              document.getElementById("btn").style.cursor = "not-allowed";
              document.getElementById("btn").style.pointerEvents = "none";
              event.preventDefault();
              checkout();
            }}
          >
            <div className="row">
              <div className="col-12">
                <div className="shipping-billing-details-section billing-section">
                  <span className="up-down-arrow-span">
                    <img
                      alt="up-arrow"
                      id="billing-sub-section-up-arrow"
                      className="up-arrow"
                      src={up_arrow}
                    ></img>
                    <img
                      alt="down-arrow"
                      id="billing-sub-section-down-arrow"
                      className="down-arrow"
                      src={down_arrow}
                    ></img>
                  </span>

                  <h2
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        document.getElementById("billing-sub-section").style
                          .display !== "block"
                      ) {
                        document.getElementById(
                          "billing-sub-section-down-arrow"
                        ).style.display = "none";
                        document.getElementById(
                          "billing-sub-section-up-arrow"
                        ).style.display = "block";
                        document.getElementById(
                          "billing-sub-section"
                        ).style.display = "block";
                      } else {
                        document.getElementById(
                          "billing-sub-section-down-arrow"
                        ).style.display = "block";
                        document.getElementById(
                          "billing-sub-section-up-arrow"
                        ).style.display = "none";
                        document.getElementById(
                          "billing-sub-section"
                        ).style.display = "none";
                      }
                    }}
                  >
                    Billing Details <sup className="must-sup">*</sup>
                  </h2>
                  <div
                    id="billing-sub-section"
                    style={{ display: "block" }}
                    className="billing-sub-section"
                  >
                    <label htmlFor="">First Name</label> <br />
                    <input
                      required
                      oninvalid="this.setCustomValidity('Username cannot be empty.')"
                      name=""
                      type="text"
                      id="b_first_name"
                      placeholder="First Name"
                      defaultValue={islogged ? userinfo.billing.first_name : ""}
                    />
                    <br />
                    <label htmlFor="">Last Name</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_last_name"
                      placeholder="Last Name"
                      defaultValue={islogged ? userinfo.billing.last_name : ""}
                    />
                    <br />
                    <label htmlFor="">Address</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_address"
                      placeholder="House#, Road#"
                      defaultValue={islogged ? userinfo.billing.address_1 : ""}
                    />
                    <br />
                    <label htmlFor="">City</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_city"
                      placeholder="ex. Dhaka"
                      defaultValue={islogged ? userinfo.billing.city : ""}
                    />
                    <br />
                    <label htmlFor="">Post Code</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_postcode"
                      placeholder="eg. 1207"
                      defaultValue={islogged ? userinfo.billing.postcode : ""}
                    />
                    <br />
                    <label htmlFor="">Country</label> <br />
                    <input
                      required
                      readOnly
                      name=""
                      type="text"
                      id="b_country"
                      defaultValue={islogged ? userinfo.billing.country : "BD"}
                    />
                    <br />
                    <label htmlFor="">Cell</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_cell"
                      placeholder="01XXXXXXXXXX"
                      pattern="[0][1][0-9]{9}"
                      defaultValue={islogged ? userinfo.billing.phone : ""}
                    />
                    <br />
                    <label htmlFor="">Email</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="b_email"
                      placeholder="example@gmail.com"
                      defaultValue={islogged ? userinfo.billing.email : ""}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="same-checkbox-section">
                  <input
                    id="same_checkbox"
                    type="checkbox"
                    onChange={() => {
                      fillform();
                    }}
                  />
                  <label for=""> Same as Billing Address</label>
                </div>
                <div className="shipping-billing-details-section shipping-section">
                  <span className="up-down-arrow-span">
                    <img
                      alt="up-arrow"
                      id="shipping-sub-section-up-arrow"
                      className="up-arrow"
                      src={up_arrow}
                    ></img>
                    <img
                      alt="down-arrow"
                      id="shipping-sub-section-down-arrow"
                      className="down-arrow"
                      src={down_arrow}
                    ></img>
                  </span>
                  <h2
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (
                        document.getElementById("shipping-sub-section").style
                          .display === "none"
                      ) {
                        document.getElementById(
                          "shipping-sub-section-down-arrow"
                        ).style.display = "none";
                        document.getElementById(
                          "shipping-sub-section-up-arrow"
                        ).style.display = "block";
                        document.getElementById(
                          "shipping-sub-section"
                        ).style.display = "block";
                      } else {
                        document.getElementById(
                          "shipping-sub-section-down-arrow"
                        ).style.display = "block";
                        document.getElementById(
                          "shipping-sub-section-up-arrow"
                        ).style.display = "none";
                        document.getElementById(
                          "shipping-sub-section"
                        ).style.display = "none";
                      }
                    }}
                  >
                    Shipping Details <sup className="must-sup">*</sup>
                  </h2>

                  <div
                    id="shipping-sub-section"
                    style={{ display: "none" }}
                    className="shipping-sub-section"
                  >
                    <label htmlFor="">First Name</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="s_first_name"
                      placeholder="First Name"
                      defaultValue={
                        islogged ? userinfo.shipping.first_name : ""
                      }
                    />
                    <br />
                    <label htmlFor="">Last Name</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="s_last_name"
                      placeholder="Last Name"
                      defaultValue={islogged ? userinfo.shipping.last_name : ""}
                    />
                    <br />
                    <label htmlFor="">Address</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="s_address"
                      placeholder="House#, Road#"
                      defaultValue={islogged ? userinfo.shipping.address_1 : ""}
                    />
                    <br />
                    <label htmlFor="">City</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="s_city"
                      placeholder="ex. Dhaka"
                      defaultValue={islogged ? userinfo.shipping.city : ""}
                    />
                    <br />
                    <label htmlFor="">Post Code</label> <br />
                    <input
                      required
                      name=""
                      type="text"
                      id="s_postcode"
                      placeholder="eg. 1207"
                      defaultValue={islogged ? userinfo.shipping.postcode : ""}
                    />
                    <br />
                    <label htmlFor="">Country</label> <br />
                    <input
                      required
                      readOnly
                      name=""
                      type="text"
                      id="s_country"
                      placeholder="eg. BD "
                      defaultValue={islogged ? userinfo.shipping.country : "BD"}
                    />
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="terms-check">
                <br></br>
                <br></br>
                <input id="" type="checkbox" required />
                <label for="">
                  &nbsp; I have read and agreed to the{" "}
                  <Link to="/terms_of_service">Terms and Conditions</Link> and
                  <Link to="privacy_policy"> Privacy Policy</Link>
                </label>
                <br></br>
                <input id="" type="checkbox" required />
                <label for="">
                  &nbsp; Order will be Delivered within{" "}
                  {delivery_date.toLocaleDateString("en-US", options)}
                </label>
              </div>
            </div>

            <div className="row">
              <button id="btn" type="submit" className="btn">
                Proceed to Checkout
              </button>
            </div>
          </form>
        </div>
        <div className="col-4 summery-section fb-100">
          <div className="payment-section">
            <h2>Payment Method</h2> <br />
            <input
              type="radio"
              id="cash_on_delivery"
              name="pay"
              defaultValue="COD"
            />
            <label htmlFor="cash_on_delivery"> CASH ON DELIVERY </label> <br />
            <br />
            <input
              type="radio"
              id="online_pay"
              name="pay"
              defaultValue="sslcommerz"
              defaultChecked
            />
            <label htmlFor="online_pay"> ONLINE PAY </label>
            <img src={sslBanner}></img>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
}
