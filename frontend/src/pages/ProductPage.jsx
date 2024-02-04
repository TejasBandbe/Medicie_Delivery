import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function ProductPage() {
  const [validUser, setValidUser] = useState(false);
  const [prod, setProd] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(0);

  useEffect(() => {
    const load = () => {
      var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
      var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
      var prodId = sessionStorage.getItem("prodId") ? sessionStorage.getItem("prodId") : 0;
      const url = createurl(`/users/getmedbyid/${prodId}`);
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
          log(res.data);
          if(res.status === 400 || res.status === 401){
            setValidUser(false);
          }else if(res.status === 200){
            setValidUser(true);
            setProd(res.data[0]);
            setIsLiked(false);
          }
        })
        .catch(error => {
          setValidUser(false);
        });
    };

    load();
    getLikesById();
  }, []);

  const getLikesById = () => {
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    var prodId = sessionStorage.getItem("prodId") ? sessionStorage.getItem("prodId") : 0;
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
            setIsLiked(true);
            setLikeId(res.data[0].id);
          }else{
            setIsLiked(false);
          }
        }
      })
      .catch(error => {
        log(error);
      });
      };

  const addToCart = (prodId, unitPrice, discount) => {
    debugger;
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
    debugger;
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
      debugger;
      log(error);
    });
  };

  const decide = (prodId) => {
    if(isLiked){
      removeLike();
    }else{
      like(prodId);
    }
  }

  const like = (prodId) => {
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
        if(res.status === 400 || res.status === 401){
          log(res.data);
        }else if(res.status === 200){
          log(res.data);
          if(res.data.message === "Already added to favourites."){
            toast.warning(res.data.message, {autoClose: 2000});
          }else if(res.data.message === "Added to favourites."){
            getLikesById();
            toast.success(res.data.message, {autoClose: 1500});
          }
        }
      })
      .catch(error => {
        log(error);
      });
    };

    const removeLike = () => {
      var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
      var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
      const url = createurl('/users/removelike');
      axios.post(url,
        {
          "userId": userId,
          "likeId": likeId,
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
            if(res.data.message === "Removed from favourites."){
              getLikesById();
              toast.warning(res.data.message, {autoClose: 2000});
            }
          }
        })
        .catch(error => {
          log(error);
        });
      };

