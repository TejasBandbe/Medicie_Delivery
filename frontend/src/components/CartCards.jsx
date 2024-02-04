import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

function CartCards({ validUser, setValidUser }) {
  const [cart, setCart] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [saved, setSaved] = useState(0);
  const [amt, setAmt] = useState(0);

  const history = useHistory();

  useEffect(() => {

  }, [cart]);

  useEffect(() => {
    const load = async() => {
      var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
      var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
      const url = createurl('/users/getcart');
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
            setCart(res.data);

            var sum = 0;
            var saving = 0;
            for(var i=0; i<res.data.length; i++){
              sum += res.data[i].total;
              saving += (res.data[i].unit_price * res.data[i].quantity);
            }
            setTotalAmt(sum);
            setAmt(saving);
            setSaved(saving - sum);
          }
        })
        .catch(error => {
          setValidUser(false);
        });
    };

    load();
    
  }, []);

  const increase = (i, q) => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/cart/increase');
    axios.post(url,
      {
        "userId": userId,
        "cartId": i,
        "quantity": q,
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          setValidUser(false);
        }else if(res.status === 200){
          log(res.data);
          setValidUser(true);
          if(res.data.message === "Reached maximum quantity.")
          {
            toast.error("Reached to maximum available quantity", {autoClose: 2000});
            return;
          }
          setCart(res.data);

          var sum = 0;
            var saving = 0;
            for(var i=0; i<res.data.length; i++){
              sum += res.data[i].total;
              saving += (res.data[i].unit_price * res.data[i].quantity);
            }
            setTotalAmt(sum);
            setAmt(saving);
            setSaved(saving - sum);
        }
      })
      .catch(error => {
        debugger;
        setValidUser(false);
      });
  };

  const decrease = (i, q) => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/cart/decrease');
    axios.post(url,
      {
        "userId": userId,
        "cartId": i,
        "quantity": q,
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          setValidUser(false);
        }else if(res.status === 200){
          log(res.data);
          setValidUser(true);
          if(res.data.message === "Reached minimum quantity.")
          {
            toast.error("Cannot reduce further. If you want to remove this item from cart, Click on trash icon.", {autoClose: 3000});
            return;
          }
          setCart(res.data);

          var sum = 0;
            var saving = 0;
            for(var i=0; i<res.data.length; i++){
              sum += res.data[i].total;
              saving += (res.data[i].unit_price * res.data[i].quantity);
            }
            setTotalAmt(sum);
            setAmt(saving);
            setSaved(saving - sum);
        }
      })
      .catch(error => {
        debugger;
        setValidUser(false);
      });
  }; 

  const remove = (i) => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/cart/remove');
    axios.post(url,
      {
        "userId": userId,
        "cartId": i,
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          setValidUser(false);
        }else if(res.status === 200){
          if(res.data.error === "Something went wrong"){
            toast.error(res.data.error, {autoClose: 1500});
            return;
          }
          log(res.data);
          setValidUser(true);
          setCart(res.data);

          var sum = 0;
            var saving = 0;
            for(var i=0; i<res.data.length; i++){
              sum += res.data[i].total;
              saving += (res.data[i].unit_price * res.data[i].quantity);
            }
            setTotalAmt(sum);
            setAmt(saving);
            setSaved(saving - sum);
        }
      })
      .catch(error => {
        debugger;
        setValidUser(false);
      });
  }; 

  const open = (id) => {
    if(validUser){
      sessionStorage.setItem('prodId', id);
      history.push('/product');
    }else{
      toast.error("Please login first.", {autoClose: 2000});
    }
  };

  const goToOSummary = () => {
    history.push('/ordersummary');
  };

  return (
    <Container>
<div className="page">
  <div className="header">
    <div className="count">Total items: {cart.length}</div>
    <div className="tot">Total amount: ₹ {Math.round(totalAmt * 100) / 100}</div>
    <div className="saved">Saved ₹ {Math.round(saved * 100) / 100}</div>
  </div>

  {
    (cart.length === 0) ? 
    <div className='empty'>
      <div className="emp card">
      <h4>Cart is empty</h4>
      </div>
    </div> 
    : 
    <></>
  }

  <div className="cards">
    {
      cart.map((item, index) => (
        <div className="card" key={index}>
          
        <div className="image">
          <img src={item.image} alt="" />
        </div>
        <div className="content">
        <i className="fas fa-trash" onClick={() => {remove(item.cartId)}}></i>
            <div className="name" onClick={() => {open(item.prodId)}}>
            {item.name} by {item.manufacturer}
            </div>
            <div className="desc">
            {item.description}
            </div>
            <div className="price">
            <span className='total'>₹ {Math.round((item.unit_price*(1-item.discount)) * 100) / 100}</span>
            <div>₹ {Math.round(item.unit_price * 100) / 100}</div>
            <span className='discount'>{Math.round(item.discount * 100 * 100) / 100}% off</span>
            </div>
            <div className="bottom">
              <div className="subtotal">
              Subtotal: ₹ {Math.round(item.total * 100) / 100}
              </div>
              <div className="q">
              <i className="fa-solid fa-square-minus" onClick={() => {decrease(item.cartId, item.quantity)}}></i>
              {item.quantity}
              <i className="fa-solid fa-square-plus" onClick={() => {increase(item.cartId, item.quantity)}}></i>
              </div>
            
            </div>
        </div>
    </div>
      ))
    }
    
  </div>

  {
    (cart.length === 0) ? <></> :
    <div className="summary">
    {
      <div className='box'>
        <div className='column'>
        <span className='one'>₹ {Math.round(amt * 100) / 100}</span>
        <span className='two'>₹ {Math.round(totalAmt * 100) / 100}</span>
        </div>
        <button className='btn btn-warning' onClick={goToOSummary}>Place order</button>
      </div>
    }
  </div>
  }
</div>
    </Container>
  )
}

