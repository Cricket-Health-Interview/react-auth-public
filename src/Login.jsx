import React, { useState } from 'react';
import { Redirect } from 'react-router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleInputChange = (event) => {
    event.preventDefault();
    const { value, name } = event.target;
    if (name === 'username') {
      setUsername(value);
    }
    if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/authenticate', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 200) {
          setShouldRedirect(true);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Error logging in please try again');
      });
  };

  return (
    <>
      {shouldRedirect && <Redirect to="/" />}
      <form onSubmit={onSubmit}>
        <h1>Login Below!</h1>
        <input
          type="username"
          name="username"
          placeholder="Enter username"
          value={username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={password}
          onChange={handleInputChange}
          required
        />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Login;
