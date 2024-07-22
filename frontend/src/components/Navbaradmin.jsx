import React, { useContext, useEffect } from 'react';
import { mycontext } from './Context';
import { Link, useNavigate } from 'react-router-dom';
import './navbaradmin.css'; // Make sure to adjust the CSS import based on your file structure

function Navbaradmin() {
    const { setLogUser } = useContext(mycontext);
    const nav = useNavigate();

    function logoutBtn() {
        setLogUser({ token: null, user: null ,previousAddresses:null,orders:null});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('previousAddresses')
        localStorage.removeItem('orders')
       
        alert('Logout successful !!!');
        nav('/');
    }

    return (
        <div className='admin-container'>
            <div className='navbars'>
                <h2 className='title'>Admin Home</h2>
                <div className='nav-links'>
                    <Link to='/adminhome' className='nav-link'>Admin Page</Link>
                    <button className="logout-button" onClick={logoutBtn}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Navbaradmin;
