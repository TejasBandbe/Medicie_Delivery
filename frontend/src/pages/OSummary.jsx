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

function OSummary() {

  const [validUser, setValidUser] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmt, setTotalAmt] = useState(0);
  const [saved, setSaved] = useState(0);
  const [amt, setAmt] = useState(0);
  const [profile, setProfile] = useState({});
  const [showUpi, setShowUpi] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [years, setYears] = useState([]);
  const [addressEdit, setAddressEdit] = useState(false);
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [upi, setUpi] = useState('');
  const [upiverify, setUpiverify] = useState(false);
  const [cardNo, setCardNo] = useState('');
  const [cvv, setCvv] = useState('');
  const [mm, setMm] = useState('');
  const [yy, setYy] = useState('');
  const [cardVerify, setCardVerify] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [payMethod, setPayMethod] = useState('');
  const [dDate, setDDate] = useState('');
  const [showPayOptions, setShowPayOptions] = useState(false);
  const [showChangeBtn, setShowChangeBtn] = useState(true);
  const [showPayBtn, setShowPayBtn] = useState(false);

  const history = useHistory();

  useEffect(() => {

  }, [showUpi, showCard, orderPlaced]);

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
            setCart(res.data);
            setValidUser(true);
            setOrderPlaced(false);

            var sum = 0;
            var saving = 0;
            for(var i=0; i<res.data.length; i++){
              sum += res.data[i].total;
              saving += (res.data[i].unit_price * res.data[i].quantity);
            }
            setTotalAmt(sum);
            setAmt(saving);
            setSaved(saving - sum);


            const year = new Date().getFullYear();
            const curyear = year % 100;
            const futureYears = [];
            for(var i = 1; i <= 15; i++){
              futureYears.push(curyear + i);
            }
            setYears(futureYears);

            setTimeout(() => {
              disableButton2();
            }, 500);
          }
        })
        .catch(error => {
          setValidUser(false);
        });
    };

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
                setValidUser(false);
            }else if(res.status === 200){
                setValidUser(true);
                setProfile(res.data[0]);
                setAddress(res.data[0].address);
                setPincode(res.data[0].pincode);
            }
          })
          .catch(error => {
            setValidUser(false);
          });
      };

    load();
    getProfile();
    
  }, []);

  const disableButton2 = () => {
    var button2 = document.getElementById('button2');
    button2.disabled = true;
  };

  const disablePayButton = () => {
    var button3 = document.getElementById("button3");
    button3.disabled = true;
  };

  const enableOSummary = () => {
    var osummary = document.getElementById('osummary');
    osummary.style.opacity = 1;

    var button2 = document.getElementById("button2");
    button2.removeAttribute("disabled");

    setShowChangeBtn(false);
  };

  const enablePayment = () => {
    debugger;
    var payment = document.getElementById('payment');
    payment.style.opacity = 1;
    setShowPayOptions(true);
  };

  const togglePaymentOptions = (option) => {

    if(option === 'upi'){
      setShowCard(false);
      setShowUpi(true);
      setCardVerify(false);
      setPayMethod('upi');

      setCardNo('');
      setMm('');
      setYy('');
      setCvv('');

      setShowPayBtn(false);
    }else if(option === 'card'){
      setShowCard(true);
      setShowUpi(false);
      setUpiverify(false);
      setPayMethod('credit/debit card');

      setUpi('');

      setShowPayBtn(false);
    }else if(option === 'cod'){
      setShowCard(false);
      setShowUpi(false);
      setUpiverify(false);
      setCardVerify(false);
      setPayMethod('cash on delivery');

      setCardNo('');
      setMm('');
      setYy('');
      setCvv('');
      setUpi('');

      setShowPayBtn(true);
    }
  };

  const verifyUpi = () => {
    if(upi === ''){
      toast.error("Please enter valid upi id",{autoClose: 2000});
      return;
    }
    var upiRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
    if(!upi.match(upiRegex)){
      toast.error("Please enter valid upi id",{autoClose: 2000});
      return;
    }
    setUpiverify(true);
    setShowPayBtn(true);
  };

  const formatCardNumber = () => {
    var input = document.getElementById('debitCardInput');
    var value = input.value.replace(/\D/g, '');

    if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 8) + '-' + value.substring(8, 12);
    }

    input.value = value;

    if (value.length === 10 && input.selectionStart === 10 && input.selectionEnd === 10) {
        input.setSelectionRange(9, 9);
    } else if (value.length === 14 && input.selectionStart === 14 && input.selectionEnd === 14) {
        input.setSelectionRange(13, 13);
    }
  };

  const verifyCard = () => {
    if(cardNo === '' || cardNo.length !== 14){
      toast.error("Please enter valid card number", {autoClose: 1500});
      return;
    } else if(mm === '' || yy === ''){
      toast.error("Please enter card expity month and year", {autoClose: 1500});
      return;
    }else if(cvv === '' || cvv.length !== 3){
      toast.error("Please enter valid cvv", {autoClose: 1500});
      return;
    }
    setCardVerify(true);
    setShowPayBtn(true);
  }

  const disableContinue = () => {
    setAddressEdit(true);
    var contButton = document.getElementById("contButton");
    contButton.disabled = true;

    var button2 = document.getElementById("button2");
    button2.disabled = true;
  };

  const enableContinue = () => {
    setAddressEdit(false);
    var contButton = document.getElementById("contButton");
    contButton.removeAttribute("disabled");
  };

  const placeOrder = () => {
    debugger;
    var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
    var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
    const url = createurl('/users/placeorder');

    axios.post(url,
      {
        "userId": userId,
        "totalAmt": totalAmt,
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
            if(res.data.message === "order placed"){
              toast.success("order placed", {autoClose: 2000});
              setOrderPlaced(true);
              setDDate(res.data.deliveryTime);
            }
        }
      })
      .catch(error => {
        debugger;
        setValidUser(false);
        toast.error("Something went wrong", {autoClose: 1500});
      });
  };

  return (
    <Container>
{
    validUser ? <Nav/> : <Navw/>
}

{
  !orderPlaced ? 
  <div className="page">

  <div className="section1">
    <div className="address card">

      <div className="content">
      <div className="top">
        <div className="heading">Deliver to:</div>
{
  showChangeBtn ? 
<>
  {
  addressEdit ? 
  <div className="btn btn-success" onClick={enableContinue}>Save</div>
  : 
  <div className="btn btn-warning" onClick={disableContinue}>Change</div>
  }
</>
  :
  <></>
}
      </div>

      <div className="mid">{profile.name}</div>

{
  addressEdit ?
  <div className='bottom'>
    <textarea className='btarea' rows="3" value={address} onChange={(e) => {setAddress(e.target.value)}}></textarea>
    <input className='btext' type="text" value={pincode} onChange={(e) => {setPincode(e.target.value)}}/>
  </div>
  :
  <div className="bottom">{address}, {pincode}</div>
}   

      <div className="mob">{profile.mob_no}</div>
      </div>

      <div className="button">
        <button className='btn btn-warning' id="contButton" onClick={enableOSummary}> 
        <a href="#osummary">Continue</a> </button>
      </div>
    </div>

    <div className="osummary card" id="osummary">

      <div className="content">

      <div className="top">Order Summary:</div>

{
  cart.map((item) => (
      <div className="items" key={item.cartId}>
      <div className='item_name'>{item.name}</div>
      <div className='item_quantity mx-2'>{item.quantity}</div>
      <div className='item_total'>₹ {Math.round(item.total*100)/100}</div>
      </div>
  ))
}
<hr/>
<div className="items">
  <div style={{fontWeight: "600"}}>Total</div>
  <div></div>
  <div style={{fontWeight: "600"}}>₹ {Math.round(totalAmt*100)/100}</div>
</div>
<div className="items">
  <div>Saved</div>
  <div></div>
  <div>₹ {Math.round(saved*100)/100}</div>
</div>

      </div>

      <div className="button">
      <button className='btn btn-warning' id="button2" onClick={enablePayment}> 
        <a href="#payment">Continue</a> </button>
      </div>
      
    </div>
  </div>

  <div className="section2">
    <div className="payment card" id="payment">
      <div className="top mb-3">
      Select Payment Option:
      </div>

      {
        showPayOptions ? <div className='radioGroup'>
        <div className='radio'>
          <input className='mx-2' type="radio" name="paymentRadio" id=""
           onClick={() => {togglePaymentOptions('upi')}}/>
          UPI
        </div>

{
  showUpi ? 
  <div className="upi">
    <input type="text" placeholder='enter your upi id' value={upi}
    onChange={(e) => {setUpi(e.target.value)}}/>
    <button onClick={verifyUpi}>Verify</button>
  </div>
  :
  <></>
}
{
  upiverify ? 
  <div className='upiverify'>
    <div className='verifyicon'>
      <i className="fa-solid fa-circle-check mx-3"></i>
      Verified
    </div>
    <div className='verifyname'>{profile.name}</div>
  </div> 
  :
  <></>
}

        <div className='radio'>
          <input className='mx-2' type="radio" name="paymentRadio" id=""
           onClick={() => {togglePaymentOptions('card')}}/>
          Credit/Debit/ATM card
        </div>

{
  showCard ? 
  <div className="paycard">
    <div className='upi'>
      <input type="text" placeholder='enter your card number' id="debitCardInput" maxLength="16"
      onInput={formatCardNumber} onChange={(e) => {setCardNo(e.target.value)}}/>
      <button onClick={verifyCard}>Verify</button>
    </div>
    Valid thru
    <div className='flex'>

    <div className='date'>
    <select name="" className="" onChange={(e) => {setMm(e.target.value)}}>
      <option value="">MM</option>
      <option value="1">01</option>
      <option value="2">02</option>
      <option value="3">03</option>
      <option value="4">04</option>
      <option value="5">05</option>
      <option value="6">06</option>
      <option value="7">07</option>
      <option value="8">08</option>
      <option value="9">09</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
    </select>
    <select name="" className="" onChange={(e) => {setYy(e.target.value)}}>
      <option value="">YY</option>
      {
        years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))
      }
    </select>
    </div>

    <input type="password" placeholder='cvv' value={cvv} maxLength={3}
    onChange={(e) => {setCvv(e.target.value)}}/>

    </div>
  </div>
  :
  <></>
}

{
  cardVerify ? 
  <div className='upiverify'>
    <div className='verifyicon'>
      <i className="fa-solid fa-circle-check mx-3"></i>
      Verified
    </div>
    <div className='verifyname'>{profile.name}</div>
  </div> 
  :
  <></>
}

        <div className='radio'>
          <input className='mx-2' type="radio" name="paymentRadio" id="" 
           onClick={() => {togglePaymentOptions('cod')}}/>
          Cash on delivery
        </div>
      </div>
        :
        <></>
      }

