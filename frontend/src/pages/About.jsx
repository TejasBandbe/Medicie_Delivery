import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import Slider from "react-slick";
import Nav from '../components/Nav';
import Navw from '../components/Navw';
import Footer from '../components/Footer';
import vision from '../images/vision.jpg';
import mission from '../images/mission.jpeg';
import values from '../images/values.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createurl, log } from '../env';
import axios from 'axios';

function About() {
  const [validUser, setValidUser] = useState(false);

  const history = useHistory();

  if(window.innerWidth > 1400){
    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1
    };
  }

  if(window.innerWidth <= 1400){
      var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };
  }

  if(window.innerWidth <= 650){
    var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  }

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

    load();
  }, []);

  const goToContact = () => {
    history.push('/contact');
  };

  return (
    <Container>
{
  validUser ? <Nav/> : <Navw/>
}

<div className="page">

  <div className="header">
    <h1>ABOUT US</h1>
  </div>

  <div className="top-section">
    <div className="content">
      <h3>Who We Are</h3>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sequi perspiciatis ut 
        nobis natus alias nostrum reiciendis eum nisi laudantium perferendis in recusandae, 
        ab facilis aperiam, suscipit porro minima? Ea, temporibus! Omnis labore cupiditate 
        nulla beatae ratione! Consequuntur, magnam numquam.
      </p>
      <button className='btn btn-info' onClick={goToContact}>Contact Us</button>
    </div>
  </div>

  <div className="mid-section">
    <h1>FEATURES</h1>

    <div className="features">

    <div className="feature">
        <div className="icon">
            <i className="fa-solid fa-address-card"></i>
        </div>
        <div className="content">
            <h3>User Profiles</h3>
            <p>Allow users to create personalized profiles, showcasing their authored 
                blogs, engagement metrics, and preferences, fostering a sense of 
                community and individuality.
            </p>
        </div>
    </div>

    <div className="feature">
        <div className="icon">
            <i className="fa-solid fa-book-atlas"></i>
        </div>
        <div className="content">
            <h3>Dynamic Content</h3>
            <p> Implement a flexible categorization system, enabling bloggers to 
                organize their content into diverse categories, making navigation 
                intuitive for readers seeking specific topics.
            </p>
        </div>
    </div>

    <div className="feature">
        <div className="icon">
            <i className="fa-regular fa-comments"></i>
        </div>
        <div className="content">
            <h3>Reader Feedback System</h3>
            <p>Implement a comprehensive feedback system, allowing readers to provide ratings, comments, 
                and constructive feedback on blog posts, fostering an interactive and supportive community .
            </p>
        </div>
    </div>

    </div>

  </div>

  <div className="bottom-section">

    <div className="vision card">
        {/* <div className="image">
            <img src="../images/vision.jpg" alt=""/>
        </div> */}
        <div className="content">
            <h3>Our Vision</h3>
            <p>At BlogSphere, our vision is to create a vibrant online 
                space where readers can explore a myriad of perspectives and 
                topics. We envision a platform that embraces diversity and provides 
                a rich tapestry of content, ensuring there's something for everyone.
            </p>
        </div>
    </div>

    <div className="mission card">
        <div className="content">
            <h3>Our Mission</h3>
            <p>Our mission is to curate and deliver high-quality blogs that reflect 
                the ever-changing interests and passions of our readers. Whether 
                you're seeking insightful tech analyses, lifestyle tips, travel 
                adventures, or creative inspirations, we're on a mission to be your 
                one-stop destination for diverse and enriching content.
            </p>
        </div>
        {/* <div className="image">
            <img src="../images/mission.jpeg" alt=""/>
        </div> */}
    </div>

    <div className="values card">
        {/* <div className="image">
            <img src="../images/values.jpg" alt=""/>
        </div> */}
        <div className="content">
            <h3>Core Values</h3>
            <p>At BlogSphere, we operate based on a set of core values that 
                guide our content creation and community engagement. These values include:
                <br/>Versatility, Inclusivity, Quality, Collaboration
            </p>
        </div>
    </div>

  </div>

  <div className="team">

    <h1>MEET OUR TEAM</h1>
    <div className="persons">
    <Slider {...settings}>
        
        <div className="person card">
        <div className="small">
            <img src={"https://cdn-icons-png.flaticon.com/128/560/560277.png"} alt=""/>
            <h4>John Doe</h4>
            <p>Database Expert</p>
            <p>Ensured efficient and secure data storage, retrieval, and management, optimizing database performance.</p>
        </div>
        </div>

        <div className="person card">
          <div className="small">
            <img src={"https://cdn-icons-png.flaticon.com/128/4140/4140048.png"} alt=""/>
            <h4>Richard Roe</h4>
            <p>UI/UX Designer</p>
            <p>Crafted an engaging and user-friendly interface, enhancing the overall user experience and visual appeal.</p>
        </div>
        </div>

        <div className="person card">
        <div className="small">
            <img src={"https://cdn-icons-png.flaticon.com/128/4140/4140047.png"} alt=""/>
            <h4>Jane Doe</h4>
            <p>Web Java Developer</p>
            <p>Implemented robust backend logic and functionality using Java and dynamic behavior.</p>
        </div>
        </div>

        <div className="person card">
        <div className="small">
            <img src={"https://cdn-icons-png.flaticon.com/128/236/236832.png"} alt=""/>
            <h4>John Smith</h4>
            <p>CI/CD Engineer</p>
            <p>Established a seamless and automated Continuous Integration/Continuous Deployment pipeline.</p>
        </div>
        </div>

        <div className="person card">
        <div className="small">
            <img src={"https://cdn-icons-png.flaticon.com/128/924/924915.png"} alt=""/>
            <h4>Mr. Nobody</h4>
            <p>Selenium Master</p>
            <p>Orchestrated comprehensive automated testing using Selenium through effective test automation.</p>
        </div>
        </div>
</Slider>
    </div>

  </div>

  <Footer/>

</div>
    </Container>
  )
}

