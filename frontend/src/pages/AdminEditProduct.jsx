import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createurl, log } from '../env';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AdminNav from '../components/AdminNav';
import Footer from '../components/Footer';

function AdminEditProduct() {

  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [discount, setDiscount] = useState(0.0);
  const [available, setAvailable] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [likes, setLikes] = useState(0);
  const [oicount, setOicount] = useState(0);
  const [expDate, setExpDate] = useState('');

    useEffect(() => {
        getProduct();
      }, []);
    
      const getProduct = () => {
        debugger;
        var userId = sessionStorage.getItem("userId") ? sessionStorage.getItem("userId") : 0;
        var prodId = sessionStorage.getItem("prodId") ? sessionStorage.getItem("prodId") : 0;
        var jwtToken = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : 'notoken';
        const url = createurl('/admin/getproductbyid');
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
            }else if(res.status === 200){
                log(res.data);
                setName(res.data[0].name);
                setManufacturer(res.data[0].manufacturer);
                setDescription(res.data[0].description);
                setCategory(res.data[0].category);
                setImage(res.data[0].image);
                setDiscount(res.data[0].discount);
                setAvailable(res.data[0].available_qty);
                setUnitPrice(res.data[0].unit_price);
                setLikes(res.data[0].likes);
                setOicount(res.data[0].oicount);
                setExpDate(res.data[0].exp_date);
                // window.location.reload();
            }
        })
        .catch(error => {
            debugger;
            log(error);
        });
      };
  return (
<Container>
  <AdminNav/>

<div className="page">
  <div className="innercontainer">

    <div className="box">
      <div className="title">Name</div>
      <div className="value">
        <input type="text" value={name} onChange={(e) => {setName(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Manufacturer</div>
      <div className="value">
        <input type="text" value={manufacturer} onChange={(e) => {setManufacturer(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Description</div>
      <div className="value">
        <input type="text" value={description} onChange={(e) => {setDescription(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Category</div>
      <div className="value">
        <select name="" id="" value={category}>
            <option value="medicine">Medicine</option>
            <option value="healthcare">Healthcare</option>
            <option value="devices">Devices</option>
            <option value="skincare">Skincare</option>
            <option value="medicine">Medicine</option>
            <option value="medicine">Medicine</option>
        </select>
        {/* <input type="text" value={name} onChange={(e) => {setName(e.target.value)}}/> */}
      </div>
    </div>

    <div className="box">
      <div className="title">Image</div>
      <div className="value">
        <input type="text" value={image} onChange={(e) => {setImage(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Unit Price</div>
      <div className="value">
        <input type="text" value={unitPrice} onChange={(e) => {setUnitPrice(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Discount</div>
      <div className="value">
        <input type="text" value={discount} onChange={(e) => {setDiscount(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Available</div>
      <div className="value">
        <input type="text" value={available} onChange={(e) => {setAvailable(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Expiry date</div>
      <div className="value">
        <input type="text" value={expDate} onChange={(e) => {setExpDate(e.target.value)}}/>
      </div>
    </div>

    <div className="box">
      <div className="title">Likes</div>
      <div className="value">
        {likes}
        {/* <input type="text" value={discount} onChange={(e) => {setDiscount(e.target.value)}}/> */}
      </div>
    </div>

    <div className="box">
      <div className="title">Purchases</div>
      <div className="value">
        {oicount}
        {/* <input type="text" value={discount} onChange={(e) => {setDiscount(e.target.value)}}/> */}
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
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;

    .innercontainer{
      width: 60%;
      background-color: #427baa;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .box{
        display: grid;
        grid-template-columns: 20% 80%;
        
        .title{
          color: white;
        }

        .value{

          input{
            width: 90%;
          }
        }
      }
    }
}
`;

export default AdminEditProduct