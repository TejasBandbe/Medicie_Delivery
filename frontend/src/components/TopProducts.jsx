import React from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function TopProducts({ validUser }) {
  const history = useHistory();

  const open = (id) => {
    if(validUser){
      sessionStorage.setItem('prodId', id);
      history.push('/product');
    }else{
      toast.error("Please login first.", {autoClose: 2000});
    }
  };
  
  return (
    <Container>
      <div className="header">
      <h4>TOP PRODUCTS</h4>
      </div>
      
      <div className="cards">

        <div className="card" onClick={() => {open(23)}}>
          <div className="image">
          <img src="https://cdn01.pharmeasy.in/dam/products_otc/I40695/dettol-antiseptic-liquid-bottle-of-550-ml-2-1669710729.jpg?dim=700x0&dpr=1&q=100" alt="" />
          </div>
          
          <h5>Dettol Antiseptic</h5>
          <p>Just ₹ 235/-</p>
        </div>

        <div className="card" onClick={() => {open(10)}}>
          <div className="image">
          <img src="https://cdn01.pharmeasy.in/dam/products_otc/I13917/calcimax-p-strip-of-15-tablets-2-1669710266.jpg?dim=700x0&dpr=1&q=100" alt="" />
          </div>
          
          <h5>Calcimax</h5>
          <p>Just ₹ 190.44/-</p>
        </div>

        <div className="card" onClick={() => {open(13)}}>
          <div className="image">
          <img src="https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100" alt="" />
          </div>
          
          <h5>Liv.52</h5>
          <p>Just ₹ 159.8/-</p>
        </div>

        <div className="card" onClick={() => {open(21)}}>
          <div className="image">
          <img src="https://cdn01.pharmeasy.in/dam/products_otc/I12598/colgate-visible-white-sparking-mint-whitening-toothpaste-tube-of-100-g-2-1669710149.jpg?dim=700x0&dpr=1&q=100" alt="" />
          </div>
          
          <h5>Colgate</h5>
          <p>Just ₹ 149/-</p>
        </div>

      </div>
    </Container>
  )
}

const Container = styled.div`

  .header{
    margin-top: 1rem;
    display: flex;
    justify-content: center;

    h4{
      font-size: 2.5rem;
      font-family: cursive;
      text-decoration: underline;
      color: #122b40;

      @media(max-width: 1000px){
        font-size: 1.5rem;
      }
      @media(max-width: 768px){
        margin: -1rem;
        font-size: 1rem;
      }
    }
  }

  .cards{
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    @media (max-width: 768px){
      gap: 0.5rem;
      margin: 1rem 0.5rem;
    }

    @media (max-width: 500px){
      grid-template-columns: repeat(2, 1fr);
    }

    .card{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #c2d9ec;
      color: black;
      font-family: cursive;
      font-weight: 700;
      transition: all 0.3s;
      cursor: pointer;

      .image{
        display: flex;
        justify-content: center;
        background-color: white;
        width: 100%;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;

        img{
          width: 90%;
          padding: 0.5rem;
          height: 16rem;
          object-fit: contain;

          @media (max-width: 1200px){
            height: 12rem;
          }
          @media (max-width: 1000px){
            height: 10rem;
          }
          @media (max-width: 768px){
            height: 8rem;
          }
          @media (max-width: 600px){
            height: 6rem;
          }
          @media (max-width: 500px){
            height: 8rem;
          }
          @media (max-width: 400px){
            height: 6rem;
          }
        }
      }

      h5{
        line-height: 1;

        @media (max-width: 786px){
          font-size: 1rem;
          line-height: 0.5;
        }
        @media (max-width: 600px){
          font-size: 0.8rem;
          line-height: 0.5;
        }
      }
      p{
        line-height: 1;

        @media (max-width: 786px){
          font-size: 0.7rem;
          line-height: 0.5;
        }
        @media (max-width: 600px){
          font-size: 0.6rem;
          line-height: 0.5;
        }
      }
    }

    .card:hover{
      border: 0.1rem solid #122b40;
      background-color: #427baa;
      color: white;
    }
  }
`;

export default TopProducts