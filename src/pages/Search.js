import React, { useEffect, useState } from "react";
import hero1 from "../assets/images/background/hero-banner1.webp";

import "react-multi-carousel/lib/styles.css";

import { useQuery, useQueryClient } from "react-query";
import Newsletter from "../Components/Newsletter";

import { HashLink } from "react-router-hash-link";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

const fetchsearchproductsdata = async (x) => {
  var keyword = x.queryKey[1];
  var page = x.queryKey[2];
  const data = await fetch(
    `${proxy}wc/v3/products?search=${keyword}&page=${page}&per_page=8`,
    {
      headers: new Headers({
        Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
      }),
    }
  );

  return data.json();
};

export default function Categorywise_Products(props) {
  const [pagenumber, setpagenumber] = useState(1);
  useEffect(() => {}, [pagenumber]);
  const { data, status } = useQuery(
    ["searchproducts", props.match.params.keyword, pagenumber],
    fetchsearchproductsdata
  );

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
                      onClick={() =>
                        setpagenumber((old) => Math.max(old - 1, 1))
                      }
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
                      style={{
                        visibility: data.length === 0 ? "hidden" : "visible",
                      }}
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
                            src={
                              typeof product.images[0] === "undefined"
                                ? ""
                                : product.images[0].src
                            }
                          ></img>
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
                    style={{
                      visibility: pagenumber === 1 ? "hidden" : "visible",
                    }}
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
