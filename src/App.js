import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {useServiceWorker} from "./useServiceWorker";

function App() {

  const { waitingWorker, showReload, reloadPage } = useServiceWorker();

  useEffect(() => {
    if (showReload && waitingWorker) {
      // eslint-disable-next-line no-restricted-globals
      if(confirm("New version available! Click OK to refresh."))
        reloadPage();
    }
  }, [waitingWorker, showReload, reloadPage]);




  return (
    <div className="App"  >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. <br/>
          Test CICD

        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
