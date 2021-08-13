import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/slider.css";

export default function Adds_Slider() {
  const delay = 3000;
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  const [adds, setadds] = useState([]);
  const proxy = process.env.REACT_APP_PROXY;

  useEffect(() => {
    axios.get(`${proxy}wp/v2/adds`).then((res, err) => {
      if (err) {
        console.log(err);
      } else {
        setadds(res.data);
      }
    });
  }, []);
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    if (index > adds.length) {
      setIndex(0);
    }
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === adds.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <>
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {adds.map((add, index) => (
            <Link key={index} to={`/product/${add.acf.product_id}`}>
              <div
                className="slide"
                key={index}
                style={{
                  backgroundImage: `url(${add.acf.image.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100% 100%",
                  height: "35vw",
                  minHeight: "190px",
                  width: "100%",
                }}
              ></div>
            </Link>
          ))}
        </div>
      </div>
      <div className="slideshowDots">
        {adds.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </>
  );
}
