import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
import styled from 'styled-components';
import Nav from '../components/Nav';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { createurl, log, constants } from '../env';
import axios from 'axios';

function Profile() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [otp, setOtp] = useState('');
  const [oldpass, setOldpass] = useState('');
  const [newpass, setNewpass] = useState('');

  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [mobileEdit, setMobileEdit] = useState(false);
  const [ageEdit, setAgeEdit] = useState(false);
  const [addressEdit, setAddressEdit] = useState(false);
  const [pincodeEdit, setPincodeEdit] = useState(false);
  const [passEdit, setPassEdit] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getProfile = () => {
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
          if(res.status === 400 || res.status === 401){
            history.push('/');
          }else if(res.status === 200){
            setName(res.data[0].name);
            setEmail(res.data[0].email_id);
            setMobile(res.data[0].mob_no);
            setAge(res.data[0].age);
            setAddress(res.data[0].address);
            setPincode(res.data[0].pincode);
          }
        })
        .catch(error => {
          log(error);
          history.push('/');
        });
    };

    getProfile();
  }, []);

  const update = (property) => {
    debugger;
    if(property === 'name'){
      setNameEdit(false);
    }else if(property === 'email'){
      setEmailEdit(false);
    }else if(property === 'mobile'){
      setMobileEdit(false);
    }else if(property === 'age'){
      setAgeEdit(false);
    }else if(property === 'address'){
      setAddressEdit(false);
    }else if(property === 'pincode'){
      setPincodeEdit(false);
    }

    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/editprofile');

    axios.post(url,
      {
        "userId": userId,
        name, age,
        "emailId": email,
        "mobNo": mobile,
        address, pincode
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          if(res.data.affectedRows === 1){
            toast.success("Profile updated sucecssfully.", {autoClose: 1500});
          }else{
            toast.error("Something went wrong", {autoClose: 1500});
          }
        }
      })
      .catch(error => {
        debugger;
        log(error);
        if(error.response.data.error.code === 'ER_DUP_ENTRY'){
          toast.error("This mobile number is already registered", {autoClose: 3000});
        }else{
          toast.error("Something went wrong", {autoClose: 1500});
        }
      });
  };

  const updateEmail = () => {
    debugger;
    setEmailEdit(false);

    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/sendemailotp');

    axios.post(url,
      {
        "userId": userId,
        "emailId": email
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          if(res.data.message === "Email id is same as previous"){
            toast.warning(res.data.message, {autoClose: 2000});
          }else if(res.data.error === "This email id is already registered"){
            toast.error(res.data.error, {autoClose: 2000});
          }else if(res.data.error === "OTP not sent"){
            toast.error("Something went wrong. Please try again later.", {autoClose: 2000});
          }else if(res.data.message === "Otp sent via email"){
            toast.success(res.data.message, {autoClose: 2000});
            setIsOtp(true);
            setEmail(res.data.emailId);
          }
        }
      })
      .catch(error => {
        debugger;
        log(error);
        if(error.response.data.error.code === 'ER_DUP_ENTRY'){
          toast.error("This email id is already registered", {autoClose: 3000});
        }else{
          toast.error("Something went wrong", {autoClose: 1500});
        }
      });
  };

  const completeEmailChange = () => {
    debugger;
    setIsOtp(false);

    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/completeemailchange');

    axios.post(url,
      {
        "userId": userId,
        "emailId": email,
        "otp": otp
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          if(res.data.message === "Email id updated successfully."){
            toast.success("Email id updated successfully.", {autoClose: 1500});
          }else if(res.data.error === "Something went wrong."){
            toast.error(res.data.error, {autoClose: 2000});
          }else if(res.data.error === "OTP is wrong. Please try again."){
            toast.error(res.data.error, {autoClose: 2000});
          }else{
            toast.error("Something went wrong", {autoClose: 2000});
          }
        }
      })
      .catch(error => {
        debugger;
        log(error);
        toast.error("Something went wrong", {autoClose: 2000});
      });
  };

  const showOldPassword = () => {
    var opass = document.getElementById("oldpass");
    var eye1 = document.getElementById("eye1");
    var eye2 = document.getElementById("eye2");

    if(opass.type === 'password'){
        opass.type = 'text';
        eye1.style.display = 'none';
        eye2.style.display = 'block';
    }
    else{
        opass.type = 'password';
        eye1.style.display = 'block';
        eye2.style.display = 'none';
    }
  };

  const showNewPassword = () => {
    var opass = document.getElementById("newpass");
    var eye3 = document.getElementById("eye3");
    var eye4 = document.getElementById("eye4");

    if(opass.type === 'password'){
        opass.type = 'text';
        eye3.style.display = 'none';
        eye4.style.display = 'block';
    }
    else{
        opass.type = 'password';
        eye3.style.display = 'block';
        eye4.style.display = 'none';
    }
  };

  const updatePassword = () => {
    debugger;
    setPassEdit(false);
    if(oldpass === newpass){
      toast.error("Old password and new password should not be same");
      return;
    }

    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/updatepassword');

    axios.post(url,
      {
        "userId": userId,
        "oldPass": oldpass,
        "newPass": newpass
      },
      {
        headers: {
            'authorization': `Bearer ${jwtToken}`
        }
      })
      .then(res => {
        debugger;
        if(res.status === 400 || res.status === 401){
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          if(res.data.error === "Entered old password is wrong"){
            toast.error(res.data.error, {autoClose: 2500});
          }else if(res.data.error === "Something went wrong"){
            toast.error(res.data.error, {autoClose: 2000});
          }else if(res.data.message === "Password updated successfully"){
            toast.success(res.data.message, {autoClose: 2000});
          }else{
            toast.error("Something went wrong", {autoClose: 2000});
          }
        }
      })
      .catch(error => {
        debugger;
        log(error);
        toast.error("Something went wrong", {autoClose: 2000});
      });
  };

  const deactivate = () => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/deactivate');

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
        debugger;
        if(res.status === 400 || res.status === 401){
          history.push('/');
        }else if(res.status === 200){
          log(res.data);
          if(res.data.error === "Something went wrong"){
            toast.error(res.data.error, {autoClose: 2000});
          }else if(res.data.message === "Account deactivated"){
            toast.success(res.data.message, {autoClose: 1500});
            setTimeout(() => {
              sessionStorage.removeItem("userId");
              sessionStorage.removeItem("token");
              history.push("/");
            }, 1500);
          }else{
            toast.error("Something went wrong", {autoClose: 2000});
          }
        }
      })
      .catch(error => {
        debugger;
        log(error);
        toast.error("Something went wrong", {autoClose: 2000});
      });
  };


  return (
    <Container>
      <Nav/>
<div className="page">
  <div className="card">

    <div className="image">
      <img src="https://cdn-icons-png.flaticon.com/128/1999/1999625.png" alt="" />
    </div>

    <div className="content">

      {
        isOtp ? 
        <div className='otp'>
          <h5>Please check your inbox. We have sent an OTP on your entered email id.</h5>
          <div className="box">
          <i className="fa-solid fa-key"></i>
          <input type="text" className='input-box' value={otp} placeholder='OTP' onChange={(e) => {setOtp(e.target.value)}}/>
          </div>
          <button className='btn btn-success' onClick={completeEmailChange}>Submit</button>
        </div> 
        : 
        <>
        
        {
          isModal ? 
          <div className='mymodal'>
          <h5>Do you want to deactivate your account ?</h5>
          <div className="buttons">
            <button className='btn btn-danger' onClick={deactivate}>Deactivate</button>
            <button className='btn btn-warning' onClick={() => {setIsModal(false)}}>No</button>
          </div>
          </div> 
          : 
          <>
          
          {
        nameEdit ? 
        <div className='box'>
          <h5>Name</h5>
          <input type="text" value={name} placeholder='your name' onChange={(e) => {setName(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={() => {update('name')}} 
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Name</h5>
          <h5>{name}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setNameEdit(true)}}></i>
        </div>
      }

      {
        emailEdit ? 
        <div className='box'>
          <h5>Email</h5>
          <input type="text" value={email} placeholder='your email id' onChange={(e) => {setEmail(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={updateEmail}
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Email</h5>
          <h5>{email}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setEmailEdit(true)}}></i>
        </div>
      }

      {
        mobileEdit ? 
        <div className='box'>
          <h5>Mobile</h5>
          <input type="text" value={mobile} placeholder='your mobile number' onChange={(e) => {setMobile(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={() => {update('mobile')}}
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Mobile</h5>
          <h5>{mobile}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setMobileEdit(true)}}></i>
        </div>
      }

      {
        ageEdit ? 
        <div className='box'>
          <h5>Age</h5>
          <input type="text" value={age} placeholder='your age' onChange={(e) => {setAge(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={() => {update('age')}}
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Age</h5>
          <h5>{age}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setAgeEdit(true)}}></i>
        </div>
      }

      {
        addressEdit ? 
        <div className='box'>
          <h5>Address</h5>
          <input type="text" value={address} placeholder='your address' onChange={(e) => {setAddress(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={() => {update('address')}}
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Address</h5>
          <h5>{address}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setAddressEdit(true)}}></i>
        </div>
      }

      {
        pincodeEdit ? 
        <div className='box'>
          <h5>Pincode</h5>
          <input type="text" value={pincode} placeholder='your pincode' onChange={(e) => {setPincode(e.target.value)}}/>
          <i className="fa-solid fa-circle-check" onClick={() => {update('pincode')}}
          style={{color: '#3ce63c', textShadow: "0 0 0.1rem #fff,0 0 0.2rem #fff,0 0 0.3rem #3ce63c, 0 0 0.4rem #3ce63c"}}></i>
        </div> 
        :
        <div className="box">
          <h5>Pincode</h5>
          <h5>{pincode}</h5>
          <i className="fa-solid fa-pen" onClick={() => {setPincodeEdit(true)}}></i>
        </div>
      }

      {
        passEdit ? 
        <>

        <div className='box'>
          <h5>Password</h5>
          <div className='passdiv'>
            <input type="password" value={oldpass} id="oldpass" placeholder='old password' 
            onChange={(e) => {setOldpass(e.target.value)}}/>
            <div className="icon-eye" onClick={showOldPassword}>
            <i id="eye1" className="fa-solid fa-eye icon"></i>
            <i id="eye2" className="fa-solid fa-eye-slash icon"></i>
            </div>
          </div>
          <p></p>
        </div>

        <div className='box'>
          <p></p>
          <div className='passdiv'>
          <input type="password" value={newpass} id="newpass" placeholder='new password'
           onChange={(e) => {setNewpass(e.target.value)}}/>
           <div className="icon-eye" onClick={showNewPassword}>
            <i id="eye3" className="fa-solid fa-eye icon"></i>
            <i id="eye4" className="fa-solid fa-eye-slash icon"></i>
            </div>
           </div>
          <p></p>
        </div>

        <div className="box">
          <p></p>
          <div className="buttons" style={{display: "flex", gap: "1rem"}}>
          <button className='btn btn-warning' onClick={updatePassword}>Update Password</button>
          <button className='btn btn-danger' onClick={() => {setPassEdit(false)}}>Close</button>
          </div>
          <p></p>
        </div>

        </>
        :
        <div className="box">
          <h5>Password</h5>
          <h5>★★★★★★</h5>
          <i className="fa-solid fa-pen" onClick={() => {setPassEdit(true)}}></i>
        </div>
      }

      <button className='btn btn-info' onClick={() => {setIsModal(true)}}>Deactivate Account</button>
          
          </>
        }

        </>
      }

      

    </div>
  </div>
</div>
    </Container>
  )
}

const Container = styled.div`
height: 100vh;
background-color: #eaf5ff;

  .page{
    display: flex;
    height: 80%;
    justify-content: center;
    align-items: center;

    .card{
      background-color: #122b40;
      width: 50%;
      display: grid;
      grid-template-columns: 30% 70%;
      padding: 1rem;

      @media(max-width: 1600px){
        width: 70%;
      }
      @media(max-width: 1000px){
        margin-top: 1rem;
        grid-template-columns: 100%;
      }
      @media(max-width: 768px){
        width: 90%;
      }
      @media(max-width: 400px){
        margin-top: 0;
        width: 95%;
      }

      .image{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;

        

        img{
          width: 100%;

          @media(max-width: 1000px){
            width: 40%;
          }
        }
      }

      .content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        padding: 1rem 0.5rem 1rem 2rem;

        @media(max-width: 1200px){
          gap: 0.5rem;
        }

        @media(max-width: 1000px){
          padding: 1.5rem 0.5rem 0.5rem 0.5rem;
        }

        .box{
          display: grid;
          grid-template-columns: 25% 70% 5%;
          gap: 0.5rem;
          align-items: center;

          @media(max-width: 1000px){
            grid-template-columns: 17% 78% 5%;
          }

          h5{
            display: flex;
            align-items: center;
            height: 100%;
            margin: 0;

            @media(max-width: 1200px){
              font-size: 1rem;
            }
            @media(max-width: 550px){
              font-size: 0.8rem;
            }
            @media(max-width: 400px){
              font-size: 0.7rem;
            }
          }

          i{
            cursor: pointer;
            transition: ease 0.3s;

            @media(max-width: 1200px){
              font-size: 0.8rem;
            }
            @media(max-width: 550px){
              font-size: 0.7rem;
            }
          }
          i:hover{
            transform: scale(1.1);
          }

          input{
            background: rgba(255, 255, 255, 0.7);
            padding: 0.3rem;
            font-weight: 700;
            outline: none;
            border-radius: 0.5rem;

            @media(max-width: 550px){
              font-size: 0.8rem;
            }
            @media(max-width: 400px){
              font-size: 0.7rem;
            }
          }

          .passdiv{
            display: flex;
            align-items: center;
            
            input{
              width: 100%;
              margin-right: -2rem;
            }

            .icon-eye{
              #eye2, #eye4{
                display: none;
              }

              i{
                color: black;
              }
            }
          }
        }

        button{
          font-weight: 700;

          @media(max-width: 550px){
            font-size: 0.8rem;
            padding: 0.3rem;
          }
        }

        .otp{
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: center;

          h5{
            text-align: center;
          }

          .box{
            display: flex;
            gap: 1rem;

            i{
              font-size: 1.2rem;

              @media(max-width: 450px){
                font-size: 1rem;
              }
            }
          }
        }

        .mymodal{
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: center;

          h5{
            text-align: center;
          }

          .buttons{
            display: flex;
            gap: 1rem;

            button{
              padding: 0.3rem 0.5rem;
            }
          }
        }
      }
    }
  }
`;

export default Profile