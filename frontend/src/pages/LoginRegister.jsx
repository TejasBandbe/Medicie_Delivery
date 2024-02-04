import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import { createurl, log, constants } from '../env';
import { useHistory, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Login from '../components/Login';
import './LoginRegister.css';
import Register from '../components/Register';
import maintenance from '../images/maintenance.png';

function LoginRegister() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [fmail, setFmail] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [live, setLive] = useState(true);

  const history = useHistory();

  const flip = () => {
    setIsFlipped(!isFlipped);
  };

  const emailValidation = () => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(fmail.match(emailRegex)){
      return true;
    }
    toast.error("Invalid email id", {autoClose:2000});
  };

  const sendMail = () => {
    debugger;
    if(emailValidation()){
      const url = createurl('/users/forgetPass');
      axios.post(url,{
        "email": fmail
      })
      .then(res => {
        debugger;
        log(res.data);
        if(res.data.error === "user not found. please check your email id."){
          toast.error("user not found. please check your email id.", {autoClose:1500});
        }
        else if(res.data.message === "password sent via email"){
          toast.success("Password sent via email. Please check your inbox.", {autoClose: 3000});
        }
      })
      .catch(error => {
        log(error);
        toast.error("server is under maintenance", {autoClose: 1500});
        setLive(false);
      });
    }
  };

  const adminLogin = () => {
    if(email === '' || pass === ''){
      toast.error("Please fill email id and password", {autoClose: 1500});
    }else{
      const url = createurl('/admin/login');
      axios.post(url,
        {
          "email": email,
          "password": pass,
        })
        .then(res => {
          debugger;
          if(res.data.error === 'user not found. please check your email id.'){
            toast.error("user not found. please check your email id.", {autoClose: 2500});
          }else if(res.data.error === 'entered password is wrong'){
            toast.error("entered password is wrong", {autoClose: 1500});
          }
          else{
            var id = res.data.user_id;
            var token = res.data.token;
            sessionStorage.setItem("user_id", id);
            sessionStorage.setItem("token", token);
            history.push('/admin');
          }
        })
        .catch(error => {
          debugger;
          log(error);
          toast.error("server is under maintenance", {autoClose: 1500});
          setLive(false);
        });
    }
  };

  const home = () => {
    history.push('/');
  };

  return (
<>
{/* ================================================== */}
<div className="modal fade" id="forgetPassModal" tabIndex="-1" aria-labelledby="forgetPassModalLabel" aria-hidden="true">
<div className="modal-dialog">
<div className="modal-content">
    <div className="modal-header">
        <h1 className="modal-title fs-5" id="forgetPassModalLabel">Forgot Password?</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">
        <input type="text" placeholder="enter your email id"
              required onChange={(e) => {setFmail(e.target.value)}}/>
    </div>
    <div className="modal-footer">
        <button type="button" className="btn btn-warning" 
        data-bs-toggle="modal" data-bs-target="#forgetPassModal" onClick={sendMail}>Sumbit</button>
    </div>
</div>
</div>
</div>
{/* ================================================== */}
<div className="modal fade" id="adminModal" tabIndex="-1" aria-labelledby="adminModalLabel" aria-hidden="true">
<div className="modal-dialog">
<div className="modal-content">
    <div className="modal-header">
        <h1 className="modal-title fs-5" id="adminModalLabel">Enter admin password</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div className="modal-body">
        <input type="email" placeholder="admin email id" required 
              onChange={(e) => {setEmail(e.target.value)}}/>
        <input type="password" placeholder="admin password"
             required onChange={(e) => {setPass(e.target.value)}}/>
    </div>
    <div className="modal-footer">
        <button type="button" className="btn btn-success" 
        data-bs-toggle="modal" data-bs-target="#adminModal" onClick={adminLogin}>Login</button>
    </div>
</div>
</div>
</div>
{/* ================================================== */}

  <div className="row logreg">
    <div className="col-xl-4 col-md-3 col-sm-2 col-0">
      <div className="home" onClick={home}>
        <i className="fa fa-home"></i>
      </div>
    </div>
    <div className="col-xl-4 col-md-6 col-sm-8 col-12 main-box">
      <div className="card">
        {
          live === false ? 
          <div className='server-error'>
            <img className='maintenance' src={maintenance} alt="" />
            <h3>Server is under maintenance<br/>Please try again later</h3>
          </div> : 
          <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>

          <Login setLive={setLive} flip={flip}/>

          <Register setLive={setLive} flip={flip}
          isFlipped={isFlipped} setIsFlipped={setIsFlipped}/>

          </ReactCardFlip>
        }
        
      </div>
    </div>
    <div className="col-xl-4 col-md-3 col-sm-2 col-0"></div>
  </div>
</>
  )
}

export default LoginRegister