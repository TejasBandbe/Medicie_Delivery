import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

function Cat() {
  const [data, setData] = useState([]);
  const [validUser, setValidUser] = useState(false);
  const [likes, setLikes] = useState([]);
  var cat = sessionStorage.getItem("cat");

  const history = useHistory();

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
          }else if(res.status === 200){
            log(res.data);
            setValidUser(true);
          }
        })
        .catch(error => {
          log(error);
          setValidUser(false);
        });
    };

const getMedicines = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/getmedbycat');
    axios.post(url,
      {
        "userId": userId,
        "category": cat,
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        if(res.status === 400 || res.status === 401){
          log(res.data);
        }else if(res.status === 200){
          log(res.data);
          setData(res.data);
        }
      })
      .catch(error => {
        debugger;
        log(error);
      });
  };

load();
getMedicines();
getLikes();
}, []);


const getLikes = () => {
  var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
  var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
  const url = createurl('/users/getlikes');
  axios.post(url,
    {
      "userId": userId
    },
    {
      headers: {
          'authorization': `Bearer ${jwtToken}`
      }
    })
    .then(res => {
      if(res.status === 400 || res.status === 401){
        log(res.data);
      }else if(res.status === 200){
        log(res.data);
        setLikes(res.data);
      }
    })
    .catch(error => {
      log(error);
    });
    };

