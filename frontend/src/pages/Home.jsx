import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navw from '../components/Navw';
import Corousel from '../components/Corousel';
import Categories from '../components/Categories';
import TopProducts from '../components/TopProducts';
import styled from 'styled-components';
import Nav from '../components/Nav';
import { createurl, log } from '../env';
import axios from 'axios';
import MappedData from '../components/MappedData';

function Home() {

  const [validUser, setValidUser] = useState(false);
  const [homeData, setHomeData] = useState([]);
  // const [showMenus, setShowMenus] = useState(false);

  useEffect(() => {
    const load = () => {
      var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
      var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
      const url = createurl('/users/verifyToken');
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
            log(res.data);
            setValidUser(false);
            // setShowMenus(false);
          }else if(res.status === 200){
            log(res.data);
            setValidUser(true);
            // setShowMenus(false);
          }
        })
        .catch(error => {
          log(error);
          setValidUser(false);
          // setShowMenus(false);
        });
    };

    const getAllMedicines = () => {
      debugger;
      var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
      var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
      const url = createurl('/users/home');
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
          debugger;
          if(res.status === 400 || res.status === 401){
            log(res.data);
            setValidUser(false);
            // setShowMenus(false);
          }else if(res.status === 200){
            setValidUser(true);
            setHomeData(res.data);
            // setShowMenus(false);
          }
        })
        .catch(error => {
          debugger;
          log(error);
          setValidUser(false);
          // setShowMenus(false);
        });
    };

    load();
    getAllMedicines();
  }, []);

  return (<Container>
    {
      validUser ? <Nav homeData={homeData}/> : <Navw/>
    }
    <Corousel/>
    <Categories validUser={validUser}/>
    <TopProducts validUser={validUser}/>
    <MappedData homeData={homeData} validUser={validUser}/>
    <Footer />
    </Container>)
}

const Container = styled.div`
  background-color: #eaf5ff;
`;

export default Home