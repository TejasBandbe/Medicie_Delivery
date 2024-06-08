import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

function DeliveryNav() {

const history = useHistory();

const goToHome = () => {
    history.push('/delivery');
};

const logout = () => {
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('cat');
    history.push('/');
    window.location.reload();
};
    
const goToProducts = () => {
    history.push('/products');
};

  return (
<Container>
<div className="nav">
    <div className="logo" onClick={goToHome}>
      <i className="fa-solid fa-house"></i>
      PillPulse
    </div>

    <div className="menus">
        <div className="menu" onClick={goToProducts}>
        <i className="fa-solid fa-pills"></i>
        <span>Products</span>
        </div>

        <div className="menu" onClick={logout}>
        <i className="fa-solid fa-power-off"></i>
        <span>Logout</span>
        </div>

        <div className="menu" onClick={logout}>
        <i className="fa-solid fa-power-off"></i>
        <span>Logout</span>
        </div>

        <div className="menu" onClick={logout}>
        <i className="fa-solid fa-power-off"></i>
        <span>Logout</span>
        </div>
    </div>

</div>
</Container>
  )
}

const Container = styled.div`
.nav{
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 5rem;
    align-items: center;
    box-shadow: 0rem 0rem 1rem #000;
  
    @media (max-width: 600px){
      flex-direction: column;
    }

    @media(max-width: 900px){
        padding: 0.5rem 2rem;
    }
    @media(max-width: 500px){
        padding: 0.5rem 0.5rem;
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

    .menus{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        justify-content: center;

        @media(max-width: 900px){
            gap: 1rem;
        }
        @media(max-width: 768px){
            gap: 0.5rem;
        }

        .menu{
            color: #122b40;
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
            border: 0.1rem solid #122b40;
      
            @media (max-width: 1000px){
              font-size: 0.8rem;
            }
            @media (max-width: 768px){
                font-size: 0.7rem;
              }
            @media (max-width: 400px){
              font-size: 0.6rem;
              padding: 0.1rem 0.5rem;
              border-radius: 0.3rem;
            }
          }
      
          .menu:hover{
            background-color: #122b40;
            color: #fff;
          }
    }
  
}
`;

export default DeliveryNav
