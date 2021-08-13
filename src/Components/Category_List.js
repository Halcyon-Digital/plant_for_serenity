import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { type } from "jquery";
const proxy = process.env.REACT_APP_PROXY;
const ck = process.env.REACT_APP_CK;
const cs = process.env.REACT_APP_CS;

const fetchcategory = async (x) => {
  const data = await fetch(`${proxy}wc/v3/products/categories?per_page=100`, {
    headers: new Headers({
      Authorization: `Basic ${window.btoa(`${ck}:${cs}`)}`,
    }),
  });

  return data.json();
};

export default function Category_List() {
  var { data, status } = useQuery(["categorydata"], fetchcategory);
  // console.log(data);
  return (
    <>
      {typeof data !== "undefined" ? (
        <>
          {data.length === 0 ? null : (
            <>
              <div className="category-container">
                <div className="row">
                  <h2 className="title">Collection List</h2>
                </div>
                <div className="row">
                  <div>
                    <div className="row">
                      {/* Loop Throu out the products Available */}
                      {data
                        .filter((x) => x.display === "default")
                        .map((category, key) => (
                          <Link
                            to={{
                              pathname: `/category/${category.id}`,
                              hash: `${category.name}`,
                            }}
                          >
                            <React.Fragment key={key}>
                              <div
                                className="card-item"
                                style={{
                                  backgroundImage: `url(${category.image.src})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundSize: "100% 100%",
                                }}
                              >
                                <h3 className="card-title">{category.name}</h3>
                              </div>
                            </React.Fragment>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <Link className="btn btn-orrange">View All</Link>
                </div> */}
              </div>
            </>
          )}
        </>
      ) : null}
    </>
  );
}




