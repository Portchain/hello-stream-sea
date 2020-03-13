import React, { useEffect, useState } from 'react';
import './App.css';
import * as streamSea from 'stream-sea-client'
import styled from 'styled-components';
import JSONTree from 'react-json-tree';

const subscribeToStreamSea = async (cb: (msg: any) => void) => {
  let subscription
  if (process.env.REACT_APP_JWT){
    subscription = await streamSea.subscribeWithJwt({
      stream: process.env.REACT_APP_STREAM_NAME!,
      clientId: process.env.REACT_APP_CLIENT_ID!,
      jwt: process.env.REACT_APP_JWT!,
      remoteServerHost: process.env.REACT_APP_REMOTE_SERVER_HOST!,
      remoteServerPort: process.env.REACT_APP_REMOTE_SERVER_PORT || '443',
      secure: !!process.env.REACT_APP_SECURE,
      fanout: true,
    })
  } else {
    subscription = await streamSea.subscribe({
      stream: process.env.REACT_APP_STREAM_NAME!,
      clientId: process.env.REACT_APP_CLIENT_ID!,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET!,
      remoteServerHost: process.env.REACT_APP_REMOTE_SERVER_HOST!,
      remoteServerPort: process.env.REACT_APP_REMOTE_SERVER_PORT || '443',
      secure: !!process.env.REACT_APP_SECURE,
      fanout: true,
    })
  }
  subscription.on('message', (msg: any) => cb(msg))
  subscription.on('error', (err: any) => console.error(err))
  subscription.on('close', () => console.log('Connection closed'))
}

const AppContainer = styled.div`
  margin-left: 12px;
  margin-top: 12px;
`
const MessageListContainer = styled.div`
  width: 800px;
  background-color: rgb(0, 43, 54);
  padding-left: 1px;
  padding-top: 1px;
  padding-bottom: 1px;
`

const ConfigurationInfoContainer = styled.div`
  width: 800px;
  box-sizing: border-box;
  border: 1px solid #000000;
  border-radius: 6px;
  padding: 4px;
  margin-bottom: 8px;
`

const Title = styled.h1`
  margin-top: 0px;
  margin-bottom: 0px;
`

const ConfigText = styled.p`
  margin-top: 0px;
  margin-bottom: 0px;
`

const PrimaryButton = styled.div`
  background-color: #ff0000;
  color: #ffffff;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`

function App() {
  const [messages, setMessages] = useState<any[]>([])
  useEffect(() => {
    subscribeToStreamSea(msg => {
      setMessages(messages => messages.concat(msg))
    })
  }, [])
  return <AppContainer>
    <ConfigurationInfoContainer>
      <Title>Stream-Sea Demo</Title>
      <ConfigText>stream: <b>{process.env.REACT_APP_STREAM_NAME}</b></ConfigText>
      <ConfigText>clientId: <b>{process.env.REACT_APP_CLIENT_ID}</b></ConfigText>
      <ConfigText>remoteServerHost: <b>{process.env.REACT_APP_REMOTE_SERVER_HOST!}</b></ConfigText>
      <ConfigText>remoteServerPort: <b>{process.env.REACT_APP_REMOTE_SERVER_PORT || '443'}</b></ConfigText>
      <ConfigText>secure: <b>{(!!process.env.REACT_APP_SECURE).toString()}</b></ConfigText>
      <PrimaryButton
        style={{width: '200px', height: '24px', lineHeight: '24px'}}
        onClick={() => setMessages([])}
      >
        Clear messages
      </PrimaryButton>
    </ConfigurationInfoContainer>
    <MessageListContainer>
      {messages.map((msg, idx) =>
        <JSONTree 
          key={idx}
          data={msg}
          labelRenderer={keys => <span>{keys.length === 1 ? 'message' : keys[0]}</span>}
          shouldExpandNode={() => false}
        />
      )}
    </MessageListContainer>
  </AppContainer>
}

export default App;
