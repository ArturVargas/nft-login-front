import React from 'react';

const ButtonExplorer = (txHash) => {
  return(
    <div style={{ marginTop: '10px' }}>
      <a target="_blank" href={`https://mumbai.polygonscan.com/tx/${txHash}`} rel="noreferrer">Ver en el explorador</a>
    </div>
  );
};

export default ButtonExplorer;
