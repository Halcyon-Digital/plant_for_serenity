import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, QueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import Newsletter from "../Components/Newsletter";
import Related_Products from "../Components/Related_Products";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

var api_link = `${proxy}wc/v3/products`;

const fetchdetailsdata = async (x) => {
  var id = x.queryKey[1];
  const data = await fetch(api_link + "/" + id, {
    headers: new Headers({
      Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
    }),
  });
  return data.json();
};

export default function Product_details(props) {
  const history = useHistory();
  const queryClient = new useQueryClient();

  const { data, status } = useQuery(
    ["detailsdata", props.match.params.productId],
    fetchdetailsdata,
    {
      initialData: () => {
        if (typeof queryClient.getQueryData("reservedData") !== "undefined") {
          return queryClient
            .getQueryData("reservedData")
            .find((d) => d.id == props.match.params.productId);
        } else {
          return;
        }
      },
    }
  );
  // console.log(data);

  if (status === "success") {
    var product = data;
  }

  // CHANGE FOCUSED IMAGE FOR IMAGE CLICK
  function changeBigimage(src) {
    document.getElementById("big-image").src = src;
  }

  //Image zoom in mouse click

  //   // Image Magnifier

  function magnify(imgID, zoom) {
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    /*create magnifier glass:*/
    glass = document.createElement("DIV");
    glass.setAttribute("class", "img-magnifier-glass");
    glass.setAttribute("id", "img-magnifier-glass");
    /*insert magnifier glass:*/
    img.parentElement.insertBefore(glass, img);
    /*set background properties for the magnifier glass:*/
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize =
      img.width * zoom + "px " + img.height * zoom + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);
    function moveMagnifier(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /*prevent the magnifier glass from being positioned outside the image:*/
      if (x > img.width - w / zoom) {
        x = img.width - w / zoom;
      }
      if (x < w / zoom) {
        x = w / zoom;
      }
      if (y > img.height - h / zoom) {
        y = img.height - h / zoom;
      }
      if (y < h / zoom) {
        y = h / zoom;
      }
      /*set the position of the magnifier glass:*/
      glass.style.left = x - w + "px";
      glass.style.top = y - h + "px";
      /*display what the magnifier glass "sees":*/
      glass.style.backgroundPosition =
        "-" + (x * zoom - w + bw) + "px -" + (y * zoom - h + bw) + "px";
    }
    function getCursorPos(e) {
      var a,
        x = 0,
        y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }

  //   // Image Magnifier

  // Add To cart
  function addtocart(obj) {
    let itemlist = sessionStorage.getItem("itemlist");
    if (itemlist === null) {
      sessionStorage.setItem("itemlist", JSON.stringify([obj]));
    } else {
      let temp = JSON.parse(itemlist);
      let count = temp.find((x) => x.id === obj.id);
      if (count === undefined) {
        temp.push(obj);
        sessionStorage.setItem("itemlist", JSON.stringify(temp));
      }
    }
    document.getElementsByClassName("cart-text")[0].innerHTML = JSON.parse(
      sessionStorage.getItem("itemlist")
    ).length;
  }
  if (status !== "success") {
    return <div>Loading...</div>;
  }

  if (typeof product.data !== "undefined" && product.data.status === 404) {
    return (
      <div className="row">
        <div className="container">
          <div className="col-12"></div>
          No Product Available
        </div>
      </div>
    );
  }

  return (
    <>
      <section id={product.name}>
        <div className="main">
          <div className="container productpage-container">
            <div className="product-details">
              <div className="row">
                <div className="col-4 ">
                  <div className="image-container">
                    <div
                      className="img-magnifier-container"
                      onMouseEnter={() => {
                        magnify("big-image", 1.5);
                      }}
                      onMouseLeave={() => {
                        if (
                          document.getElementById("img-magnifier-glass") !==
                          null
                        ) {
                          document
                            .getElementById("img-magnifier-glass")
                            .remove();
                        }
                      }}
                    >
                      <img
                        alt={product.name}
                        id="big-image"
                        className="big-image"
                        src={
                          typeof product.images[0] === "undefined"
                            ? ""
                            : product.images[0].src
                        }
                      ></img>
                    </div>
                  </div>
                </div>
                <div className="col-4 col-desc">
                  <div className="product-description">
                    <h2>{product.name}</h2>
                    <p
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    ></p>
                    <>
                      <p>
                        <span>BDT. </span>
                        {product.regular_price === product.price ? (
                          <span style={{ fontSize: "30px" }}>
                            {product.price}
                          </span>
                        ) : (
                          <>
                            <strike>
                              <span style={{ fontSize: "20px" }}>
                                {product.regular_price}
                              </span>
                            </strike>
                            <span id="price" style={{ fontSize: "30px" }}>
                              {product.price}
                            </span>
                          </>
                        )}
                      </p>
                    </>
                    {product.stock_quantity === null ||
                    product.stock_quantity > 0 ? (
                      <>
                        <h3
                          className="btn"
                          onClick={() => {
                            addtocart({
                              id: product.id,
                              name: product.name,
                              price: parseInt(product.price),
                              quantity: 1,
                              stock: product.stock_quantity,
                              img:
                                typeof product.images[0] === "undefined"
                                  ? ""
                                  : product.images[0].src,
                            });
                          }}
                        >
                          Add to Cart
                        </h3>
                        <h3
                          className="btn btn-orrange"
                          onClick={() => {
                            addtocart({
                              id: product.id,
                              name: product.name,
                              price: parseInt(product.price),
                              quantity: 1,
                              stock: product.stock_quantity,
                              img:
                                typeof product.images[0] === "undefined"
                                  ? ""
                                  : product.images[0].src,
                            });
                            history.push("/cart");
                          }}
                        >
                          Buy Now
                        </h3>
                      </>
                    ) : (
                      <h3 className="btn">Stock Out</h3>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Related_Products
              categoryId={product.categories[0].id}
              productId={product.id}
            ></Related_Products>
          </div>
        </div>
        <Newsletter></Newsletter>
      </section>
    </>
  );
}
