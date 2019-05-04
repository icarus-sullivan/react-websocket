![npm downloads total](https://img.shields.io/npm/dt/@lawcket/react-websocket.svg) ![npm version](https://img.shields.io/npm/v/@lawcket/react-websocket.svg) ![npm license](https://img.shields.io/npm/l/@lawcket/react-websocket.svg)

# @lawcket/react-websocket
A slim Websocket implementation for React 16+. The libray uses the standard browser WebSocket so 'should' be supported in React-Native.

### Installation
```
npm install --save @lawcket/react-websocket
```
or
```
yarn add @lawcket/react-websocket
```

### Usage
Example:
```
import React, { useState } from 'react';
import Websocket from '@lawcket/react-websocket';

const Messages = () => {
  const [messages, addMessage] = useState([]);
  return (
    <Websocket 
      url='wss://...' 
      retry
      onOpen={({ send }) => console.log('open')}
      onClose={({ code, reason }) => console.log('closed', code, reason)}
      onMessage={({ send, data }) => console.log('message', data)}
      onError={(error) => console.log('error', error)} >
      {({ send, close }) => {
        return (
            <pre>{JSON.stringify(messages, null, 2)}</pre>
        );
      }}
    </Websocket>
  );
}
```

### PropTypes
|Name|Type|Description | Default|
|-----|-----|-----|---|
| url | string | The websocket url to connect to | |
| protocol | string | The protocol for the websocket to use | |
| retry | boolean | If an error occurs, should it reconnect | true | 
| onOpen | function | Notifies when the connection has been opened | |
| onMessage | function | Notifies when an incoming message has been received | |
| onClose | function | Notifies the connection was closed | |
| onError | function | Notifies of an error with the connection, will close the connection | |

### onOpen
|Parameter|Type|Description |
|-----|-----|-----|
| send | function(any) | A function to send data to the server | 

### onMessage
|Parameter|Type|Description |
|-----|-----|-----|
| data | any | Incoming message (usually stringified JSON data) |
| send | function(any) | A function to send data to the server | 
    
### onError
|Parameter|Type|Description |
|-----|-----|-----|
| error | Error | The error that occured during connection or usage |


### onClose

Reference: [Close codes & reasons](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)

|Parameter|Type|Description |
|-----|-----|-----|
| code | number | The close code sent by the server |
| reason | string | The reason the connection was closed |

   