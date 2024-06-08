import {BrowserRouter as Router, Route} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegister";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cat from "./pages/Cat";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import OSummary from "./pages/OSummary";
import MyOrders from "./pages/MyOrders";

import DelLogReg from "./pages/DelLogReg";
import AdminHome from "./pages/AdminHome";
import AdminProducts from "./pages/AdminProducts";
import AdminEditProduct from "./pages/AdminEditProduct";

import DeliveryHome from "./pages/DeliveryHome";

function App() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <Router>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/login' component={LoginRegister}></Route>
          <Route exact path='/profile' component={Profile}></Route>
          <Route excact path='/about' component={About}></Route>
          <Route exact path='/contact' component={Contact}></Route>
          <Route exact path='/cat' component={Cat}></Route>
          <Route exact path='/product' component={ProductPage}></Route>
          <Route exact path='/cart' component={Cart}></Route>
          <Route exact path='/ordersummary' component={OSummary}></Route>
          <Route exact path='/myorders' component={MyOrders}></Route>

          <Route exact path="/dellogin" component={DelLogReg}></Route>

          <Route exact path='/admin' component={AdminHome}></Route>
          <Route exact path='/products' component={AdminProducts}></Route>
          <Route exact path='/editproduct' component={AdminEditProduct}></Route>

          <Route exact path='/delivery' component={DeliveryHome}></Route>
        </Router>
        <ToastContainer
        position='top-center'
        pauseOnHover={false}
        closeOnClick={true}
        theme="colored"/>
      </div>
    </div>
  );
}

export default App;
