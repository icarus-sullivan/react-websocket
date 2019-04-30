![npm downloads total](https://img.shields.io/npm/dt/@lawcket/react-websocket.svg) ![npm version](https://img.shields.io/npm/v/@lawcket/react-websocket.svg) ![npm license](https://img.shields.io/npm/l/@lawcket/react-websocket.svg)

# @lawcket/react-websocket
A slim Websocket implementation for React 16+. The libray uses the standard browser WebSocket so 'should' be supported in React-Native, it also uses *React.Fragment* and does not create a new div element.

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
import Websocket, { EVENT } from '@lawcket/react-websocket';

const Messages = () => {
  const [messages, addMessage] = useState([]);
  return (
    <Websocket 
      url='wss://...' 
      on={({ event, data, ...rest }) => {
        if (event === EVENT.MESSAGE && data) {
          const message = JSON.parse(data);
          addMessage([...messages, message]);
        }
      }}>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
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
| on | function | A listener for events from the websocket | |

### Events
All incoming events will contain an `event` property. Further event properties are dependent on the event associated.

**open**
|Name|Type|Description |
|-----|-----|-----|
| event | 'open' | The websocket is connected and is ready for communication |
| send | function(any) | A function to send data to the server | 

**message**
|Name|Type|Description |
|-----|-----|-----|
| event | 'message' | The websocket has received a message |
| data | any | Incoming message (usually stringified JSON data) |
| send | function(any) | A function to send data to the server | 
    
**error**
|Name|Type|Description |
|-----|-----|-----|
| event | 'error' | An error has occured |
| error | Error | The error that occured during connection or usage |

 **close**
 Reference: [Close codes & reasons](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent)
|Name|Type|Description |
|-----|-----|-----|
| event | 'close' | The websocket connection has closed |
| code | number | The close code sent by the server |
| reason | string | The reason the connection was closed |

   