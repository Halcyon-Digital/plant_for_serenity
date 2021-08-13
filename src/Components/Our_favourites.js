import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { type } from "jquery";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

const fetchcategorywisedata = async (x) => {
  var catid = x.queryKey[1];
  var pagenum = x.queryKey[2];
  const data = await fetch(
    `${proxy}wc/v3/products?category=${77}&page=${pagenum}&per_page=10&orderby=price&order=desc`,
    {
      headers: new Headers({
        Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
      }),
    }
  );

  return data.json();
};

export default function Our_favourites() {
  var { data, status } = useQuery(
    ["categorywisedata", 77, 1],
    fetchcategorywisedata
  );

  return (
    <>
      {typeof data !== "undefined" ? (
        <>
          {data.length === 0 ? null : (
            <>
              <div className="product-container">
                <div className="row">
                  <h2 className="title">Our Favourites</h2>
                </div>
                <div className="row">
                  <div>
                    <div className="row">
                      {/* Loop Throu out the products Available */}

                      {data.map((product, key) => (
                        <React.Fragment key={key}>
                          <div className="card-item" key={product.id}>
                            <Link
                              style={{ textDecoration: "none" }}
                              to={{
                                pathname: `/product/${product.id}`,
                                hash: `${product.name}`,
                              }}
                            >
                              <div className="row product-images">
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
                                    typeof product.images[1] !== "undefined"
                                      ? product.images[1].src
                                      : ""
                                  }
                                ></img> */}
                              </div>
                              <div className="card-description">
                                <p>
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
                            </Link>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <Link to={{
                  pathname:`/category/77`,
                  hash:"Our Favourites"

                }} className="btn btn-orrange">View All</Link>
              </div>
            </>
          )}
        </>
      ) : null}
    </>
  );
}
