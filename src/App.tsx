import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as streamSea from 'stream-sea-client'

const subscribeToStreamSea = async () => {
  const subscription = await streamSea.subscribe({
    stream: process.env.REACT_APP_STREAM_NAME!,
    appId: process.env.REACT_APP_APP_ID!,
    appSecret: process.env.REACT_APP_APP_SECRET!,
    remoteServerHost: process.env.REACT_APP_REMOTE_SERVER_HOST!,
    remoteServerPort: '443',
    secure: true,
  })
  subscription.on('message', (msg:any) => {
    console.log(JSON.stringify(msg))
  })
  subscription.on('error', (err:any) => console.error(err))
  subscription.on('close', () =>console.log('Connection closed'))
}

function App() {
  useEffect(() => {subscribeToStreamSea()}, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
