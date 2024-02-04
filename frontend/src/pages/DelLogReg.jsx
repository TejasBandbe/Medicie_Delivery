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
import DelLogin from '../components/DelLogin';
import DelReg from '../components/DelReg';

function DelLogReg() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [fmail, setFmail] = useState('');
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
      const url = createurl('/forgetPass');
      axios.post(url,{
        "email": fmail
      })
      .then(res => {
        debugger;
        log(res.data);
        if(res.data.message === "email id not present"){
          toast.error("this email id is not registered", {autoClose:1500, theme:'colored'});
        }
        else if(res.data.message === "password sent via email"){
          toast.success("Password sent via email. Please check your inbox.", {autoClose: 3000, theme:'colored'});
        }
      })
      .catch(error => {
        log(error);
        toast.error("server is under maintenance", {autoClose: 1500, theme:'colored'});
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

  <div className="row logreg">
    <div className="col-xl-4 col-md-3 col-0">
      <div class="home" onClick={home}>
          <i class="fa fa-home"></i>
      </div>
    </div>
    <div className="col-xl-4 col-md-6 col-12 main-box">
      <div className="card">
        {
          live === false ? 
          <div className='server-error'>
            <img className='maintenance' src={maintenance} alt="" />
            <h3>Server is under maintenance<br/>Please try again later</h3>
          </div> : 
          <ReactCardFlip flipDirection='horizontal' isFlipped={isFlipped}>

          <DelLogin setLive={setLive} flip={flip}/>

          <DelReg setLive={setLive} flip={flip}
          isFlipped={isFlipped} setIsFlipped={setIsFlipped}/>

          </ReactCardFlip>
        }
        
      </div>
    </div>
    <div className="col-xl-4 col-md-3 col-0"></div>
  </div>
</>
  )
}

export default DelLogReg