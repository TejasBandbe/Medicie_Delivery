import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import DeliveryNav from '../components/DeliveryNav';
import Footer from '../components/Footer';
import DeliveryCards from '../components/DeliveryCards';

function DeliveryHome() {

useEffect(() => {
}, []);

  return (
<Container>
  <DeliveryNav/>
  <DeliveryCards/>
  <Footer/>
</Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;
`;

export default DeliveryHome
