import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom';

function Products() {

  const [products, setProducts] = useState([]);
  const [curProd, setCurProd] = useState(0);

  const history = useHistory();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/admin/getproducts');
    axios.post(url,
    {
        "userId": userId,
    },
    {
        headers: {
            'authorization': `Bearer ${jwtToken}`
    }
    })
    .then(res => {
        if(res.status === 400 || res.status === 401){
        }else if(res.status === 200){
            log(res.data);
            setProducts(res.data);
        }
    })
    .catch(error => {
        log(error);
    });
  };

  const groupedData = products.reduce((result, item) => {
    const category = item.category;

    if (!result[category]) {
      result[category] = [];
    }

    result[category].push(item);

    return result;
  }, {});

  const deleteProduct = () => {
    // toast.error("I don't want to remove this product.", {autoClose: 2000});
    toast.success("Product removed", {autoClose: 2000});
  };

  const editProduct = (prodId) => {
    debugger;
    sessionStorage.setItem("prodId", prodId);
    history.push('/editproduct');
  };

  return (
<Container>
  {/* ==================================== */}
  <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Are you sure?</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-warning" 
        data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={deleteProduct}>Yes</button>
        <button type="button" className="btn btn-danger" 
        data-bs-toggle="modal" data-bs-target="#exampleModal">No</button>
      </div>
    </div>
  </div>
</div>
  {/* ==================================== */}
<div className="page">
        <div className="heading">MY PRODUCTS</div>

          {
            Object.keys(groupedData).map((category) => (
              <div className='group' key={category}>
                <div className="cat">
                <h5>--{category}--</h5>
                </div>
                <div className="cards">

              {
                groupedData[category].map((item) => (
                  <div className="card" key={item.id}>
                    <div className="image">
                      <div className="heart">{item.likes} likes</div>
                      {/* <div className="heart">
                        {
                          isLiked(item.id) ? 
                          <i className="fa-solid fa-heart" style={{color: "red"}}></i> 
                          : 
                          <i className="fa-solid fa-heart"></i>
                        }
                      </div> */}
                      <div className="purchases">{item.oicount} purchases</div>
                    <img src={item.image} alt=""/>
                    </div>
                    <div className="content">
                    <h6 className='item-name'>{item.name}</h6>
                    <h6>{item.manufacturer}</h6>
                    <p>{item.description}</p>
                    <div className="price">
                    <p>₹ {item.unit_price}/-</p>
                    <p>{Math.round(item.discount * 100)}% off</p>
                    </div>
                    <p>{item.available_qty} available</p>
                    
                    <div className="buttons">
                    <i className="fa-solid fa-pen-to-square" onClick={() => {editProduct(item.id)}}></i>
                    <i className="fa-solid fa-trash-can" onClick={() => {setCurProd(item.id)}}
                    data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                    </div>
                    </div>
                  </div>
                        ))
              }

                </div>
              </div>
            ))
          }
        
      </div>
</Container>
  )
}

