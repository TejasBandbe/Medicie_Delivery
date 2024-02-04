import React from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Categories({ validUser }) {
  const history = useHistory();

  const open = (cat) => {
    debugger;
    if(validUser){
      sessionStorage.setItem('cat', cat);
      history.push('/cat');
    }else{
      toast.error("Please login first.", {autoClose: 2000});
    }
  };

  return (
    <Container>
      <div className="slide-container">
        <div className="slide-content">
        <div className="card-wrapper">
<div className="card">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHRcDgKQ2ddFvinb18TFjoNS9O9J8Axzva0w&usqp=CAU" alt="" />
  <h5>Medicines</h5>
  <p>10% off</p>
  <button onClick={() => {open('medicine')}}>Shop</button>
</div>

<div className="card">
  <img src="https://cdn01.pharmeasy.in/dam/discovery/categoryImages/35d6d4e00e5d3058906cfa8b92ca799c.png?f=png?dim=256x0https://cdn01.pharmeasy.in/dam/discovery/categoryImages/35d6d4e00e5d3058906cfa8b92ca799c.png?f=png?dim=256x0" alt="" />
  <h5>Healthcare</h5>
  <p>9% off</p>
  <button onClick={() => {open('healthcare')}}>Shop</button>
</div>

<div className="card">
  <img src="https://cdn01.pharmeasy.in/dam/products_otc/B63401/pharmeasy-infrared-thermometer-2-1671745340.jpg?dim=1440x0" alt="" />
  <h5>Devices</h5>
  <p>9% off</p>
  <button onClick={() => {open('devices')}}>Shop</button>
</div>

<div className="card">
  <img src="https://cdn01.pharmeasy.in/dam/discovery/categoryImages/ce48d6d71ace3892945f0b0a64c1f0e9.png?f=png?dim=256x0" alt="" />
  <h5>Skin care</h5>
  <p>12% off</p>
  <button onClick={() => {open('skincare')}}>Shop</button>
</div>

<div className="card">
  <img src="https://cdn01.pharmeasy.in/dam/discovery/categoryImages/ecad9a974e003fb987858b3ee81413c6.png?f=png?dim=256x0" alt="" />
  <h5>Ayurvedic</h5>
  <p>8% off</p>
  <button onClick={() => {open('ayurvedic')}}>Shop</button>
</div>

<div className="card">
  <img src="https://cdn01.pharmeasy.in/dam/discovery/categoryImages/514d0d7d01a63502b4ebfec9ae26f4d2.png?f=png?dim=256x0" alt="" />
  <h5>Fitness</h5>
  <p>15% off</p>
  <button onClick={() => {open('fitness')}}>Shop</button>
</div>
        </div>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`

  .slide-container{
    margin: 0 2rem;
    padding: 0.5rem;
    @media (max-width: 550px){
      margin: 0;
    }
    .slide-content{

      .card-wrapper{
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 1rem;

        @media (max-width: 1000px){
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 450px){
          gap: 0.3rem;
        }
        .card{
          background-color: #265073;
          display: flex;
          flex-direction: column;
          align-items: center;

          img{
            padding: 1rem 1rem 0.5rem 1rem;
            width: 90%;
            height: 13rem;
            object-fit: contain;

            @media (max-width: 1300px){
              height: 10rem;
            }

            @media (max-width: 1200px){
              height: 8rem;
              width: 100%;
            }
            @media (max-width: 1000px){
              height: 12rem;
            }
            @media (max-width: 768px){
              height: 9rem;
            }
            @media (max-width: 600px){
              height: 6rem;
            }
            @media (max-width: 550px){
              padding: 0.3rem;
            }
            @media (max-width: 400px){
              height: 5rem;
            }
          }

          h5{
            line-height: 0.8;
            @media (max-width: 1200px){
              font-size: 1rem;
            }
            @media (max-width: 1000px){
              font-size: 1.2rem;
            }
            @media (max-width: 768px){
              font-size: 1rem;
            }
            @media (max-width: 500px){
              font-size: 0.8rem;
            }
          }
          p{
            line-height: 0.8;
            @media (max-width: 1200px){
              font-size: 0.8rem;
            }
            @media (max-width: 1000px){
              font-size: 1rem;
            }
            @media (max-width: 768px){
              font-size: 0.8rem;
            }
            @media (max-width: 500px){
              font-size: 0.7rem;
            }
          }

          button{
            font-weight: 700;
            margin-bottom: 0.5rem;
            width: 60%;
            background-color: #122b40;
            color: white;
            padding: 0.3rem;
            border-radius: 0.5rem;
            transition: all 0.2s;

            @media (max-width: 1200px){
              font-size: 0.8rem;
            }
            @media (max-width: 1000px){
              font-size: 1.2rem;
            }
            @media (max-width: 768px){
              font-size: 0.8rem;
              margin-top: -0.5rem;
              padding: 0.2rem;
            }
          }
          button:hover{
            transform: scale(0.9);
          }
        }
      }
    }
  }
`;

export default Categories