const Container = styled.div`

.page{
margin-bottom: 1rem;
min-height: 60vh;

  .empty{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;

    .emp{
      background-color: #427baa;
      width: 50%;
      height: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;

      @media(max-width: 550px){
        width: 70%;
      }

      h4{
      font-size: 3rem;

      @media(max-width: 768px){
        font-size: 2rem;
      }
      @media(max-width: 550px){
        font-size: 1.5rem;
      }
      }
    }
  }

  .header{
    background-color: #427baa;
    color: white;
    display: flex;
    justify-content: space-around;
    font-size: 1.5rem;

    @media(max-width: 1000px){
      font-size: 1.2rem;
    }
    @media(max-width: 768px){
      font-size: 1rem;
    }
    @media(max-width: 500px){
      font-size: 0.8rem;
    }
  }

  .cards{
    margin: 1rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media(max-width: 768px){
      grid-template-columns: repeat(1, 1fr);
    }
    @media(max-width: 500px){
      margin: 0.5rem;
      gap: 0.5rem;
    }

    .card{
      background-color: #427baa;
      display: grid;
      grid-template-columns: 30% 70%;
      padding: 0.5rem;
      height: auto;

      .image{
        background-color: white;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;

        img{
          width: 100%;
          height: 10rem;
          border-radius: 0.5rem;
          object-fit: contain;

          @media(max-width: 1000px){
            height: 6rem;
          }
          @media(max-width: 500px){
            height: 5rem;
          }
        }
      }

      .content{
        padding: 0.5rem 0.5rem 0.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        @media(max-width: 1000px){
          gap: 0.2rem;
          padding: 0 0.5rem 0.5rem 1rem;
        }
        @media(max-width: 500px){
          gap: 0;
        }

        .fas{
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;

          @media(max-width: 1000px){
            font-size: 1rem;
          }
          @media(max-width: 500px){
            font-size: 0.9rem;
            top: 0.6rem;
            right: 0.6rem;
          }
        }

        .fas:hover{
          color: #122b40;
        }

        .name{
          font-size: 1.5rem;
          padding-right: 1rem;
          cursor: pointer;

          @media(max-width: 1200px){
            font-size: 1.2rem;
          }
          @media(max-width: 1000px){
            font-size: 1rem;
          }
          @media(max-width: 500px){
            font-size: 0.8rem;
          }
        }

        .name:hover{
          text-decoration: underline;
        }

        .desc{
          font-size: 1.2rem;

          @media(max-width: 1200px){
            font-size: 1rem;
          }
          @media(max-width: 1000px){
            font-size: 0.8rem;
          }
          @media(max-width: 500px){
            font-size: 0.7rem;
          }
        }

        .price{
          display: flex;
          align-items: center;
          gap: 2rem;

          .total{
            font-size: 1.5rem;
            font-weight: 600;

            @media(max-width: 1200px){
              font-size: 1.2rem;
            }
            @media(max-width: 1000px){
              font-size: 1rem;
            }
            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }

          div{
            font-size: 1.2rem;
            text-decoration: line-through;
            color: rgba(255,255,255,0.7);
            display: flex;

            @media(max-width: 1200px){
              font-size: 1rem;
            }
            @media(max-width: 1000px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.7rem;
            }
          }

          .discount{
            font-size: 1.5rem;
            color: yellow;

            @media(max-width: 1200px){
              font-size: 1.2rem;
            }
            @media(max-width: 1000px){
              font-size: 1rem;
            }
            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }
        }

        .bottom{
          display: flex;
          align-items: center;
          gap: 4rem;
          font-size: 1.5rem;

          @media(max-width: 1200px){
            font-size: 1.2rem;
          }
          @media(max-width: 1000px){
            font-size: 1rem;
            gap: 2rem;
          }
          @media(max-width: 500px){
            font-size: 0.8rem;
          }

          .subtotal{
            font-weight: 600;
            color: yellow;
          }

          .q{
            display: flex;
            align-items: center;
            gap: 0.5rem;

            @media(max-width: 500px){
              gap: 0.3rem;
            }

            i{
              cursor: pointer;
            }
          }
          

        }
      }
    }
  }

  .summary{
    display: flex;
    justify-content: center;
    align-items: center;

    .box{
      display: flex;
      gap: 3rem;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #122b40;

      @media(max-width: 500px){
        gap: 1.5rem;
      }

      .column{
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;

        .one{
          font-size: 0.8rem;
          text-decoration: line-through;

          @media(max-width: 768px){
            font-size: 0.6rem;
          }
        }

        .two{
          font-size: 1.5rem;
          font-weight: 700;

          @media(max-width: 1000px){
            font-size: 1.2rem;
          }
          @media(max-width: 768px){
            font-size: 1rem;
          }
        }
      }

      button{
          transition: all 0.2s;

          @media(max-width: 768px){
            font-size: 0.8rem;
            padding: 0.2rem 0.5rem;
            font-weight: 600;
          }
      }

      button:hover{
        transform: scale(0.9);
      }
    }
  }
}
`;

export default CartCards