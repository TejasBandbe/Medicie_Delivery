import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { createurl, log, constants } from '../env';
import axios from 'axios';
import emailjs from '@emailjs/browser';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobno, setMobno] = useState('');
  const [msg, setMsg] = useState('');
  const [validUser, setValidUser] = useState(false);

  const history = useHistory();
  const form = useRef();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    debugger;
var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
const url = createurl('/users/getprofile');

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
        setValidUser(false);
    }else if(res.status === 200){
        setValidUser(true);
        setName(res.data[0].name);
        setEmail(res.data[0].email_id);
        setMobno(res.data[0].mob_no);
    }
    })
    .catch(error => {
        debugger;
        setValidUser(false);
        log(error);
    });
};

  const sendMail = (e) => {
    debugger;
    e.preventDefault();
    if(!validUser){
      toast.error("Please login first.", {autoClose: 2000});
      return;
    }
    
    if(name === '' || email === '' || mobno === '' || msg === ''){
        toast.error("Please fill all the details.", {autoClose: 1500});
        return;
    }

    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(!email.match(emailRegex)){
        toast.success("Invalid email id", {autoClose: 1500});
        return;
    }
    emailjs.sendForm(constants.MAILJS_SERVICE_ID, constants.MAILJS_TEMPLATE_ID, 
        form.current, constants.MAILJS_PUBLIC_KEY)
        .then((result) => {
          debugger;
            log(result.text);
            toast.success("Message sent. We will get back to you!", {autoClose: 2000});
            setTimeout(() => {
              window.location.reload();
            }, 2000);
        }, (error) => {
            debugger;
            log(error.text);
        });
  };

  return (
    <Container>
{
  validUser ? <Nav/> : <Navw/>
}
<div className="contact">

  <div className="header">
    <h1>CONTACT US</h1>
  </div>

  <div className="top-section">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60502.
            96642116415!2d73.6760191160738!3d18.59947612242422!2m3!1f0!2f0!3f0!3m2!
            1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbc048041bef%3A0xd0c9eb5ac3c3dee5!2sHinjawadi
            %2C%20Pune%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1704520224929
            !5m2!1sen!2sin" allowFullScreen="" className="map"
            loading="lazy" referrerPolicy="no-referrer-when-downgrade">
  </iframe>

  <form ref={form} className="get-in-touch">
    <h3>Get In Touch</h3>
    <input type="text" placeholder='your name' value={name} name="from_name"
    onChange={(e) => {setName(e.target.value)}}/>
    <input type="email" name="from_email" placeholder='your email id' value={email}
    onChange={(e) => {setEmail(e.target.value)}}/>
    <input type="tel" name="from_mob" id="" placeholder='your mobile number' value={mobno}
    onChange={(e) => {setMobno(e.target.value)}}/>
    <textarea name="message" id="" cols="30" rows="4" placeholder='write message'
    onChange={(e) => {setMsg(e.target.value)}}></textarea>
    <button className='btn btn-warning' onClick={sendMail}>Send Message</button>
  </form>
  </div>

  <div className="bottom-section">
    <div className="box card">
      <i className="fas fa-phone"></i>
      <h3>Phone Number</h3>
      <a href="tel:9823629901">+91 9999999999</a>
      <a href="tel:9823629901">+91 8888888888</a>
    </div>

    <div className="box card">
      <i className="fas fa-envelope"></i>
      <h3>Email id</h3>
        <a href="mailto:tejasbandbe65@gmail.com">tejasbandbe65@gmail.com</a>
        <a href="mailto:tejasbandbe65@gmail.com">bandbetejas65@gmail.com</a>
    </div>

    <div className="box card">
      <i className="fas fa-map-marker-alt"></i>
      <h3>Office Address</h3>
      <a>Some address some address</a>
      <a>Some address some address</a>
    </div>
  </div>

</div>
<Footer/>
    </Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;

.contact{

  .header{

    h1{
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      margin-block: 1rem;

      @media(max-width: 768px){
        font-size: 2.5rem;
      }
      @media(max-width: 550px){
        font-size: 2rem;
      }
    }
  }

  .top-section{
    padding-inline: 4rem;
    padding-block: 1rem;
    gap: 2rem;
    background-color: #427baa;
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    @media(max-width: 1000px){
        padding-inline: 2rem;
        gap: 1rem;
    }
    @media(max-width: 768px){
        padding-inline: 4rem;
        grid-template-columns: repeat(1, 1fr);
    }
    @media(max-width: 550px){
        padding-inline: 2rem;
    }
    @media(max-width: 450px){
        padding-inline: 1rem;
    }


    .map{
      width: 100%;
      height: 100%;
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.5rem;

      @media(max-width: 768px){
        height: 15rem;
      }
      @media(max-width: 450px){
        height: 12rem;
      }
    }

    .get-in-touch{
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media(max-width: 450px){
        gap: 0.5rem;
      }

      h3{
        text-align: center;
        color: white;
      }

      input{
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        outline: none;
        font-size: 1.2rem;
        font-weight: 600;

        @media(max-width: 1200px){
            font-size: 1rem;
            padding: 0.3rem 0.6rem;
        }
        @media(max-width: 450px){
            font-size: 0.8rem;
        }
      }
      textarea{
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 0.5rem;
        outline: none;
        resize: none;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        font-weight: 600;

        @media(max-width: 1200px){
            font-size: 1rem;
            padding: 0.3rem 0.6rem;
        }
        @media(max-width: 450px){
            font-size: 0.8rem;
        }
      }

      button{
        @media(max-width: 450px){
            font-size: 0.8rem;
            padding: 0.3rem;
        }
      }
    }
  }

  .bottom-section{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-block: 2rem;
    gap: 2rem;
    padding-inline: 4rem;

    @media(max-width: 1000px){
        padding-inline: 2rem;
    }
    @media(max-width: 768px){
        grid-template-columns: repeat(1, 1fr);
        padding-inline: 10rem;
    }
    @media(max-width: 650px){
        padding-inline: 6rem;
    }
    @media(max-width: 550px){
        padding-inline: 4rem;
        gap: 0.5rem;
    }
    @media(max-width: 400px){
        padding-inline: 2rem;
    }

    .box{
        background-color: #427baa;
        padding: 2rem 1rem;
        text-align: center;
        dipslay: flex;
        flex-direction: column;
        align-items: center;

        @media(max-width: 550px){
            padding: 1rem 0.5rem;
        }

        h3{
            @media(max-width: 1000px){
                font-size: 1.3rem;
            }
            @media(max-width: 768px){
                font-size: 2rem;
            }
            @media(max-width: 500px){
                font-size: 1.3rem;
            }
        }

        i{
            height: 3rem;
            width: 4rem;
            line-height: 3rem;
            font-size: 1.5rem;
            background-color: #122b40;
            border-radius: 0.5rem;
            color: white;
            margin-bottom: 1rem;
            transition: all 0.3s;

            @media(max-width: 1000px){
                height: 2.5rem;
                width: 3rem;
                line-height: 2.5rem;
                font-size: 1.2rem;
            }
            @media(max-width: 550px){
                height: 2rem;
                width: 2.5rem;
                line-height: 2rem;
                font-size: 1rem;
                margin: 0;
            }
        }

        a{
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 600;
            text-decoration: none;

            @media(max-width: 900px){
                font-size: 0.8rem;
            }
            @media(max-width: 768px){
                font-size: 1.2rem;
            }
            @media(max-width: 500px){
                font-size: 0.8rem;
            }
        }

        a:hover{
            color: white;
        }
    }

    .box:hover i{
        background-color: rgba(255,255,255,0.6);
        color: #122b40;
    }
  }
}
`;

export default Contact