const copyUrl = () => {
  const pageUrl = window.location.href;

  navigator.clipboard.writeText(pageUrl)
    .then(() => {
      toast.success("Link copied to clipboard", {autoClose: 1500});
    })
    .catch(() => {
      toast.error("Something went wrong", {autoClose: 1500});
    });
};

  return (
    <Container>
{
    validUser ? <Nav/> : <Navw/>
}

<div className="page">
  <div className="container">

    <div className="image">
        <img src={prod.image} alt="" />
    </div>

    <div className="content">

        <div className="name">
        {prod.name}
        </div>
        <div className="manu">
        by {prod.manufacturer}
        </div>
        <div className="desc">
        {prod.description}
        </div>
        <div className="price">
        <span className='total'>₹ {Math.round((prod.unit_price - (prod.unit_price*prod.discount))*100)/100}</span>
        <div>₹ {Math.round((prod.unit_price)*100)/100}</div>
        <span className='discount'>{Math.round(prod.discount * 100 * 100)/100}% off</span>
        </div>
        <div className="available">
        only {prod.available_qty} available
        </div>
        <div className="bottom">
            <div className="button btn btn-warning" onClick={() => {addToCart(prod.id, prod.unit_price, prod.discount)}}>
            <i className="fa-solid fa-cart-plus"></i>Add to cart
            </div>

            <div className="icons">
            <div className="heart" onClick={() => {decide(prod.id)}}>
              {
                isLiked ? 
                <i className="fa-solid fa-heart" style={{color: "red"}}></i> 
                : 
                <i className="fa-solid fa-heart"></i>
              }
            
            </div>
            <div className="share" onClick={copyUrl}>
            <i className="fa-solid fa-share-nodes"></i>
            </div>
            </div>
        </div>
    </div>
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
  
  .container{
    display: grid;
    grid-template-columns: 40% 60%;
    background-color: white;
    padding: 0;
    height: 30rem;
    background-color: #122b40;
    

    @media(max-width: 1200px){
      height: 25rem;
    }
    @media(max-width: 990px){
      height: 22rem;
    }
    @media(max-width: 580px){
      grid-template-columns: 100%;
      height: auto;
      width: 80%;
    }
    @media(max-width: 400px){
      width: 90%;
    }

    .image{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        background-color: white;
        border-radius: 1rem;
        
        img{
          height: 25rem;
          width: 90%;
          object-fit: contain;

          @media(max-width: 1200px){
            height: 20rem;
          }
          @media(max-width: 990px){
            height: 18rem;
          }
          @media(max-width: 580px){
            height: 12rem;
            padding: 0.5rem;
          }
        }
    }

    .content{
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-inline: 2rem;
      padding-bottom: 1rem;
      gap: 1rem;

      @media(max-width: 768px){
        gap: 0.8rem;
        padding-inline: 1rem;
      }
      @media(max-width: 580px){
        align-items: center;
        gap: 0.5rem;
      }

      .name{
        font-size: 2rem;

        @media(max-width: 1200px){
          font-size: 1.6rem;
        }
        @media(max-width: 990px){
          font-size: 1.3rem;
        }
        @media(max-width: 580px){
          font-size: 1rem;
        }
      }
      .manu{
        font-size: 2rem;

        @media(max-width: 1200px){
          font-size: 1.6rem;
        }
        @media(max-width: 990px){
          font-size: 1.3rem;
        }
        @media(max-width: 580px){
          font-size: 1rem;
        }
      }
      .desc{
        font-size: 1.5rem;

        @media(max-width: 1200px){
          font-size: 1.2rem;
        }
        @media(max-width: 990px){
          font-size: 1rem;
        }
        @media(max-width: 580px){
          font-size: 0.8rem;
          text-align: center;
        }

      }
      .price{
        display: flex;
        align-items: center;
        gap: 3rem;

        @media(max-width: 768px){
          gap: 1.5rem;
        }

        .total{
          font-size: 2rem;
          font-weight: 600;

          @media(max-width: 1200px){
            font-size: 1.6rem;
          }
          @media(max-width: 990px){
            font-size: 1.3rem;
          }
          @media(max-width: 580px){
            font-size: 1rem;
          }
        }
        .discount{
          font-size: 2rem;
          color: yellow;

          @media(max-width: 1200px){
            font-size: 1.6rem;
          }
          @media(max-width: 990px){
            font-size: 1.3rem;
          }
          @media(max-width: 580px){
            font-size: 1rem;
          }
        }
        div{
          font-size: 1.5rem;
          text-decoration: line-through;
          color: rgba(255,255,255,0.7);
          display: flex;

          @media(max-width: 1200px){
            font-size: 1.2rem;
          }
          @media(max-width: 990px){
            font-size: 1rem;
          }
          @media(max-width: 580px){
            font-size: 0.8rem;
          }
        }
      }

      .available{
        color: yellow;
        font-size: 1.2rem;

        @media(max-width: 990px){
          font-size: 1rem;
        }
        @media(max-width: 580px){
          font-size: 0.8rem;
        }
      }

      .bottom{
        display: flex;
        gap: 1rem;
        width: 100%;

        @media(max-width: 580px){
          justify-content: center;
          align-items: center;
        }

        .button{
          width: 30%;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          font-size: 1.2rem;
  
          @media(max-width: 1200px){
            font-size: 1rem;
          }
          @media(max-width: 990px){
            width: 40%;
          }
          @media(max-width: 768px){
            width: 50%;
            gap: 0.5rem;
          }
          @media(max-width: 580px){
            font-size: 0.8rem;
          }
        }

        .icons{
          display: flex;
          gap: 0.5rem;
          
    
          .heart{
            background-color: #ffc107;
            font-size: 1.5rem;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            cursor: pointer;
            padding: 0.5rem;
  
            @media(max-width: 580px){
              font-size: 1.2rem;
              height: 2rem;
              width: 2rem;
            }
    
            .fa-heart{
              color: white;
            }
          }
    
          .share{
            background-color: #ffc107;
            font-size: 1.5rem;
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0.5rem;
            cursor: pointer;
            padding: 0.5rem;
  
            @media(max-width: 580px){
              font-size: 1.2rem;
              height: 2rem;
              width: 2rem;
            }
    
            .fa-share-nodes{
              color: white;
            }
          }
        }
      }
      

    }
  }
}
`;

export default ProductPage