const Container = styled.div`
background-color: #eaf5ff;

.page{
  background-color: #eaf5ff;

  .header{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;

    @media(max-width: 400px){
      padding-top: 0.5rem;
    }

    h1{
      text-align: center;
      font-size: 3rem;
      font-weight: 700;

      @media(max-width: 768px){
        font-size: 2.5rem;
      }
      @media(max-width: 550px){
        font-size: 2rem;
      }
    }
  }
  
  .top-section{
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    background-color: #427baa;
    padding-block: 1rem;

    @media(max-width: 400px){
      margin-top: 0.5rem;
    }

    .content{
      width: 50%;
      color: white;
      background-color: #122b40;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 1rem;

      @media(max-width: 1000px){
        width: 70%;
      }
      @media(max-width: 400px){
        width: 90%;
        padding: 0.8rem;
      }

      h3{
        @media(max-width: 550px){
            font-size: 1.2rem;
            line-height: 1;
          }
      }

      p{
        text-align: justify;

        @media(max-width: 550px){
            font-size: 0.8rem;
        }
      }

      button{
        transition: all 0.3s;
        font-weight: 600;

        @media(max-width: 550px){
            font-size: 0.8rem;
            padding: 0.2rem 1rem;
        }
      }
      button:hover{
        transform: scale(0.9);
      }
    }
  }

  .mid-section{
    margin-block: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    h1{
      text-align: center;
      font-size: 3rem;
      font-weight: 700;

      @media(max-width: 768px){
        font-size: 2.5rem;
      }
      @media(max-width: 550px){
        font-size: 2rem;
      }
    }

    .features{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-content: center;
      align-items: center;
      width: 90%;
      gap: 1.5rem;

      @media(max-width: 800px){
        grid-template-columns: repeat(2, 1fr);
      }
      @media(max-width: 600px){
        grid-template-columns: repeat(1, 1fr);
        gap: 0.5rem;
      }


      .feature{
        min-height: 14rem;
        background-color: #427baa;
        display: flex;
        align-items: center;
        color: #fff;
        gap: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        border: 2px solid #0766AD;

        @media(max-width: 1200px){
          gap: .5rem;
        }
        @media(max-width: 600px){
          min-height: 0;
          padding: 0.5rem;
        }

        .icon{
            color: #122b40;
            height: 4rem;
            width: 4rem;
            line-height: 4rem;
            border-radius: .5rem;
            font-size: 2rem;
            margin-left: .2rem;
            background-color: white;
            text-align: center;
            padding: 0 0.8rem;
            transition: 0.3s ease-in-out;

            @media(max-width: 1200px){
              height: 2.5rem;
              width: 2.5rem;
              line-height: 2.5rem;
              font-size: 1.5rem;
              padding: 0 0.8rem 0 0.5rem;
              margin-left: 0;
            }

            @media(max-width: 1000px){
              display: none;
            }
            @media(max-width: 1000px){
              display: block;
            }
        }

        .content{

          h3{
            @media(max-width: 1200px){
              line-height: 1;
              font-size: 1.5rem;
            }
            @media(max-width: 1000px){
              line-height: 0.8;
              font-size: 1.2rem;
            }
          }

          @media(max-width: 1200px){
            line-height: 1;
          }
        }
      }

      .feature:hover .icon{
          background-color: #122b40;
          color: white;
      }

    }
  }

  .bottom-section{
    background-color: #427baa;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 1rem;
    padding: 2rem;

    @media(max-width: 768px){
      grid-template-columns: repeat(1,1fr);
    }

    .card{
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 15rem;
      padding: 1rem;

      h3{
        text-align: center;

        @media(max-width: 1100px){
          line-height: 1;
          font-weight: 900;
        }
        @media(max-width: 1100px){
          font-size: 1.2rem;
        }

        @media(max-width: 768px){
          font-size: 2rem;
        }
        @media(max-width: 500px){
          font-size: 1.2rem;
          line-height: 1;
        }
      }

      p{
        font-weight: 600;
        font-size: 1.2rem;
        text-align: justify;

        @media(max-width: 1100px){
          line-height: 1.2;
        }
        @media(max-width: 1100px){
          font-size: 1rem;
        }

        @media(max-width: 768px){
          font-size: 1.2rem;
        }
        @media(max-width: 500px){
          font-size: 1rem;
        }
      }
    }

    .vision{
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${vision});
      background-size: cover;
      background-position: center;
    }
    .mission{
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${mission});
      background-size: cover;
      background-position: center;
    }
    .values{
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${values});
      background-size: cover;
      background-position: center;
    }
  }

  .team{
    margin-block: 1rem;
    margin-bottom: 2rem;

    h1{
      text-align:center;
      font-size: 3rem;
      font-weight: 700;

      @media(max-width: 768px){
        font-size: 2.5rem;
      }
      @media(max-width: 550px){
        font-size: 2rem;
      }
    }

    .persons{
      .slick-slide{
        display: flex;
        gap: 1rem;
        div{
          margin: 0.5rem;

          @media(max-width: 650px){
            margin: 0;
          }
        }

        .person{
          background-color: #427baa;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;

          .small{

            @media(max-width: 650px){
              margin: 0 auto;
              width: 50%;
            }

            @media(max-width: 500px){
              width: 80%;
            }
          }

          @media(max-width: 768px){
            padding: 0.5rem;
            min-height: 15rem;
          }
          @media(max-width: 650px){
            min-height: 0;
          }
          
          
          img{
            background: white;
            border-radius: 50%;
            padding: 0.5rem;
            margin: 0 auto;

            @media(max-width: 1000px){
              width: 7rem;
            }
            @media(max-width: 768px){
              width: 5rem;
            }
          }

          h4{
            @media(max-width: 1000px){
              font-size: 1.2rem;
              line-height: 1;
            }
          }

          p{
            @media(max-width: 1000px){
              font-size: 0.9rem;
              margin: 0;
            }
          }
        }
      }

      
    }
  }

}
`;

export default About