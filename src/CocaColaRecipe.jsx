import React, { useEffect, useState } from 'react';

const CocaColaRecipe = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/cokeFormula')
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setMessage(`${res.error}: ${res.message}`);
        } else {
          setMessage(res.message);
        }
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default CocaColaRecipe;
