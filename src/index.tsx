import * as React from 'react';
import ws from './ws';

interface Props { 
  on: Function,
  url: string,
  retry: boolean,
  protocol?: string,
  children: React.ReactNode | React.ReactNode[]
};

const Websocket = ({ children, on, ...rest }: Props) => {
  let client: any;
  React.useEffect(() => {
    if (!client) {
      ws({ fn: on, ...rest }, (cli: WebSocket) => {
        // during retries client will be updated with the callback
        client = cli;
      });
    }

    return () => {
      if (client) { client.close(); }
    }
  });

  return (<React.Fragment>{children}</React.Fragment>);
}

export default Websocket;