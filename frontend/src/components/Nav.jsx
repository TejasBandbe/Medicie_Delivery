import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

function Nav() {

  const [showMenus, setShowMenus] = useState(false);

  const history = useHistory();

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
        <input type="search" placeholder='search for medicines'/>
    </div>
    <div className="menu" onClick={() => {setShowMenus(!showMenus)}}>
      <div>
      <i className="fa-solid fa-bars"></i>
      </div>
      <div>Menu</div>
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
  <div className="menu">
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
`;

export default Nav