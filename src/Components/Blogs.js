import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

const fetchblogpostssdata = async (x) => {
  const data = await fetch(`${proxy}wp/v2/posts`);
  return data.json();
};

export default function Related_Products(props) {
  const { data, status } = useQuery(
    ["blogposts", props.categoryId],
    fetchblogpostssdata
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
      <div className="blog-section mt-40">
        <div className="row">
          {/* <h1 className="title">You May Also Like</h1> */}
        </div>
        <div className="row">
          <div className="col-8 product-slide">
            <Carousel responsive={responsive}>
              {data.map((x, key) => (
                <Link key={key} to={`/blog_details/${x.id}`}>
                  <div className="card-item">
                    <div className="row">
                      <img alt="blog" src={x.acf.blog_image_1.url}></img>
                    </div>
                    <h2
                      className="card-description"
                      dangerouslySetInnerHTML={{ __html: x.title.rendered }}
                    ></h2>
                    <p
                      className="card-description"
                      dangerouslySetInnerHTML={{ __html: x.content.rendered }}
                    ></p>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}
