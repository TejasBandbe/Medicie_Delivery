import React, { useState, useEffect } from 'react';
import { createurl, log, constants } from '../env';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './Register.css';

function DelReg({ setLive, flip, isFlipped, setIsFlipped }) {
  const [rname, setRName] = useState('');
  const [remail, setREmail] = useState('');
  const [rpassword, setRPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [mobno, setMobNo] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const showPassword2 = () => {
    var pass2 = document.getElementById('pass2');
    var eye3 = document.getElementById('eye3');
    var eye4 = document.getElementById('eye4');

    if(pass2.type === 'password'){
      pass2.type = 'text';
      eye4.style.display = 'block';
      eye3.style.display = 'none';
    }
    else{
      pass2.type = 'password';
      eye4.style.display = 'none';
      eye3.style.display = 'block';
    }
  };

  const showPassword3 = () => {
    var rePass = document.getElementById('re-pass');
    var eye5 = document.getElementById('eye5');
    var eye6 = document.getElementById('eye6');

    if(rePass.type === 'password'){
      rePass.type = 'text';
      eye6.style.display = 'block';
      eye5.style.display = 'none';
    }
    else{
      rePass.type = 'password';
      eye6.style.display = 'none';
      eye5.style.display = 'block';
    }
  };

  const reqFieldsValidation = () => {
    if(rname === '' || remail === '' || rpassword === '' || repassword === '' ||
    mobno === '' || address === '' || pincode === ''){
      toast.error("Please fill all the required fields", {autoClose:1500});
    }
    else{
      return true;
    }
  };

  const emailValidation = () => {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(remail.match(emailRegex)){
      return true;
    }
    toast.error("Invalid email id", {autoClose:2000});
  };

  const passwordValidation = () => {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var symbols = /[^A-Za-z 0-9]/g;
    if(!rpassword.match(lowerCaseLetters)){
      toast.error("Password should contain atleast one lowercase alphabet", {autoClose: 2000});
    }
    else if(!rpassword.match(upperCaseLetters)){
      toast.error("Password should contain atleast one uppercase alphabet", {autoClose: 2000});
    }
    else if(!rpassword.match(numbers)){
      toast.error("Password should contain atleast one number", {autoClose: 2000});
    }
    else if(!rpassword.match(symbols)){
      toast.error("Password should contain atleast one special character", {autoClose: 2000});
    }
    else if(rpassword.length < 8 || rpassword.length > 20){
      toast.error("Password should be 8 to 20 charaters long", {autoClose: 2000});
    }
    else{
      return true;
    }
  };

  const rePasswordValidation = () => {
    if(rpassword === repassword){
      return true;
    }
    else{
      toast.error("Password and confirm password are not matching", {autoClose: 2000});
    }
  };

  const mobnoValidation = () => {
    const regex = /^\d{10}$/;
    if(mobno.match(regex)){
      return true;
    }else{
      toast.error("Please enter valid 10 digit mobile number", {autoClose: 2000});
    }
  };

  const pincodeValidation = () => {
    const regex = /^\d{6}$/;
    if(pincode.match(regex)){
      return true;
    }else{
      toast.error("Please enter valid pincode", {autoClose: 2000});
    }
  };

  const register = async() => {
    if(reqFieldsValidation() && emailValidation() && passwordValidation() && rePasswordValidation() 
    && mobnoValidation() && pincodeValidation()){
      debugger;
      const url = createurl('/delivery/register');
      axios.post(url,
        {
          "name": rname,
          "emailId": remail,
          "password": rpassword,
          "mobNo": mobno,
          "address": address,
          "pincode": pincode,
        })
        .then(res => {
          debugger;
          log(res.data);
          if(res.data.message === "email id or mobile number already registered"){
            toast.error("email id or mobile number already registered", {autoClose: 1500});
          }
          else if(res.data.error === "something went wrong"){
            toast.error("something went wrong. please try again later.", {autoClose:1500});
          }
          else{
            toast.success("User registered successfully", {autoClose: 1500});
            setIsFlipped(!isFlipped);
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

  return (
    <div className="card-rear">
        <h1>DELIVERY REGISTER</h1>
        <div className='grid'>

            <div className="box">
                <i className='fa fa-user icon'></i>
                <input type="text" className='input-box' placeholder='your name' required
                onChange={(e) => {setRName(e.target.value)}}/>
            </div>

            <div className="box">
                <i className='fa fa-envelope icon'></i>
                <input type="email" className='input-box' placeholder='your email id' required
                onChange={(e) => {setREmail(e.target.value)}}/>
            </div>

            <div className="box">
                <i className='fa fa-key icon'></i>
                <input type="password" className='input-box' placeholder='your password' id='pass2' required
                onChange={(e) => {setRPassword(e.target.value)}}/>

                <div className="icon-eye" onClick={showPassword2}>
                    <i id='eye3' className='fa fa-eye icon'></i>
                    <i id='eye4' className='fa fa-eye-slash icon'></i>
                </div>
            </div>

            <div className="box">
                <i className='fa fa-key icon'></i>
                <input type="password" className='input-box' placeholder='confirm password' id='re-pass' required
                onChange={(e) => {setRePassword(e.target.value)}}/>

                <div className="icon-eye" onClick={showPassword3}>
                    <i id='eye5' className='fa fa-eye icon'></i>
                    <i id='eye6' className='fa fa-eye-slash icon'></i>
                </div>
            </div>

        </div>

            <center>
            <div className="box">
                <i className="fa-solid fa-location-dot icon"></i>
                <textarea className="" rows="2" placeholder='your complete address'
                required onChange={(e) => {setAddress(e.target.value)}}/>
            </div>

            <div className="grid">
            <div className="box">
                <i className="fa-solid fa-location-dot icon"></i>
                <input type="number" className='input-box' placeholder='your pincode' required
                onChange={(e) => {setPincode(e.target.value)}} maxLength={6}/>
            </div>

            <div className="box">
                <i className="fa-solid fa-phone icon"></i>
                <input type="text" className='input-box' placeholder='your mobile number' required
                onChange={(e) => {setMobNo(e.target.value)}} maxLength={10}/>
            </div>
            </div>
            </center>

            <button className='btns btn btn-success' onClick={register}>Register</button>
            <div className="link">
            <a className='login-link' onClick={flip}>I have an account <i className='fa fa-arrow-right'></i></a>
            </div>

    </div>
  )
}

export default DelReg