import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mycontext } from "./Context";
import cartplus from './icon/cart-plus-solid.svg';
import carticon from './icon/cart-shopping-solid.svg';
import heart1 from './icon/heart1.svg';
import heart from './icon/heart-solid.svg';
import Navbar from './Navbar';
import Footer from './Footer';
import './page.css';

const KidProducts = () => {
    const { products, like, cart, setCart, LogUser, handleLike, handleCart } = useContext(mycontext);
    const [searchQ, setSearchQ] = useState("");
    const [filtered, setFiltered] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const prod = products.filter(data => data.category === 'kids');
        setFiltered(prod);
    }, [products]);

    function handleChange(e) {
        const query = e.target.value;
        setSearchQ(query);
        const filtered = products.filter(pdt => {
            const { category, name, price, color } = pdt || {}; 
            return (
                category === 'kids' &&
                (
                    (name && name.toLowerCase().includes(query.toLowerCase())) ||
                    (price && price.toString().includes(query)) ||
                    (color && color.toLowerCase().includes(query.toLowerCase()))
                )
            );
        });
        setFiltered(filtered);
    }

    function handleViewProduct(productId) {
        navigate(`/productview/${productId}`);
    }

    function likel(itemId) {
        if (!LogUser.token) {
            alert('Please log in to like/unlike the item!');
            navigate('/login');
            return;
        }
        handleLike(itemId);
    }

    async function cartl(itemId) {
        if (!LogUser.token) {
            alert('Please log in to add/remove the item from the cart!');
            navigate('/login');
            return;
        }
    
        try {
            const isInCart = cart.some(cartItem => cartItem._id === itemId);
            
            if (isInCart) {
                // Remove from cart
                await handleCart(itemId, false);
                setCart(prevCart => prevCart.filter(item => item._id !== itemId));
            } else {
                // Add to cart
                const product = products.find(item => item._id === itemId);
                await handleCart(itemId, true);
                setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
            }
        } catch (error) {
            console.error("Failed to update cart:", error.message);
            alert("Failed to update cart. Please try again later.");
        }
    }
    
    return (
        <div className='aa'>
            <div className='cc'>
                <Navbar />
                <input type="text" onChange={handleChange} value={searchQ} placeholder='Search here' style={{ width: "300px", marginTop: "7%" }} />
            </div>
            {filtered.length === 0 ? (
                <h2 className="not-found">Item not found</h2>
            ) : (
                filtered.map(item => (
                    <div className='zz' key={item._id}>
                        <img src={item.imageUrl} alt='Image' width={200} height={310} onClick={() => handleViewProduct(item._id)} />
                        <p>{item.price}</p>
                        <p>{item.name}</p>
                        <button onClick={() => likel(item._id)}>
                            {like.includes(item._id) ? <img src={heart} alt='Liked' /> : <img src={heart1} alt='Unliked' />}
                        </button>
                        <button onClick={() => cartl(item._id)}>
                            {cart.some(cartItem => cartItem._id === item._id) ? <img src={carticon} alt='In Cart' /> : <img src={cartplus} alt='Not in Cart' />}
                        </button>
                    </div>
                ))
            )}
            <Footer />
        </div>
    );
}

export default KidProducts;
