import React, { useEffect, useState } from "react";
import hero1 from "../assets/images/background/hero-banner1.webp";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import Newsletter from "../Components/Newsletter";
import { type } from "jquery";
import { HashLink } from "react-router-hash-link";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;
var api_link = "";

// api_link = `${proxy}wc/v3/products?per_page=100&orderby=id&order=desc`;
const fetchcategorywiseproductsdata = async (x) => {
  var catid = x.queryKey[1];
  var page = x.queryKey[2];
  const data = await fetch(
    `${proxy}wc/v3/products?category=${catid}&page=${page}&per_page=8&orderby=price&order=desc`,
    {
      headers: new Headers({
        Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
      }),
    }
  );

  return data.json();
};

export default function Categorywise_Products(props) {
  const queryClient = useQueryClient();
  var categoryimage;
  if (typeof queryClient.getQueryData("categorydata") !== "undefined") {
    categoryimage = queryClient
      .getQueryData("categorydata")
      .find((d) => d.id == props.match.params.categoryId);
  }

  // console.log(categoryimage.image.src);

  const [pagenumber, setpagenumber] = useState(1);
  useEffect(() => {}, [pagenumber]);
  const { data, status } = useQuery(
    ["categorywiseproducts", props.match.params.categoryId, pagenumber],
    fetchcategorywiseproductsdata
  );
  const { reserved_data } = useQuery(["reservedData"], () => {
    return data;
  });
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  // console.log(data);
  if (status !== "success") {
    return (
      <div className="product-container">
        <div className="row">
          <h1 className="title">Loading...</h1>
          <span className="preloader-circle"></span>
        </div>
      </div>
    );
  }
  return (
    <>
      <section id={props.location.hash.replace("#", "").replace("%20", " ")}>
      <div className="main categorywise-product-page">
        <div
          className="hero-area"
          style={{
            backgroundImage: `url(${
              typeof categoryimage === "undefined"
                ? hero1
                : categoryimage.image.src
            })`,
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "100% 100%",
            backgroundBlendMode: "screen",
            height: "250px",
            width: "100%",
          }}
        >
          <div className="hero-para">
            <div className="row">
              <h1 className="title">
                {props.location.hash.replace("#", " ").replace("%20", " ")}
              </h1>
            </div>
          </div>
        </div>
        <div className="row category-header">
          <div className="col-2"></div>
          <div className="col-6">
            <p>
              All Our Beautiful{" "}
              {props.location.hash.replace("#", " ").replace("%20", " ")}(Even
              they are not actually category)
            </p>
            {/* <p>Sort By category</p> */}
          </div>
          <div className="col-4">({data.length} products)</div>
        </div>
        <div className="container">
          {data.length === 0 ? (
            <>
              <div className="row">
                <h2 className="title">No Products Available</h2>
              </div>
              {pagenumber !== 0 ? (
                <div className="row">
                  <button
                    className="btn"
                    onClick={() => setpagenumber((old) => Math.max(old - 1, 1))}
                    disabled={pagenumber === 1}
                  >
                    &larr;
                  </button>
                  <button className="btn" disabled>
                    {pagenumber}
                  </button>

                  <button
                    className="btn"
                    onClick={() => {
                      setpagenumber((old) => old + 1);
                    }}
                    style={{ cursor: "not-allowed" }}
                    disabled={data.length === 0}
                  >
                    &rarr;
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="row">
                {data.map((product, key) => (
                  <div key={key} className="card-item">
                    <HashLink
                      style={{ textDecoration: "none" }}
                      smooth
                      to={{
                        pathname: `/product/${product.id}`,
                        hash: `${product.name}`,
                      }}
                    >
                      <div className="row image-container">
                        <img
                          alt={product.name}
                          // className="without-hover"
                          src={
                            typeof product.images[0] === "undefined"
                              ? ""
                              : product.images[0].src
                          }
                        ></img>
                        {/* <img
                            alt={product.name}
                            className="with-hover"
                            src={
                              typeof product.images[1] === "undefined"
                                ? ""
                                : product.images[1].src
                            }
                          ></img> */}
                      </div>
                      <div className="card-description">
                        <p className="name">
                          {product.name} <br></br> <span>BDT.</span>
                          {product.sale_price !== "" ? (
                            <>
                              <strike>
                                <span
                                  className="price"
                                  dangerouslySetInnerHTML={{
                                    __html: product.regular_price,
                                  }}
                                ></span>
                              </strike>
                              &nbsp;
                              <span
                                className="price"
                                dangerouslySetInnerHTML={{
                                  __html: product.sale_price,
                                }}
                              ></span>
                            </>
                          ) : (
                            <span
                              className="price"
                              dangerouslySetInnerHTML={{
                                __html: product.price,
                              }}
                            ></span>
                          )}
                        </p>
                      </div>
                      <span
                        style={{ float: "right", paddingRight: "15px" }}
                      ></span>
                    </HashLink>
                  </div>
                ))}
              </div>
              <div className="row mt-40">
                <button
                  className="btn"
                  onClick={() => setpagenumber((old) => Math.max(old - 1, 1))}
                  disabled={pagenumber === 1}
                >
                  &larr;
                </button>
                <button className="btn" disabled>
                  {pagenumber}
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    setpagenumber((old) => old + 1);
                  }}
                  disabled={data.length === 0}
                >
                  &rarr;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      </section>
      <Newsletter></Newsletter>
    </>
  );
}
