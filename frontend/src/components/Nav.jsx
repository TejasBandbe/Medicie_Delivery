import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { createurl, log, constants } from '../env';
import axios from 'axios';

function Nav() {
  const [homeData, setHomeData] = useState([]);
  const [showMenus, setShowMenus] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const history = useHistory();

  useEffect(() => {
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
            // setShowMenus(false);
          }else if(res.status === 200){
            setHomeData(res.data);
            // setShowMenus(false);
          }
        })
        .catch(error => {
          debugger;
          log(error);
          // setShowMenus(false);
        });
    };

    getAllMedicines();
  }, []);

  const goToHome = () => {
    history.push('/');
  };

  const goToProfile = () => {
    history.push('/profile');
  };

  const goToAbout = () => {
    history.push('/about');
  };

  const goToContact = () => {
    history.push('/contact');
  };

  const goToCart = () => {
    history.push('/cart');
  };

  const logout = () => {
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('cat');
    history.push('/');
    window.location.reload();
  };

  const goToMyOrders = () => {
    history.push('/myorders');
  };

  const fetchData = (value) => {
    const results = homeData.filter((medicine) => {
      return value && medicine && medicine.name && medicine.name.toLowerCase().includes(value);
    });
    setResults(results);
    console.log(results);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const open = (id) => {
    sessionStorage.setItem('prodId', id);
      history.push('/product');

      setTimeout(() => {
        window.location.reload();
      },500);
  };

  return (
    <Container>
    
<div className="nav">
    <div className="logo" onClick={goToHome}>
      <i className="fa-solid fa-house"></i>
      PillPulse
    </div>
    <div className="search">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type="search" placeholder='search for medicines' 
        value={input} onChange={(e) => {handleChange(e.target.value)}}/>
    </div>
    <div className="menu" onClick={() => {setShowMenus(!showMenus)}}>
      <div>
      <i className="fa-solid fa-bars"></i>
      </div>
      <div>Menu</div>
    </div>
</div>

<div className='search-result-container'>
  <div className="search-result" id="search-result">
{
  results.map((medicine) => (
    <div className="result" key={medicine.id} onClick={() => {open(medicine.id)}}>
      {medicine.name}
    </div>
  ))
}
  </div>
</div>

{
  !showMenus ? <></> :
  <div className="menus">
  <div className="items">
  <div className="menu" onClick={goToCart}>
    <i className="fa-solid fa-cart-shopping"></i>
    <span>My Cart</span>
  </div>
  <div className="menu" onClick={goToMyOrders}>
    <i className="fa-solid fa-bag-shopping"></i>
    <span>My Orders</span>
  </div>
  <div className="menu" onClick={goToProfile}>
    <i className="fa-solid fa-user"></i>
    <span>Profile</span>
  </div>
  <div className="menu" onClick={goToAbout}>
    <span>About Us</span>
  </div>
  <div className="menu" onClick={goToContact}>
    <span>Contact Us</span>
  </div>
  <div className="menu" onClick={logout}>
    <i className="fa-solid fa-power-off"></i>
    <span>Logout</span>
  </div>
  </div>
</div>
}

    </Container>
  )
}

const Container = styled.div`
.nav{
  display: flex;
  justify-content: space-around;
  padding: 1rem 0;
  align-items: center;

  @media (max-width: 500px){
    flex-direction: column;
  }

  .logo{
    padding: 0 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    font-size: 2rem;
    font-family: cursive;
    font-weight: 700;
    color: #122b40;

    @media (max-width: 1000px){
      font-size: 1.5rem;
    }
    @media (max-width: 768px){
      font-size: 1.2rem;
    }
    @media (max-width: 500px){
      font-size: 1rem;
      position: absolute;
      left: 2rem;
      top: 0.5rem;
      gap: 0.3rem;
    }

    i{
      font-size: 1.5rem;

      @media (max-width: 1000px){
        font-size: 1.2rem;
      }
      @media (max-width: 768px){
        font-size: 1rem;
      }
      @media (max-width: 500px){
        font-size: 0.8rem;
      }
    }
  }

  .logo:hover{
    background-color: #122b40;
    color: white;
  }

  .search{
    background-color: #fff;
    width: 30%;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 1.2rem;

    @media (max-width: 1000px){
      font-size: 1rem;
      padding: 0.3rem 0.5rem;
      width: 50%;
      gap: 0.5rem;
    }
    @media (max-width: 500px){
      width: 80%;
      margin-top: 1.5rem;
      font-size: 0.8rem;
    }

    i{
      color: rgba(0,0,0,0.7);
    }

    input{
      width: 100%;
      outline: none;
      border: none;
      background: transparent;
    }
  }

  


  .menu{
    display: flex;
    background-color: #fff;
    border: 0.1rem double #000;
    padding: 0.5rem 1rem;
    gap: 1rem;
    font-size: 1.2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;

    @media (max-width: 1000px){
      font-size: 1rem;
      padding: 0.3rem 1rem;
    }
    @media (max-width: 768px){
      font-size: 1rem;
      padding: 0.3rem 0.5rem;
      gap: 0.5rem;
    }
    @media (max-width: 500px){
      position: absolute;
      top: 0.5rem;
      right: 2rem;
      font-size: 0.8rem;
      padding: 0.1rem 0.5rem;
    }
  }

  .menu:hover{
    color: white;
    background-color: #122b40;
  }
}

.menus{
  display: flex;
  justify-content: center;
  background-color: #122b40;
  padding: 0.5rem 0;

  @media(max-width: 400px){
    padding: 0.2rem 0;
  }

  .items{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    width: 80%;
    justify-content: space-around;

    @media (max-width: 900px){
      width: 90%;
    }
    @media (max-width: 900px){
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 400px){
      width: 100%;
    }

    .menu{
      color: #fff;
      font-weight: 700;
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      align-items: center;
      cursor: pointer;
      transition: 0.2s ease;

      @media (max-width: 1000px){
        font-size: 0.8rem;
      }
      @media (max-width: 400px){
        font-size: 0.7rem;
        padding: 0.1rem 0.5rem;
      }
    }

    .menu:hover{
      background-color: #265073;
    }
  }
}

.search-result-container{
  display: flex;
  justify-content: center;
  z-index: 10;
  position: absolute;
  width: 100%;
  left: 2%;

  .search-result{
    max-height: 10rem;
    background-color: white;
    width: 30%;
    overflow-y: auto;
    box-shadow: 0rem 0rem 1rem #000;

    .result{
      cursor: pointer;
      padding-left: 1.5rem;
    }

    .result:hover{
      background-color: rgba(200,200,200,0.9);
    }
  }

  
}
`;

export default Nav