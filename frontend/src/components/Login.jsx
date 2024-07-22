import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { mycontext } from './Context';
import './all.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setLogUser } = useContext(mycontext);
  const navigate = useNavigate();

  async function loginBtn() {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.user.banned) {
        setError('This account is banned. Please contact support.');
        return;
      }

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setLogUser({ token: response.data.token, user: response.data.user });
        alert('Login successful!');
        if (response.data.user.role === 'admin') {
          navigate('/adminhome');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login-container" style={{marginTop:"5%"}}>
      <h1>Login page</h1>
      <div className="login-form">

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='login-btnn' onClick={loginBtn}>Login</button>
        {error && <p className="error-message">{error}</p>}
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}

export default Login;