const addToCart = (prodId, unitPrice, discount) => {
  var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
  var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
  const url = createurl('/users/addtocart');
  axios.post(url,
    {
      "userId": userId, 
      prodId, unitPrice, discount
    },
    {
      headers: {
          'authorization': `Bearer ${jwtToken}`
      }
    })
    .then(res => {
      if(res.status === 400 || res.status === 401){
        log(res.data);
      }else if(res.status === 200){
        log(res.data);
        if(res.data.error === "Item already present in cart."){
          toast.error(res.data.error, {autoClose: 2000});
          return;
        }
        if(res.data.affectedRows === 1){
          toast.success("Added to cart", {autoClose: 2000});
        }else{
          toast.error("Something went wrong", {autoClose: 1500});
        }
      }
    })
    .catch(error => {
      log(error);
    });
  };

  const decide = (prodId) => {
    debugger;
var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
const url = createurl('/users/getlikesbyid');
axios.post(url,
  {
    "userId": userId,
    "prodId": prodId,
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
    }else if(res.status === 200){
      log(res.data);
      if(res.data.length === 1){
        removeLike(prodId);
      }else{
        like(prodId);
      }
    }
  })
  .catch(error => {
    log(error);
  });
  }

  const like = (prodId) => {
    debugger;
  var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
  var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
  const url = createurl('/users/addlike');
  axios.post(url,
    {
      "userId": userId,
      "prodId": prodId,
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
      }else if(res.status === 200){
        log(res.data);
        if(res.data.message === "Already added to favourites."){
          toast.warning(res.data.message, {autoClose: 2000});
        }else if(res.data.message === "Added to favourites."){
          getLikes();
          // toast.success(res.data.message, {autoClose: 1500});
        }
      }
    })
    .catch(error => {
      log(error);
    });
  };

  const removeLike = (prodId) => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/removethislike');
    axios.post(url,
      {
        "userId": userId,
        "prodId": prodId,
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
        }else if(res.status === 200){
          log(res.data);
          if(res.data.message === "Removed from favourites."){
            getLikes();
            // toast.warning(res.data.message, {autoClose: 2000});
          }
        }
      })
      .catch(error => {
        log(error);
      });
    };

  const isLiked = (medId) => {
    debugger;
    for(var i=0; i<likes.length; i++){
      debugger;
      if(likes[i].medicine_id === medId){
        return true;
      }
    }
    return false;   
  };

  const open = (id) => {
    if(validUser){
      sessionStorage.setItem('prodId', id);
      history.push('/product');
    }else{
      toast.error("Please login first.", {autoClose: 2000});
    }
  };

  return (
    <Container>
{
  validUser ? <Nav/> : <Navw/>
}

<div className="page">
  <div className="header">
    <h1>{cat}</h1>
  </div>
  <div className="cards">
{
    data.map((item) => (
        <div className="card" key={item.id}>
          <div className="image">
          <div className="heart" onClick={() => {decide(item.id)}}>
            {
              isLiked(item.id) ? 
              <i className="fa-solid fa-heart" style={{color: "red"}}></i> 
              : 
              <i className="fa-solid fa-heart"></i>
            }
          </div>
          <img src={item.image} alt="" onClick={() => {open(item.id)}}/>
          </div>
          <div className="content">
          <h6 className='name' onClick={() => {open(item.id)}}>{item.name}</h6>
          <h6>{item.manufacturer}</h6>
          <p>₹ {item.unit_price}/-</p>
          <button className='btn btn-dark'
          onClick={() => {addToCart(item.id, item.unit_price, item.discount)}}
          >Add to cart</button>
          </div>
        </div>
              ))
}
  </div>
</div>

<Footer/>
    </Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;

.page{
  background-color: #427baa;
  padding-block: 1rem;

  @media(max-width: 500px){
    padding-block: 0.5rem;
  }

  .header{

    h1{
      text-align: center;
      text-transform: uppercase;
      font-weight: 700;

      @media(max-width: 768px){
        font-size: 2rem;
      }
      @media(max-width: 500px){
        font-size: 1.5rem;
      }
    }
  }

  .cards{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    margin: 1rem 1rem 0 1rem;

    @media (max-width: 1300px){
      grid-template-columns: repeat(5, 1fr);
    }
    @media (max-width: 900px){
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 550px){
      grid-template-columns: repeat(3, 1fr);
      margin: 0.5rem;
      gap: 0.5rem;
    }

    .card{
      color: #000;
      background-color: #e2ae2b;

      .image{
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        z-index: 0;

        @media(max-width: 768px){
          margin-bottom: 0.5rem;
        }

        img{
          border-radius: 0.5rem;
          width: 100%;
          height: 16rem;
          object-fit: contain;
          cursor: pointer;

          @media(max-width: 1500px){
            height: 12rem;
          }
          @media(max-width: 1300px){
            height: 10rem;
          }
          @media(max-width: 768px){
            height: 6rem;
          }
          @media(max-width: 500px){
            height: 5rem;
          }
          @media(max-width: 450px){
            height: 3rem;
          }
        }

        .heart{
          background-color: #e2ae2b;
          position: absolute;
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;

          @media(max-width: 1300px){
            padding: 0.3rem 0.4rem;
          }
          @media(max-width: 768px){
            padding: 0rem 0.3rem;
            height: 1.3rem;
          }
          @media(max-width: 500px){
            padding: 0;
            width: 1rem;
            height: 1rem;
            border-radius: 0.3rem;
          }

          .fa-heart{
            font-size: 1.2rem;
            color: white;

            @media(max-width: 1300px){
              font-size: 1rem;
            }
            @media(max-width: 768px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.5rem;
            }
          }
        }
      }

      .content{
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        @media(max-width: 768px){
          padding: 0.2rem 0;
        }

        .name{
          cursor: pointer;
        }

        .name:hover{
          color: white;
          text-decoration: underline;
        }

        h6{
          line-height: 1;
          font-size: 1.2rem;
          text-align: center;

          @media (max-width: 1300px){
            font-size: 1rem;
            line-height: 0.8;
          }
          @media(max-width: 768px){
            font-size: 0.8rem;
          }
          @media(max-width: 450px){
            font-size: 0.6rem;
            line-height: 0.6;
          }
        }
        p{
          line-height: 1;
          text-align: center;

          @media (max-width: 1300px){
            line-height: 0.8;
          }
          @media(max-width: 768px){
            font-size: 0.8rem;
          }
          @media(max-width: 450px){
            font-size: 0.6rem;
            line-height: 0.8;
          }
        }

        button{

          @media(max-width: 768px){
            font-size: 0.7rem;
            margin-top: -0.5rem;
            padding: 0.2rem 1rem;
          }
          @media(max-width: 450px){
            padding: 0.2rem 0.3rem;
          }
        }
      }
      
    }
  }
}
`;

export default Cat