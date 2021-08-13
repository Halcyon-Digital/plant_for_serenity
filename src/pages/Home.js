import React from "react";
import { HashLink } from "react-router-hash-link";
import Our_favourites from "../Components/Our_favourites";
import Newsletter from "../Components/Newsletter";
import Category_List from "../Components/Category_List";
import Adds_Slider from "../Components/Adds_Slider";
import Blog_Posts from "../Components/Blogs"
import placeholder from "../assets/images/background/Placeholder.png";
import line_art from "../assets/images/background/line-art.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="main">
      <Adds_Slider></Adds_Slider>
      <div className="container">
        <div className="home-page">
          <div className="row">
            <div className="col-6">
              <img src={placeholder}></img>
            </div>
            <div className="col-4">
              <h2>Most Populer Plant Collections</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iure
                sit labore officia impedit numquam reiciendis explicabo?
                Distinctio officiis, iure in quos ea repellat voluptatem vitae!
              </p>
              <HashLink className="btn" smooth to="#collection_list">
                Shop Collections
              </HashLink>
            </div>
          </div>
        </div>
        <Our_favourites></Our_favourites>
        <Blog_Posts></Blog_Posts>
        <section id="collection_list">
          <Category_List></Category_List>
        </section>
      </div>
      <Newsletter></Newsletter>
    </div>
  );
}
