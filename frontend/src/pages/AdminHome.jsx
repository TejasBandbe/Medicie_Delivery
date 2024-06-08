import React from 'react';
import Footer from '../components/Footer';
import styled from 'styled-components';
import AdminNav from '../components/AdminNav';
import AdminCards from '../components/AdminCards';

function AdminHome() {
  return (
<Container>
  <AdminNav/>
  <AdminCards/>
  <Footer/>
</Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;
`;

export default AdminHome