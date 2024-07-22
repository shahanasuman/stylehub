import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import { MyContextProvider } from './components/Context'; // Import MyContextProvider
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import { myproducts } from './components/Myproducts';
import MenProduts from './components/MenProduts';
import Womenproduts from './components/Womenproducts';
import Kidproduts from './components/Kidproduts';
import Viewproduct from './components/Viewproduct';
import Newcarts from './components/Newcarts';
import Adminhome from './components/Adminhome';
import Allproducts from './components/Allproducts';
import Alluser from './components/Alluser';
import Buypage from './components/Buypage';
import OrderSummaryPage from './components/OrderSummaryPage';
import AllOrdersPage from './components/AllOrdersPage '


function App() {
    const products = myproducts; // I assume myproducts is a mock data array

    return (
        <div className="App" style={{backgroundColor:'white',marginBottom:"10%"}}>
            <Router>
                <MyContextProvider> {/* Wrap everything inside MyContextProvider */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/men" element={<MenProduts />} />
                        <Route path="/women" element={<Womenproduts />} />
                        <Route path="/kid" element={<Kidproduts />} />
                        <Route path="/productview/:id" element={<Viewproduct />} />
                        <Route path="/newcarts" element={<Newcarts />} />
                        <Route path="/adminhome" element={<Adminhome />} />
                        <Route path="/alluser" element={<Alluser />} />
                        <Route path="/allproducts" element={<Allproducts />} />
                        <Route path="/Buypage" element={<Buypage/>} />
                        <Route path="/orders" element={<OrderSummaryPage/>} />
                        <Route path="/allorders" element={<AllOrdersPage />} /> 
                    </Routes>
                </MyContextProvider>
            </Router>
        </div>
    );
}

export default App;
