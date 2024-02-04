import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

function Navw() {

  const history = useHistory();

  const goToLogin = () => {
    history.push('/login');
  };

  const goToHome = () => {
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
    <div className="login" onClick={goToLogin}>
      <div>
      <i className="fa-regular fa-user"></i>
      </div>
      <div>Login</div>
    </div>
</div>

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

    


    .login{
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

    .login:hover{
      color: white;
      background-color: #122b40;
    }
  }

`;

export default Navw