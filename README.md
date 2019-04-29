![npm downloads total](https://img.shields.io/npm/dt/@lawcket/react-websocket.svg) ![npm version](https://img.shields.io/npm/v/@lawcket/react-websocket.svg) ![npm license](https://img.shields.io/npm/l/@lawcket/react-websocket.svg)

# @lawcket/react-websocket
A slim React Websocket implementation for React 16.8+

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
| retry | boolean | If an error occurs, should it try to reconnect | false | 
| on | function | A listener for events from the websocket | |

### Events
All incoming events will contain an `event` property. Further event properties are dependent on the event associated.

- OPEN 

    ```
    {
        event: 'open',
        send: fn(send_to_server), 
    }
    ```
    
- MESSAGE

    ```
    {
        event: 'message',
        send: fn(send_to_server), 
        data: any, // usually stringified JSON data
    }
    ```

- ERROR

    ```
    {
        event: 'error',
        error: Error
    }
    ```
    
- CLOSE

    ```
    {
        event: 'closed',
        code: number,
        reason: string,
    }
    ```