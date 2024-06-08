import React from 'react';
import styled from 'styled-components';
import AdminNav from '../components/AdminNav';
import Footer from '../components/Footer';
import Products from '../components/Products';

function AdminProducts() {
  return (
<Container>
  <AdminNav/>
  <Products/>
  <Footer/>
</Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;
`;

export default AdminProducts