const Container = styled.div`
.page{
  padding-top: 2rem;
  
  .heading{
    text-align: center;
    font-size: 3rem;
    font-weight: bolder;

    @media(max-width: 1000px){
      font-size: 2.5rem;
    }
    @media(max-width: 600px){
      font-size: 2rem;
    }
  }

  .group{

  .cat{
    text-transform: uppercase;
    padding-left: 5rem;

    @media(max-width: 768px){
      padding-left: 2rem;
    }

    h5{
      font-size: 2rem;

      @media(max-width: 1300px){
        font-size: 1.5rem;
      }
      @media(max-width: 768px){
        font-size: 1.2rem;
      }
      @media(max-width: 450px){
        font-size: 1rem;
      }
    }
  }

  .cards{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    margin: 1rem;

    @media (max-width: 1300px){
      grid-template-columns: repeat(5, 1fr);
    }
    @media (max-width: 1000px){
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 800px){
      grid-template-columns: repeat(3, 1fr);
      margin: 0.5rem;
      gap: 0.5rem;
    }
    @media (max-width: 550px){
      grid-template-columns: repeat(2, 1fr);
      margin: 0.5rem;
      gap: 0.5rem;
    }

    .card{
      color: #000;
      background-color: #e2ae2b;

      .image{
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        z-index: 0;

        @media(max-width: 768px){
          margin-bottom: 0.5rem;
        }

        img{
          border-radius: 0.5rem;
          width: 100%;
          height: 16rem;
          object-fit: contain;
          cursor: pointer;

          @media(max-width: 1500px){
            height: 12rem;
          }
          @media(max-width: 1300px){
            height: 10rem;
          }
          @media(max-width: 768px){
            height: 6rem;
          }
          @media(max-width: 500px){
            height: 5rem;
          }
          @media(max-width: 450px){
            height: 3rem;
          }
        }

        .heart{
          background-color: #e2ae2b;
          position: absolute;
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          font-size: 0.8rem;

          @media(max-width: 1300px){
            padding: 0.3rem 0.4rem;
          }
          @media(max-width: 768px){
            padding: 0rem 0.3rem;
            height: 1.3rem;
          }
          @media(max-width: 500px){
            padding: 0 0.1rem;
            border-radius: 0.3rem;
            font-size: 0.6rem;
          }

          .fa-heart{
            font-size: 1.2rem;
            color: white;

            @media(max-width: 1300px){
              font-size: 1rem;
            }
            @media(max-width: 768px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.5rem;
            }
          }
        }

        .purchases{
          background-color: #e2ae2b;
          position: absolute;
          right: 1rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          font-size: 0.8rem;

          @media(max-width: 1300px){
            padding: 0.3rem 0.4rem;
          }
          @media(max-width: 768px){
            padding: 0rem 0.3rem;
            height: 1.3rem;
          }
          @media(max-width: 500px){
            padding: 0 0.1rem;
            border-radius: 0.3rem;
            font-size: 0.6rem;
          }
        }
      }

      .content{
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media(max-width: 768px){
          padding: 0.2rem 0;
        }

        h6{
          line-height: 1;
          font-size: 1.2rem;
          text-align: center;

          @media (max-width: 1300px){
            font-size: 1rem;
            line-height: 0.8;
          }
          @media(max-width: 768px){
            font-size: 0.8rem;
          }
          @media(max-width: 450px){
            font-size: 0.6rem;
            line-height: 0.6;
          }
        }
        p{
          line-height: 1.2;
          text-align: center;
          margin: 0.1rem;;

          @media (max-width: 1300px){
            line-height: 1.2;
          }
          @media (max-width: 1100px){
            font-size: 0.8rem;
          }
          @media(max-width: 768px){
            font-size: 0.8rem;
          }
          @media(max-width: 450px){
            font-size: 0.6rem;
            line-height: 1.2;
          }
        }

        .price{
          display: flex;
          gap: 1rem;

          @media (max-width: 1300px){
            line-height: 1.2;
          }
          @media (max-width: 1100px){
            font-size: 0.8rem;
          }
          @media(max-width: 768px){
            font-size: 0.8rem;
          }
          @media(max-width: 450px){
            font-size: 0.6rem;
            line-height: 1.2;
          }
        }

        .buttons{
          font-size: 1.2rem;
          display: flex;
          margin-top: 1rem;
          gap: 2rem;
          cursor: pointer;
        }

        .fa-pen-to-square:hover,
        .fa-trash-can:hover
        {
          color: white;
        }

        button{

          @media(max-width: 768px){
            font-size: 0.7rem;
            margin-top: -0.5rem;
            padding: 0.2rem 1rem;
          }
          @media(max-width: 450px){
            padding: 0.2rem 0.3rem;
          }
        }

        .item-name{
          cursor: pointer;
          transition: all 0.2s;
        }

        .item-name:hover{
          transform: scale(1.1);
          text-decoration: underline;
          color: white;
        }
      }
      
    }
  }
  }
}
`;

export default Products