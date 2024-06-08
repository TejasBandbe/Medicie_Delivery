import React, {useEffect, useState} from 'react';
import { createurl, log } from '../env';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function AdminCards() {

  const [customers, setCustomers] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [medicines, setMedicines] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [delnames, setDelnames] = useState([]);

  useEffect(() => {
    getCards();
    getOrders();
    getDeliveryNames();
  }, []);

  const getCards = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/admin/getcards');
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
            setCustomers(res.data.customers);
            setMedicines(res.data.medicines);
            setDelivery(res.data.delivery);
            setRevenue(res.data.revenue);
        }
    })
    .catch(error => {
        log(error);
    });
  };

  const getOrders = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/admin/getorders');
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
            setOrders(res.data);
            
        }
    })
    .catch(error => {
        log(error);
    });
  };

  const getDeliveryNames = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/admin/getdeliverynames');
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
            setDelnames(res.data);
        }
    })
    .catch(error => {
        log(error);
    });
  };

  const assign = (orderId, deliveryId) => {
    debugger;
    console.log(orderId);
    console.log(deliveryId);

    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/admin/assigndelivery');
    axios.post(url,
    {
        "userId": userId,
        "deliveryPersonId": deliveryId,
        "orderId": orderId, 
    },
    {
        headers: {
            'authorization': `Bearer ${jwtToken}`
    }
    })
    .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
        }else if(res.data.message === 'assigned'){
            log(res.data);
            toast.success(res.data.message, {autoClose: 2000});
        }else if(res.data.message === 'already assigned'){
            toast.error(res.data.message, {autoClose: 2000});
        }
        getOrders();
    })
    .catch(error => {
        debugger;
        log(error);
    });
  };

  return (
    <Container>
      <div className="container">
        <div className="card">Customers count<br/>{customers}</div>
        <div className="card">Delivery Person count<br/>{delivery}</div>
        <div className="card">Products count<br/>{medicines}</div>
        <div className="card">Revenue<br/>₹ {revenue}</div>
      </div>

      {
        orders.length === 0 ? 
        <div className='empty'>
            <div className="box">
                Nothing here. Come back again.
            </div>
        </div>
        :
        <div className="admtable">
        {
          orders.map((order) => (
            <div className="box" key={order.order_no}>
              <div className="left">
                <div>#{order.order_no}</div>
                {
                    window.innerWidth > 850 ?
                    <div>{order.address} - {order.pincode}</div>
                    :
                    <div>{order.pincode}</div>
                }
                
              </div>
              <div className="right">
                <select name="" id={`selectedId${order.id}`}>
                    {
                      delnames.map((name) => (
                        <option value={name.id}>{name.name}</option>
                      ))
                    }
                </select>

                <button className='btn btn-warning' onClick={() => {
                    var selectedId = document.getElementById(`selectedId${order.id}`).value;
                    assign(order.id, selectedId)}
                    }>Assign</button>
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
.container{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-block: 2rem;
  gap: 1rem;

  @media(max-width: 768px){
    grid-template-columns: repeat(2, 1fr);
  }

  .card{
    background-color: #427baa;
    padding: 1rem;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bolder;

    @media(max-width: 1400px){
        font-size: 1.2rem;
    }

    @media(max-width: 1000px){
        font-size: 1rem;
    }

    @media(max-width: 500px){
        font-size: 0.8rem;
    }

  }
}

.admtable{
  padding-inline: 4rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding-bottom: 2rem;
  min-height: 40vh;

  @media(max-width: 768px){
    min-height: 20vh;
  }
  @media(max-width: 650px){
    padding-inline: 1rem;
  }
  @media(max-width: 400px){
    padding-inline: 0.5rem;
  }
  

  .box{
    display: grid;
    grid-template-columns: 80% 20%;
    padding: 0.3rem;
    color: white;
    font-weight: 600;
    gap: 0.5rem;

    @media(max-width: 1400px){
        grid-template-columns: 70% 30%;
    }

    @media(max-width: 850px){
        grid-template-columns: 60% 40%;
    }
    @media(max-width: 650px){
        grid-template-columns: 50% 50%;
    }

    .left{
        display: grid;
        grid-template-columns: 15% 85%;
        gap: 0.5rem;

        @media(max-width: 1200px){
            gap: 0;
            grid-template-columns: 100%;
        }
        @media(max-width: 1000px){
            font-size: 0.8rem;
        }
        @media(max-width: 850px){
            grid-template-columns: 40% 60%;
        }
        @media(max-width: 650px){
            grid-template-columns: 50% 50%;
        }
        @media(max-width: 500px){
            grid-template-columns: 60% 40%;
        }
    }

    .right {
        
        display: flex;
        gap: 1rem;

        @media(max-width: 400px){
            gap: 0.5rem;
        }

        select {
        padding: 0.3rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #ddf;
        color: #333;
        cursor: pointer;

        @media(max-width: 1200px){
            font-size: 0.8rem;
        }
        @media(max-width: 850px){
            padding: 0;
        }
        @media(max-width: 500px){
            font-size: 0.7rem;
        }

        option {
            background-color: #ddf;
            color: #333;
        }
      }

      button{

        @media(max-width: 1200px){
            font-size: 0.8rem;
        }
        @media(max-width: 850px){
            padding: 0.1rem 0.5rem;
        }
        @media(max-width: 500px){
            font-size: 0.7rem;
        }
      }
    }
  }

  .box:nth-child(even){
    background-color: #427baa;
  }
  .box:nth-child(odd){
    background-color: #73b4ea;
  }
}

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

export default AdminCards