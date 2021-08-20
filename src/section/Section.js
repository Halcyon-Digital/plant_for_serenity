import React from "react";
import { Route } from "react-router-dom";
import Categorywise_Products from "../pages/Categorywise_Products";
import Home from "../pages/Home";
import Product_Details from "../pages/Product_Details";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import Search from "../pages/Search";
export default function Section() {
  return (
    <>
      <Route path="/" exact component={Home}></Route>
      <Route path="/product/:productId" exact component={Product_Details}></Route>
      <Route path="/category/:categoryId" exact component={Categorywise_Products}></Route>
      <Route path="/cart" exact component={Cart}></Route>
      <Route path="/checkout" exact component={Checkout}></Route>
      <Route path="/success" exact component={Success}></Route>
      <Route path="/search_items/:keyword" exact component={Search}></Route>
    </>
  );
}
