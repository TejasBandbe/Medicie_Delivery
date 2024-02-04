import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import Footer from '../components/Footer';
import { createurl, log } from '../env';
import axios from 'axios';
import CartCards from '../components/CartCards';

function Cart() {
  
  const [validUser, setValidUser] = useState(false);

  
  const history = useHistory();
  return (
    <Container>
{
  validUser ? <Nav/> : <Navw/>
}
<CartCards validUser={validUser} setValidUser={setValidUser}/>
<Footer/>
    </Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;
`;

export default Cart