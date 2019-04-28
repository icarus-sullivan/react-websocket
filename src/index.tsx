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
    client = client || ws({ fn: on, ...rest });

    return () => {
      if (client) { client.close(); }
    }
  });

  return (
    <React.Fragment>{children}</React.Fragment>
  );
}

export default Websocket;