{
  showPayBtn ? 
    <div className='button' onClick={placeOrder}><button className='btn btn-warning' id="button3">
      Pay ₹ {Math.round(totalAmt*100)/100}</button>
    </div> :
    <></>
}  
    </div>
  </div>

</div>
  : 
  <div className='orderplaced'>
    <div className="box">
      <div className='green'>
        <i className="fa-regular fa-circle-check"></i><br/>
        Order placed successfully!!
      </div>
      <div className='p'>Estimated delivery date<br/>{dDate}</div>
      <div className='p'>Total Amount<br/>₹ {totalAmt}</div>
      <div className='p'>Payment method:<br/>{payMethod}</div>
    </div>
  </div>
}


<Footer/>
    </Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;

.page{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  min-height: 25rem;

  @media(max-width: 768px){
    gap: 0.5rem;
    padding: 0.5rem;
  }

  @media(max-width: 700px){
    grid-template-columns: repeat(1, 1fr);
  }

  .section1{
    padding: 1rem;
    background-color: #427baa;
    display: grid;
    grid-template-columns: 40% 58%;
    gap: 1rem;

    @media(max-width: 1200px){
      grid-template-columns: 100%;
    }

    @media(max-width: 768px){
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .address{
      color: white;
      border: 0.1rem solid white;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @media(max-width: 768px){
        padding: 0.5rem;
      }

      .content{
        .top{
          display: flex;
          justify-content: space-between;
          padding-bottom: 1rem;

          @media(max-width: 500px){
            padding-bottom: 0.5rem;
          }
  
          .heading{
            font-size: 1.5rem;
            text-decoration: underline;
  
            @media(max-width: 1000px){
              font-size: 1.2rem;
            }
            @media(max-width: 500px){
              font-size: 1rem;
            }
          }
  
          .btn{
            border: 0.1rem solid white;

            @media(max-width: 1000px){
              font-size: 0.8rem;
              padding: 0.2rem 0.6rem;
            }
            @media(max-width: 500px){
              font-size: 0.7rem;
              padding: 0.1rem 0.5rem;
            }
          }
        }
  
        .mid,.bottom,.mob{
          font-size: 1.2rem;
  
          @media(max-width: 1000px){
            font-size: 1rem;
          }
          @media(max-width: 500px){
            font-size: 0.8rem;
          }
        }

        .bottom{

          .btarea{
            width: 100%;
            resize: none;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            outline: none;
            color: white;
          }

          .btext{
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            outline: none;
            color: white;
          }
        }
      }

      .button{
        display: flex;
        justify-content: center;

        button{
          border: 0.1rem solid white;
          @media(max-width: 1000px){
            font-size: 0.8rem;
            padding: 0.2rem 0.6rem;
          }
          @media(max-width: 500px){
            font-size: 0.7rem;
            padding: 0.1rem 0.5rem;
          }
          a{
            text-decoration: none;
            color: black;
          }
        }
      }
    }

    .osummary{
      color: white;
      border: 0.1rem solid white;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      opacity: 0.6;

      @media(max-width: 768px){
        padding: 0.5rem;
      }
      
      .content{
        width: 100%;
        .top{
          font-size: 1.5rem;
          text-decoration: underline;
          padding-bottom: 1rem;

          @media(max-width: 500px){
            padding-bottom: 0.5rem;
          }
  
          @media(max-width: 1000px){
            font-size: 1.2rem;
          }
          @media(max-width: 500px){
            font-size: 1rem;
          }
        }
  
        .items{
          display: grid;
          grid-template-columns: 68% 8% 24%;
          font-size: 1rem;
  
          @media(max-width: 1000px){
            font-size: 0.8rem;
          }

        }
  
        hr{
          border: 0.1rem solid white;
  
          @media(max-width: 1000px){
            border: 0.05rem solid white;
          }
        }
      }

      .button{
        display: flex;
        justify-content: center;
        width: 20%;

        button{
          border: 0.1rem solid white;
          @media(max-width: 1000px){
            font-size: 0.8rem;
            padding: 0.2rem 0.6rem;
          }
          @media(max-width: 500px){
            font-size: 0.7rem;
            padding: 0.1rem 0.5rem;
          }
          a{
            text-decoration: none;
            color: black;
          }
        }
      }

    }

  }

  .section2{
    padding: 1rem;
    background-color: #427baa;
    display: grid;

    @media(max-width: 768px){
      padding: 0.5rem;
    }

    .payment{
      padding: 1rem;
      border: 0.1rem solid white;

      opacity: 0.6;

      @media(max-width: 768px){
        padding: 0.5rem;
      }

      .top{
        font-size: 1.5rem;
        text-decoration: underline;

        @media(max-width: 1000px){
          font-size: 1.2rem;
        }
        @media(max-width: 500px){
          font-size: 1rem;
        }
      }

      .radioGroup{

        .radio{
          font-size: 1.2rem;

          @media(max-width: 1000px){
            font-size: 1rem;
          }
          @media(max-width: 500px){
            font-size: 0.8rem;
          }
        }

        .upi{
          display: flex;
          justify-content: space-between;
          margin-block: 1rem;
          gap: 1rem;

          input{
            background: transparent;
            border: none;
            outline: none;
            border-bottom: 0.1rem solid white;
            padding-left: 1rem;
            width: 80%;
            color: white;
            font-size: 1.2rem;

            @media(max-width: 1000px){
              font-size: 1rem;
            }
            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }
          input::placeholder{
            color: white;
            opacity: .6;
          }

          button{
            background-color: #122b40;
            color: white;
            padding: 0.2rem 0.8rem;
            border-radius: 0.5rem;
            border: 0.1rem solid white;

            @media(max-width: 1000px){
              font-size: 0.8rem;
            }
            @media(max-width: 500px){
              font-size: 0.7rem;
            }
          }
        }

        .upiverify{
          display: flex;
          justify-content: space-between;
          margin-top: -0.5rem;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.5);

          .verifyicon{
            color: green;
            font-weight: 700;

            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }

          .verifyname{
            color: green;
            padding-right: 2rem;
            font-weight: 700;

            @media(max-width: 500px){
              font-size: 0.8rem;
            }
          }
        }

        .paycard{
          margin-block: 1rem;
          font-size: 1.2rem;

          @media(max-width: 1000px){
            font-size: 1rem;
          }
          @media(max-width: 500px){
            font-size: 0.8rem;
          }

          .cno{
            margin-bottom: 1rem;
            input{
              width: 90%;
              font-size: 1.2rem;
              background: transparent;
              border: none;
              outline: none;
              border-bottom: 0.1rem solid white;
              color: white;
              padding-left: 1rem;

              @media(max-width: 1000px){
                font-size: 1rem;
              }
              @media(max-width: 500px){
                font-size: 0.8rem;
              }
            }
            input::placeholder{
              color: white;
              opacity: 0.6;
            }
          }

          .flex{
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            width: 80%;

            @media(max-width: 900px){
              width: 90%;
            }

            .date{
              display: flex;
              gap: 0.5rem;
              font-size: 1rem;

              @media(max-width: 1000px){
                font-size: 0.8rem;
              }
              @media(max-width: 500px){
                font-size: 0.7rem;
              }

              select{
                background: rgba(255, 255, 255, 0.5);
                border: none;
                outline: none;
                color: black;

              }
            }

            input{
              background: transparent;
              border: none;
              outline: none;
              border-bottom: 0.1rem solid white;
              font-size: 1.2rem;
              width: 20%;
              color: white;
              padding-left: 0.5rem;

              @media(max-width: 1000px){
                font-size: 1rem;
              }
              @media(max-width: 500px){
                font-size: 0.8rem;
              }
            }
            input::placeholder{
              color: rgba(255,255,255,0.6);
            }
          }
        }
      }

      .button{
        margin-top: 3rem;

        @media(max-width: 500px){
          margin-top: 1rem;
        }

        button{

          @media(max-width: 1000px){
            font-size: 0.8rem;
            padding: 0.2rem 0.6rem;
          }
          @media(max-width: 500px){
            font-size: 0.7rem;
            padding: 0.1rem 0.5rem;
          }
        }
      }
    }

  }

}

.orderplaced{
display: flex;
justify-content: center;
align-items: center;
padding: 2rem;
min-height: 50vh;

  .box{
    width: 40%;
    background-color: #427baa;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;

    @media(max-width: 1100px){
      width: 50%;
    }
    @media(max-width: 768px){
      width: 70%;
    }
    @media(max-width: 600px){
      gap: 0.5rem;
    }
    @media(max-width: 450px){
      width: 85%;
    }

    div{
      color: white;
      font-size: 1.2rem;
      text-align: center;

      i{
        font-size: 2rem;

        @media(max-width: 1000px){
          font-size: 1.5rem;
        }
        @media(max-width: 600px){
          font-size: 1.2rem;
        }
      }
    }

    .green{
      font-size: 1.5rem;
      color: white;
      font-weight: 700;
      text-shadow: 0 0 0.2rem green, 0 0 0.4rem green;

      @media(max-width: 1000px){
        font-size: 1.2rem;
      }
      @media(max-width: 600px){
        font-size: 1rem;
      }
    }

    .p{
      @media(max-width: 1000px){
        font-size: 1rem;
      }
      @media(max-width: 600px){
        font-size: 0.8rem;
      }
    }
  }
}
`;

export default OSummary