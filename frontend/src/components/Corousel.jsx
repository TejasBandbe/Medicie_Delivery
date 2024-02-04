import React from 'react';
import styled from 'styled-components';
import f1 from '../images/f1.png';
import f2 from '../images/f2.png';
import f3 from '../images/f3.png';

function Corousel() {
  return (
    <Container>
<div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
<div className="a">
  <div className="image">
    <img src={f1} alt="" />
  </div>
  
  <div className="feature">
    <h4>Some Feature</h4>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati perferendis temporibus ab, quae rem, ducimus atque, laborum eum asperiores dolorum quisquam. Recusandae rerum natus totam voluptate facere at. Debitis, harum?</p>
  </div>
</div>
    </div>
    <div className="carousel-item">
<div className="b">
  <div className="image">
    <img src={f2} alt="" />
  </div>
  
  <div className="feature">
    <h4>Some Feature</h4>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati perferendis temporibus ab, quae rem, ducimus atque, laborum eum asperiores dolorum quisquam. Recusandae rerum natus totam voluptate facere at. Debitis, harum?</p>
  </div>
</div>
    </div>
    <div className="carousel-item">
<div className="c">
  <div className="image">
    <img src={f3} alt="" />
  </div>
  
  <div className="feature">
    <h4>Some Feature</h4>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati perferendis temporibus ab, quae rem, ducimus atque, laborum eum asperiores dolorum quisquam. Recusandae rerum natus totam voluptate facere at. Debitis, harum?</p>
  </div>
</div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    </Container>
  )
}

const Container = styled.div`
  .carousel{
    margin-bottom: 1rem;

    .carousel-item{
      .a, .b, .c{
        display: flex;
        align-items: center;
        height: 20rem;
        background-color: #427baa;
        color: white;

        .image{
          img{
            margin: 0.5rem 2rem 0.5rem 10rem;
            height: 100%;

            @media (max-width: 1000px){
              margin: 0.5rem 2rem 0.5rem 5rem;
            }
            @media (max-width: 768px){
              margin: 0.5rem 1rem 0.5rem 2rem;
            }
            @media (max-width: 600px){
              width: 10rem;
            }
            @media (max-width: 500px){
              margin: 0.5rem;
              width: 8rem;
            }
          }
        }

        .feature{
          padding-right: 10rem;

          @media (max-width: 1000px){
            padding-right: 5rem;
          }
          @media (max-width: 768px){
            padding-right: 2rem;
          }
          @media (max-width: 500px){
            padding-right: 1rem;
          }

          h4{
            font-size: 2rem;
            @media (max-width: 1200px){
              font-size: 1.4rem;
            }
            @media (max-width: 600px){
              font-size: 1.2rem;
              line-height: 0.8;
            }
            @media (max-width: 450px){
              font-size: 1rem;
              line-height: 0.5;
            }
          }
          p{
            font-size: 1.5rem;
            width: 60%;
            @media (max-width: 1400px){
              width: 80%;
            }
            @media (max-width: 1200px){
              width: 100%;
              font-size: 1rem;
            }
            @media (max-width: 600px){
              font-size: 0.8rem;
              line-height: 1.2;
            }
            @media (max-width: 450px){
              font-size: 0.7rem;
            }
          }
        }

        @media (max-width: 1000px){
          height: 17rem;
        }
        @media (max-width: 768px){
          height: 14rem;
        }
      }
    }
  }
`;

export default Corousel