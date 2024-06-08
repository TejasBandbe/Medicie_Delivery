import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { createurl, log } from '../env';
import { useHistory } from 'react-router-dom';

function OrderCards({ orders, setValidUser }) {

  const [curOrder, setCurOrder] = useState([
    {
      "order_no": "240208-00002",
      "userName": "Tejas Bandbe",
      "email_id": "bandbetejas65@gmail.com",
      "mob_no": "9823629902",
      "address": "1D, Radheya HGS, Ravindra Nagar, Karwanchi wadi road, Kuwarbav, Ratnagiri",
      "pincode": "415639",
      "medicineName": "Liv.52",
      "manufacturer": "PQR Pharma",
      "image": "https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100",
      "description": "Himalaya Liv.52 Tablets - 100",
      "unit_price": 159.8,
      "discount": 0.05,
      "quantity": 1,
      "total": 151.81,
      "order_total": 747.582,
      "exp_date": "2025-08-30T18:30:00.000Z",
      "o_timestamp": "2024-02-08T04:32:14.000Z",
      "d_timestamp": "2024-02-11T04:32:14.000Z",
      "order_status": "ordered"
    },
    {
      "order_no": "240208-00002",
      "userName": "Tejas Bandbe",
      "email_id": "bandbetejas65@gmail.com",
      "mob_no": "9823629902",
      "address": "1D, Radheya HGS, Ravindra Nagar, Karwanchi wadi road, Kuwarbav, Ratnagiri",
      "pincode": "415639",
      "medicineName": "Liv.52",
      "manufacturer": "PQR Pharma",
      "image": "https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100",
      "description": "Himalaya Liv.52 Tablets - 100",
      "unit_price": 159.8,
      "discount": 0.05,
      "quantity": 1,
      "total": 151.81,
      "order_total": 747.582,
      "exp_date": "2025-08-30T18:30:00.000Z",
      "o_timestamp": "2024-02-08T04:32:14.000Z",
      "d_timestamp": "2024-02-11T04:32:14.000Z",
      "order_status": "ordered"
    },
    {
      "order_no": "240208-00002",
      "userName": "Tejas Bandbe",
      "email_id": "bandbetejas65@gmail.com",
      "mob_no": "9823629902",
      "address": "1D, Radheya HGS, Ravindra Nagar, Karwanchi wadi road, Kuwarbav, Ratnagiri",
      "pincode": "415639",
      "medicineName": "Liv.52",
      "manufacturer": "PQR Pharma",
      "image": "https://cdn01.pharmeasy.in/dam/products_otc/105920/himalaya-liv52-tablets-100s-2-1671740901.jpg?dim=700x0&dpr=1&q=100",
      "description": "Himalaya Liv.52 Tablets - 100",
      "unit_price": 159.8,
      "discount": 0.05,
      "quantity": 1,
      "total": 151.81,
      "order_total": 747.582,
      "exp_date": "2025-08-30T18:30:00.000Z",
      "o_timestamp": "2024-02-08T04:32:14.000Z",
      "d_timestamp": "2024-02-11T04:32:14.000Z",
      "order_status": "ordered"
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  const history = useHistory();

  // useEffect(() => {
  //   getorder('240208-00002');
  // }, []);

    const groupedData = orders.reduce((result, item) => {
        const orderNo = item.order_no;
    
        if (!result[orderNo]) {
          result[orderNo] = [];
        }
    
        result[orderNo].push(item);
        return result;
      }, {});

      setTimeout(() => {
        console.log(groupedData);
      }, 500);

  const getorder = (orderNo) => {
    
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/getorder');
    axios.post(url,
        {
        "userId": userId,
        "orderNo": orderNo,
        },
        {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
        })
        .then(res => {
          debugger;
        if(res.status === 400 || res.status === 401){
          setValidUser(false);
          history.push('/');
        }else if(res.status === 200){
          setShowModal(true);
          log(res.data);
          setCurOrder(res.data);
        }
        })
        .catch(error => {
          debugger;
          log(error);
          setValidUser(false);
          history.push('/');
        });
  };

  const cancelOrder = (orderNo) => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/cancelorder');
    axios.post(url,
        {
        "userId": userId,
        "orderNo": orderNo,
        },
        {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
        })
        .then(res => {
          debugger;
        if(res.status === 400 || res.status === 401){
          setValidUser(false);
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          toast.success(res.data.message, {autoClose: 2000});
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        })
        .catch(error => {
          debugger;
          log(error);
          setValidUser(false);
          history.push('/');
        });
  };

  const MyModal = () => {
    return(<>
    <div className="modal-wrapper" onClick={() => {setShowModal(false)}}></div>
      <div className="modal-page">
        
      <div className='mymodal'>
      <i className="fa-solid fa-x" onClick={() => {setShowModal(false)}}></i>
        <h4>Order #{curOrder[0].order_no}</h4>
        {
          (curOrder[0].order_status === 'ordered') ? 
          <div className='info'>Ordered on {new Date(curOrder[0].o_timestamp).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })}</div> 
          : 
          <>
          {
            (curOrder[0].order_status === 'delivered') ? 
            <div className='info'>Delivered on {new Date(curOrder[0].d_timestamp).toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })}</div>
            : 
            <div className='info'>Cancelled on {new Date(curOrder[0].d_timestamp).toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })}</div>
          }
          </>
        }
        <div className='info'>Total Amount: ₹ {curOrder[0].order_total}</div>
        <div className='info'>Delivery Address: {curOrder[0].address} - {curOrder[0].pincode}</div>
        
      <div className='cards'>
      {
        curOrder.map((item, index) => (
          <div className="card" key={index}>
          
        <div className="image">
          <img src={item.image} alt="" />
        </div>
        <div className="content">
            <div className="name">
            {item.medicineName} by {item.manufacturer}
            </div>
            <div className="desc">
            {item.description}
            </div>
            <div className="quantity">
              Quantity: {item.quantity}
            </div>
            <div className="bottom">
              <div className="subtotal">
              Subtotal: ₹ {Math.round(item.total * 100) / 100}
              </div>
            
            </div>
        </div>
    </div>
        ))
      }
      </div>
      </div>
      </div>
      </>
    );
  };

  return (
<Container>
  {
    showModal && <MyModal/>
  }
  
  <div className="page">
    {
      Object.keys(groupedData).map((orderNo) => (
        <div className='card group' key={orderNo}>
          <div className="top">
          <div className="orderno">#{orderNo}</div>
          <div className="orderstatus">
          {
          groupedData[orderNo][0].order_status === 'delivered' ?
          <div className='delivered'>
            <span>delivered on {new Date(groupedData[orderNo][0].d_timestamp).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            })}</span>
          </div>
          :
          <>
          {
            groupedData[orderNo][0].order_status === 'ordered' ?
            <div className='ordered'>placed on {new Date(groupedData[orderNo][0].o_timestamp).toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              })}
            </div>
          :
          <div className='cancelled'><span>cancelled</span></div>
          }
          </>
          }
          </div>
          <i className="fa-solid fa-chevron-right" id={`rightarrow${orderNo}`}
          onClick={() => {getorder(orderNo)}}></i>
          </div>

          <div className="bottom">
            {
              groupedData[orderNo].map((items) => (
                <li key={items.medicineName}>{items.medicineName}</li>
              ))
            }
          </div>

          {
            groupedData[orderNo][0].order_status === 'ordered' ?
            <button className='btn btn-warning' onClick={() => {cancelOrder(orderNo)}}>Cancel Order</button>
            :
            <></>
          }
          
        </div>
      ))
    }
  </div>
