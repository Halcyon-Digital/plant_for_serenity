import React from "react";
import "../assets/css/Footer.css";
import logo from "../assets/images/background/logo.png";
import fb from "../assets/images/icons/fb.webp";
import insta from "../assets/images/icons/insta.webp";
import twiter from "../assets/images/icons/twiter.webp";
import linkedin from "../assets/images/icons/linkedin.webp";
import youtube from "../assets/images/icons/youtube.webp";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
export default function Footer() {
  return (
    <div className="footer">
      <div className="row">
        <div className="col-3  fb-100">
          <div>
            <h3 className="title">Contact US</h3>
            <p>Mirpur Road, Shyamoli, Dhaka-1207, Bangladesh</p>
          </div>
        </div>
        <div className="col-2  fb-100">
          <div>
            <h3 className="title"> </h3>
            <p>example@example.com</p>
            <p>+880 165656</p>
          </div>
        </div>

        <div className="col-2 fb-100">
          <h3 className="title">Useful Links</h3>
          <ul className="footer-link">
            <HashLink smooth to="/site_map/#">
              <li>Site Map</li>
            </HashLink>
            <HashLink smooth to="/contact_us/#">
              <li>Store Location</li>
            </HashLink>
            <HashLink smooth to="/terms_and_condition/#">
              <li>Terms Of Service</li>
            </HashLink>
          </ul>
        </div>

        <div className="col-3 footer-logo fb-100">
          <p className="title"> </p>
          <img src={logo} alt="Logo"></img>
          <div className="row social-links">
            <img src={fb} alt="facebook-img"></img>
            <img src={insta} alt="instagram-img"></img>
            <img src={youtube} alt="youtube-img"></img>
          </div>
        </div>
        {/* <div className="col-2"></div> */}
      </div>
    </div>
  );
}
