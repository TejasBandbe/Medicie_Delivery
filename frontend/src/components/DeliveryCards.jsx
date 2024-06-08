import React, {useEffect, useState} from 'react';
import { createurl, log } from '../env';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function DeliveryCards() {

const [deliveries, setDeliveries] = useState([]);
const [totalDeliveries, setTotalDeliveries] = useState();

useEffect(() => {
  getTotalDeliveries();
  getPendingDeliveries();
}, []);

const getPendingDeliveries = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/delivery/pendingdeliveries');
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
            setDeliveries(res.data);
        }
    })
    .catch(error => {
        log(error);
    });
};

const groupedData = deliveries.reduce((result, item) => {
  debugger;
  const orderNo = item.order_no;

  if (!result[orderNo]) {
    result[orderNo] = [];
  }

  result[orderNo].push(item);
  return result;
}, {});

log(groupedData);

const getTotalDeliveries = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/delivery/totaldeliveries');
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
            setTotalDeliveries(res.data[0].deliveries);
        }
    })
    .catch(error => {
        log(error);
    });
};

const completeDelivery = (orderId) => {
  var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
  var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
  const url = createurl('/delivery/completedelivery');
  axios.post(url,
  {
      "userId": userId,
      "orderId": orderId
  },
  {
      headers: {
          'authorization': `Bearer ${jwtToken}`
  }
  })
  .then(res => {
      if(res.status === 400 || res.status === 401){
        toast.error('soething went wrong', {autoClose: 2000});
      }else if(res.status === 200){
          log(res.data);
          getPendingDeliveries();
          getTotalDeliveries();
          toast.success('order is marked as delivered', {autoClose: 2000});
      }
  })
  .catch(error => {
      log(error);
  });
};

  return (
    <Container>
    <div className="line">
        Today's Deliveries: {Object.keys(groupedData).length}
    </div>
{
  deliveries.length === 0 ?
  <div className='empty'>
      <div className="box">
          Nothing here. Come back again.
      </div>
  </div>
  :
  <div className="cards">
  {
    Object.keys(groupedData).map((orderNo) => (
    <div className="card" key={orderNo}>
      <div className="top">
        <div className="orderno">#{orderNo}</div>
        <div className="custname">{groupedData[orderNo][0].username}</div>
        <div></div>
      </div>
  
      <div className="mid">
        <div className="address">
          Address: {groupedData[orderNo][0].address} - {groupedData[orderNo][0].pincode}
        </div>
        <div className="contact">Mobile No.: {groupedData[orderNo][0].mob_no}</div>
        <div className="amount">Total Amount: ₹ {Math.round(groupedData[orderNo][0].order_total * 100) / 100}/-</div>
      </div>
  
      <div className="bottom">
        {
          groupedData[orderNo].map((item) => (
            <li key={item.order_no} className='products'>{item.medicineName}</li>
          ))
        }
      </div>
      <div className="button">
          <div className="btn btn-warning" 
          onClick={() => {completeDelivery(groupedData[orderNo][0].orderId)}}>Complete Delivery</div>
        </div>
    </div>
    ))
  }
      </div>
}

    </Container>
  )
}

const Container = styled.div`
min-height: 60vh;
.line{
  background-color: #427baa;
  color: white;
  font-size: 1.5rem;
  padding-block: 0.5rem;
  font-weight: bolder;
  display: flex;
  justify-content: center;
}

.cards{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem;

  .card{
    display: flex;
    flex-direction: column;
    background-color: #427baa;
    padding: 1rem;
    gap: 0.7rem;

    .top{
      display: grid;
      grid-template-columns: 30% 65% 5%;

      .orderno{
        font-weight: bolder;
        font-size: 1.2rem;
      }

      .custname{
        font-weight: bolder;
        font-size: 1.2rem;
      }
    }

    .mid{
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .address{

      }

      .contact{

      }

      .amount{

      }

    }

    .bottom{

    }

    .button{
      .btn-warning{
        position: absolute;
        bottom: 1rem;
        right: 1rem;
      }
    }
  }
}
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   padding-block: 2rem;
//   gap: 1rem;

//   @media(max-width: 768px){
//     grid-template-columns: repeat(2, 1fr);
//   }

//   .card{
//     background-color: #427baa;
//     padding: 1rem;
//     display: flex;
//     justify-content: center;
//     text-align: center;
//     font-size: 1.5rem;
//     font-weight: bolder;

//     @media(max-width: 1400px){
//         font-size: 1.2rem;
//     }

//     @media(max-width: 1000px){
//         font-size: 1rem;
//     }

//     @media(max-width: 500px){
//         font-size: 0.8rem;
//     }

//   }

.empty{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
  min-height: 40vh;

  @media(max-width: 768px){
    min-height: 20vh;
  }

  .box{
    width: 50%;
    background-color: #427baa;
    color: white;
    padding: 1rem;
    font-size: 2rem;
    text-align: center;
    font-weight: bolder;

    @media(max-width: 1000px){
        width: 70%;
    }
    @media(max-width: 768px){
        font-size: 1.5rem;
    }
    @media(max-width: 600px){
        font-size: 1.2rem;
    }
  }
}
`;

export default DeliveryCards