</Container>
  )
}

const Container = styled.div`
.page{
  padding: 1rem;
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 1rem;
  min-height: 50vh;

  @media(max-width: 1000px){
    grid-template-columns: auto auto;
  }
  @media(max-width: 700px){
    grid-template-columns: auto;
  }

  .group{
    background-color: #427baa;
    padding: 0.5rem;

    .top{
      display: grid;
      grid-template-columns: 40% 55% 5%;
      margin-bottom: 1rem;
      align-items: center;

      @media(max-width: 1350px){
        font-size: 0.8rem;
      }

      i{
        cursor: pointer;
      }

      .fa-chevron-down{
        display: none;
      }
      .fa-chevron-right{
        display: block;
      }

      .orderstatus{

        .ordered{
          font-weight: 600;
        }

        .delivered{

          span{
            font-weight: 600;
            color: green;
            padding-inline: 0.5rem;
            background-color: rgba(255,255,255,0.7);
          }
        }

        .cancelled{

          span{
            font-weight: 600;
            color: red;
            padding-inline: 0.5rem;
            background-color: rgba(255,255,255,0.7);
          }
        }
      }
    }

    .bottom{

      li{

        @media(max-width: 1360px){
          font-size: 0.8rem;
        }
      }
    }

    .btn{
      position: absolute;
      bottom: 0.2rem;
      right: 1rem;
      font-size: 0.9rem;
      padding: 0.1rem 0.5rem;

      @media(max-width: 1200px){
        font-size: 0.7rem;
      }
      @media(max-width: 1200px){
        font-size: 0.6rem;
      }
    }
  }
}

.modal-wrapper{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(50,50,50,0.9);
  z-index: 2;
}

.modal-page{
  display: flex;
  justify-content: center;

  .mymodal{
    position: fixed;
    top: 2rem;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    width: 80%;
    max-height: 90vh;
    overflow-y: auto;

    @media(max-width: 1400px){
      width: 90%;
    }

    .fa-x{
      position: relative;
      font-size: 1.2rem;
      cursor: pointer;
      right: -45%;
      top: 1rem;
    }

    h4{
      @media(max-width: 768px){
        font-size: 1rem;
      }
    }

    .info{
      font-size: 1.2rem;
      font-weight: 600;
      text-align: center;
      padding-inline: 1rem;
    
      @media(max-width: 1200px){
        font-size: 1rem;
      }
      @media(max-width: 768px){
        font-size: 0.8rem;
      }
    }

    .cards{
      margin: 0.5rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 1rem;
      @media(max-width: 1200px){
        grid-template-columns: repeat(2, 1fr);
      }
      @media(max-width: 768px){
        grid-template-columns: repeat(1, 1fr);
        margin-top: -0.5rem;
      }
      @media(max-width: 500px){
        margin: 0.5rem;
        gap: 0.5rem;
        padding: 0.2rem;
      }
  
      .card{
        background-color: #427baa;
        display: grid;
        grid-template-columns: 30% 70%;
        padding: 0.5rem;
        height: auto;
  
        .image{
          background-color: white;
          border-radius: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem;
  
          img{
            width: 100%;
            height: 10rem;
            border-radius: 0.5rem;
            object-fit: contain;
  
            @media(max-width: 1000px){
              height: 6rem;
            }
            @media(max-width: 500px){
              height: 5rem;
            }
          }
        }
  
        .content{
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          line-height: 1.2;
  
          @media(max-width: 1000px){
            gap: 0.2rem;
            padding: 0 0.5rem 0.5rem 1rem;
          }
          @media(max-width: 500px){
            gap: 0;
            line-height: 1.4;
          }
  
  
          .name{
            font-size: 1rem;
            padding-right: 1rem;
  
            @media(max-width: 1000px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }
  
          .desc{
            font-size: 1rem;
  
            @media(max-width: 1200px){
              font-size: 1rem;
            }
            @media(max-width: 1000px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.7rem;
            }
          }
  
          .quantity{
            font-size: 1rem;
  
            @media(max-width: 1200px){
              font-size: 1rem;
            }
            @media(max-width: 1000px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.7rem;
            }
          }
  
          .bottom{
            display: flex;
            align-items: center;
            font-size: 1rem;
  
            @media(max-width: 1200px){
              font-size: 1.2rem;
            }
            @media(max-width: 1000px){
              font-size: 0.8rem;
              gap: 2rem;
            }
            @media(max-width: 500px){
              font-size: 0.8rem;
            }
  
            .subtotal{
              font-weight: 600;
              color: yellow;
            }
  
          }
        }
      }
    }
  }
}
`;

export default OrderCards