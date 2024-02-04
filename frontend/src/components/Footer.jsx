import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Footer() {
  const [email, setEmail] = useState('');

  useEffect(() => {
  }, [email, setEmail]);

  const subscribe = () => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    
    if(email.match(emailRegex)){
      setEmail('');
      toast.success("Newsletter subscribed. Please check your inbox for further details.", {autoClose: 4000});
    }else{
      toast.error("Invalid email id", {autoClose: 1500});
    }
  };

  return (
    <Container>
<div className="footer">
    <div className="footer-container">
      <div className="box logo">
          <h3>PillPulse</h3>
          <p>Your Health, Our Priority</p>

          <div className="share">
              <a className="fab fa-facebook-f"></a>
              <a className="fab fa-twitter"></a>
              <a className="fab fa-instagram"></a>
              <a className="fab fa-linkedin"></a>
          </div>
      </div>

        <div className="box">
            <h3>Contact</h3>
            <a className="links"><i className="fas fa-phone"></i> +123-456-789</a>
            <a className="links"><i className="fas fa-phone"></i> +111-222-333</a>
            <a className="links"><i className="fas fa-envelope"></i> sample@gmail.com</a>
            <a className="links"><i className="fas fa-map-marker-alt"></i> Hinjawadi, Pune, India</a>
        </div>

        <div className="box">
            <h3>Quick Links</h3>
            <a href="/" className="links"><i className="fa-solid fa-arrow-right"></i>Home</a>
            <a href="/dellogin" className="links"><i className="fa-solid fa-arrow-right"></i>Delivery</a>
            <a href="/about"  className="links"><i className="fa-solid fa-arrow-right"></i>About Us</a>
            <a href="/contact" className="links"><i className="fa-solid fa-arrow-right"></i>Contact Us</a>
        </div>

        <div className="box newsletter">
            <h3>Newsletter</h3>
            <p>Subscribe for latest updates</p>
            <input type="email" className="email" placeholder="your email id" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <div>
              <input type="submit" value="subscribe" className="btn btn-info" onClick={subscribe}/>
            </div>
        </div>
    </div>

    <div className="credits">
        BlogSphere @ 2023 | All Rights Reserved
    </div>
</div>
    </Container>
  )
}

const Container = styled.div`
  .footer{
    background-color: #122b40;

    .footer-container{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      padding-top: 2rem;
      padding-left: 1rem;

      @media screen and (max-width: 800px){
        grid-template-columns: repeat(2, 1fr);
      }
      @media screen and (max-width: 576px){
        gap: 0.5rem;
        padding-top: 1rem;
        padding-left: 0.5rem;
      }

      .box h3{

        @media screen and (max-width: 1000px){
          font-size: 1.4rem;
        }
        @media screen and (max-width: 576px){
          font-size: 1rem;
        }
      }
      .box p{

        @media screen and (max-width: 1000px){
          font-size: 0.8rem;
        }
        @media screen and (max-width: 576px){
          font-size: 0.7rem;
        }
      }

      .box h3,
      .box p{
        color: white;
      }

      .box .share a{
        color: white;
        height: 4rem;
        width: 4rem;
        line-height: 4rem;
        border-radius: .5rem;
        font-size: 2rem;
        margin-left: .2rem;
        background: #265073;
        text-align: center;
        transition: 0.4s;
        text-decoration: none;
        cursor: pointer;

        @media screen and (max-width: 1339px){
          height: 3rem;
          width: 3rem;
          line-height: 3rem;
          font-size: 1.5rem;
        }
        @media screen and (max-width: 920px){
          height: 2.5rem;
          width: 2.5rem;
          line-height: 2.5rem;
          font-size: 1.2rem;
        }
        @media screen and (max-width: 576px){
          height: 2.1rem;
          width: 2.1rem;
          line-height: 2.1rem;
          font-size: 1rem;
        }
      }

      .box .share a:hover{
        transform: scale(0.7);
      }

      .box .links{
        display: block;
        font-size: 1rem;
        color: #fff;
        padding: 0.4rem 0;
        text-decoration: none;
        cursor: pointer;

        @media screen and (max-width: 1000px){
          font-size: 0.8rem;
        }
        @media screen and (max-width: 576px){
          font-size: 0.6rem;
        }
      }

      .box .links i{
        padding-right: 0.5rem;
        transition: 0.4s;
      }

      .box .links:hover i{
        padding-right: 1.5rem;
      }

      .newsletter .email{
        height: 2.5rem;
        width: 80%;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border: none;
        padding-left: 0.5rem;

        @media screen and (max-width: 576px){
          height: 1.8rem;
          width: 95%;
          font-size: 0.7rem;
        }
      }

      .newsletter .email:focus{
        outline: none;
        box-shadow: 0 0 0.4rem 0.3rem rgb(27, 227, 204);

        @media screen and (max-width: 576px){
          box-shadow: 0 0 0.2rem 0.1rem rgb(27, 227, 204);
        }
      }

      .newsletter .btn{
        transition: 0.2s;
        @media screen and (max-width: 576px){
          font-size: 0.7rem;
        }
      }

      .newsletter .btn:hover{
        transform: scale(0.9);
      }
    }

    .credits{
      margin-top: 2rem;
      padding-bottom: 2rem;
      background-color: #122b40;
      color: white;
      font-size: 1.5rem;
      text-align: center;

      @media screen and (max-width: 1000px){
        font-size: 1rem;
      }
      @media screen and (max-width: 576px){
        font-size: 0.7rem;
        margin-top: 1rem;
        padding-bottom: 1rem;
      }
    }
  }
`;

export default Footer