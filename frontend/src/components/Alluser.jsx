import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbaradmin from './Navbaradmin';
import { mycontext } from './Context';
import './alluser.css'; // Import CSS file for styling

const AllUsers = () => {
  const { fetchUsers } = useContext(mycontext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data); // Update all users
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsersData();
  }, []);

  const handleToggleBan = async (userId, isBanned) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/admin/users/${userId}/ban`,
        { banned: !isBanned },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Toggle ban response:', response.data);
  
      // Update users state to reflect the new ban status
      const updatedUsers = users.map(user => {
        if (user._id === userId) {
          return { ...user, banned: !isBanned };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to toggle user ban status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')){
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Delete user response:', response.data);

      // Remove deleted user from state
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };}

  return (
    <div className="all-users">
      <Navbaradmin />
      <div className='alluser'>
        <h2>All Users</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.banned ? 'Banned' : 'Active'}</td>
                  <td>
                    <button onClick={() => handleToggleBan(user._id, user.banned)} className={user.banned ? 'btn-unban' : 'btn-ban'}>
                      {user.banned ? 'Unban' : 'Ban'}
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
