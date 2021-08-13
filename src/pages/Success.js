import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../assets/images/background/logo.PNG";

export default function Success() {
  const proxy = process.env.REACT_APP_PROXY;
  const ck = process.env.REACT_APP_CK;
  const cs = process.env.REACT_APP_CS;
  const [invoice_details, setinvoice_details] = useState([]);
  const [isloading, setisloading] = useState(true);
  const history = useHistory();
  useEffect(() => {

    let _checkout = parseInt(sessionStorage.getItem("checkout"));
    axios
      .get(

        `${proxy}wc/v3/orders/${_checkout}`,
        {
          auth: {
            username: ck,
            password: cs,
          },
        }
      )
      .then((res, err) => {
        if (err) {
          console.log(err);
        } else {

          setinvoice_details(res.data);
          setisloading(false);
        }
      });
  }, []);
  function pay() {
    if (
      invoice_details.status === "on-hold" &&
      invoice_details.payment_method === "sslcommerz"
    ) {
      axios
        .put(
          `${proxy}wc/v3/orders/${invoice_details.id}`,
          {
            status: "pending",
          },
          {
            auth: {
              username: ck,
              password: cs,
            },
          }
        )
        .then((res, err) => {
          if (err) {
            console.log(err);
          } else {
            sessionStorage.setItem("checkout", invoice_details.id);
            window.location.href = `${process.env.REACT_APP_PAYURL}/${invoice_details.id}/?key=${invoice_details.order_key}`;
          }
        });
    } else {
      sessionStorage.setItem("checkout", invoice_details.id);
      window.location.href = `${process.env.REACT_APP_PAYURL}/${invoice_details.id}/?key=${invoice_details.order_key}`;
    }
  }

  function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

  }

  if (isloading) {
    return <div>Loading......</div>;
  }
  return (
    <>
      <div className="main invoice-page">
        <div id="container" className="">
          <div id="invoice-section" className="invoice-section">
            <div className="row">
              <div className="col-6">
                <h3>Order Id : #{invoice_details.id}</h3>
                <h3>Order Key : #{invoice_details.order_key.substring(3)}</h3>
                <h3>
                  Order Date : {invoice_details.date_created.replace("T", " ")}
                </h3>
                <h3>Order Status : {invoice_details.status.toUpperCase()}</h3>
              </div>
              <div className="col-6">
                <img alt="logo" className="logo" src={logo}></img>
              </div>
            </div>

            <div className="row">
              <div className="col-3">
                <h4>Billing Information</h4>
                <p>
                  Name:
                  {invoice_details.billing.first_name +
                    " " +
                    invoice_details.billing.last_name}
                </p>
                <p>Phone : {invoice_details.billing.phone}</p>
                <p>Email : {invoice_details.billing.email}</p>
                <p>
                  Address :
                  {invoice_details.billing.address_1 +
                    ", " +
                    invoice_details.billing.city +
                    " - " +
                    invoice_details.billing.postcode +
                    ", " +
                    invoice_details.billing.country}
                </p>
              </div>
              <div className="col-3">
                <h4>Shipping Information</h4>
                <p>
                  Name:
                  {invoice_details.shipping.first_name +
                    " " +
                    invoice_details.shipping.last_name}
                </p>
                <p>Phone : {invoice_details.billing.phone}</p>

                <p>
                  Address :
                  {invoice_details.shipping.address_1 +
                    ", " +
                    invoice_details.shipping.city +
                    " - " +
                    invoice_details.shipping.postcode +
                    ", " +
                    invoice_details.shipping.country}
                </p>
              </div>
              <div className="col-3">
                <h5>Payment Method : {invoice_details.payment_method_title}</h5>
                <h5>
                  Shipping Method :
                  {typeof invoice_details.shipping_lines[0] === "undefined"
                    ? ""
                    : invoice_details.shipping_lines[0].method_title}
                </h5>
              </div>
            </div>

            <div className="product-details">
              <table>
                <thead>
                  <tr>
                    <th>Product Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice_details.line_items.map((item, key) => (
                    <tr key={key}>
                      <td>
                        {item.name} <br />
                        Item Id : {item.product_id}
                      </td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.price + "" + invoice_details.currency_symbol}
                      </td>
                      <td>
                        {item.total + "" + invoice_details.currency_symbol}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="summary">
                      {/* <p>
                        Sub-Total : <b>{invoice_details.total}</b>
                        {invoice_details.currency_symbol}
                      </p> */}
                      <p>
                        Discount : <b>{invoice_details.discount_total}</b>
                        {invoice_details.currency_symbol}
                      </p>
                      <p>
                        Shipping : <b>{invoice_details.shipping_total}</b>
                        {invoice_details.currency_symbol}
                      </p>
                      <p>
                        Order-Total : <b>{invoice_details.total}</b>
                        {invoice_details.currency_symbol}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="thank-you-section" style={{ textAlign: "center" }}>
          {invoice_details.status === "pending" ||
            (invoice_details.status === "on-hold" &&
              invoice_details.payment_method === "sslcommerz") ? (
            <p>
              Your Order Is Pending. Please Pay for your order
              <span
                className="btn"
                onClick={() => {
                  pay();
                }}
              >
                Now
              </span>
            </p>
          ) : (
            <p>
              To Download Your Invoice Please
              <span
                className="btn"
                onClick={() => {

                  printDiv("container");

                }}
              >
                click Here
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
