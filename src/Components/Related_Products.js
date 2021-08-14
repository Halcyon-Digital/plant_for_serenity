import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { HashLink } from "react-router-hash-link";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

const fetchrelatedproductsdata = async (x) => {
  var catid = x.queryKey[1];
  const data = await fetch(
    `${proxy}wc/v3/products?category=${catid}&per_page=10&orderby=price&order=desc`,
    {
      headers: new Headers({
        Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
      }),
    }
  );

  return data.json();
};

export default function Related_Products(props) {
  const { data, status } = useQuery(
    ["relatedproducts", props.categoryId],
    fetchrelatedproductsdata
  );

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
  if (status !== "success") {
    return (
      <div className="slider-product-container">
        <div className="row">
          <h1 className="title">Loading</h1>
        </div>

        <div className="row">
          <span className="preloader-circle"></span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="related-product-container">
        <div className="row">
          <h1 className="title">You May Also Like</h1>
        </div>
        <div className="row">
          <div className="col-8 product-slide">
            <Carousel responsive={responsive}>
              {data
                .filter((x) => x.id !== props.productId)
                .map((product, key) => (
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
                    </HashLink>
                  </div>
                ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}
