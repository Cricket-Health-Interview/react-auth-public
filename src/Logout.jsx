import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  const [cookiesCleared, setCookiesCleared] = useState(false);

  useEffect(() => {
    fetch('/logout').then(() => setCookiesCleared(true));
  }, []);

  return (
    <>
      <div>Logging out...</div>
      {cookiesCleared && <Redirect to="/" />}
    </>
  );
};

export default Logout;
