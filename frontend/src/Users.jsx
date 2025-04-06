import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of users from the PHP backend
    axios.get('http://localhost/Licenta/backend/connection.php')
      .then((response) => {
        setUsers(response.data);  // Store the users in the state
        setLoading(false);  // Set loading to false when data is fetched
      })
      .catch((err) => {
        setError(err.message);  // Handle any errors
        setLoading(false);  // Set loading to false in case of error
      });
  }, []);  // Empty dependency array means it runs only once when the component mounts

  if (loading) {
    return <div>Loading users...</div>;  // Show a loading message while fetching
  }

  if (error) {
    return <div>Error: {error}</div>;  // Show an error message if something goes wrong
  }

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>  {/* Use unique identifier (e.g., user.id) as key */}
            <p>ID: {user.id}</p>
            <p>Name: {user.first_name}</p>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
