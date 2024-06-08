import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import OrderCards from '../components/OrderCards';

function MyOrders() {

  const [validUser, setValidUser] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async() => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/myorders');
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
            setValidUser(false);
        }else if(res.status === 200){
            setValidUser(true);
            setOrders(res.data);
        }
        })
        .catch(error => {
        setValidUser(false);
        });
    }

    load();
  }, []);

  return (
<Container>
  {
    validUser ? <Nav/> : <Navw/>
  }

  <OrderCards orders={orders} setValidUser={setValidUser}/>

  <Footer/>
</Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;
`;

export default MyOrders