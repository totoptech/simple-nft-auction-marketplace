import React from 'react';
import Buttons from './features/buttons';
import Web3ConnectionManager from './features/web3/Web3ConnectionManager';

import './App.css';

function App() {
  return (
    <Web3ConnectionManager>
      <div className="App">
        <p>This app is working on Ropsten Network.</p>
        <Buttons />
      </div>
    </Web3ConnectionManager>
  );
}

export default App;
