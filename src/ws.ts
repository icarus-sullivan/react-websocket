
const STATES = Object.freeze({
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
});

export const EVENT = Object.freeze({
  OPEN: 'open',
  CLOSED: 'closed',
  MESSAGE: 'message',
  ERROR: 'error',
});

interface Params { 
  fn: Function, 
  url: string, 
  retry: boolean, 
  protocol?: string,
};

const ws = ({ url, fn, retry, protocol }: Params, connect: Function) => {
  const emit = fn || function() {};
  const client = new WebSocket(url, protocol);

  // bind to client, and only when we have an open connection
  const send = () => {
    if (client.readyState === STATES.OPEN) {
      return client.send.bind(client);
    }
  }

  // keepAlive
  const heartbeat = () => {
    if (client.readyState === STATES.OPEN) {
      const frame = Math.round(Math.random() * 0xFFFFFF).toString();
      client.send(frame);
      setTimeout(heartbeat, 1000);
    }
  }

  client.onerror = (error) => {
    emit({ event: EVENT.ERROR, error });
    if (retry !== false && client.readyState !== STATES.OPEN) {
      ws({ url, fn, retry, protocol }, connect);
    }
  }
  client.onopen = () => {
    heartbeat();
    emit({ 
      event: EVENT.OPEN, 
      send: send() 
    });
    connect(client);
  }

  client.onclose = ({ code, reason }) => emit({ event: EVENT.CLOSED });
  client.onmessage = ({ data }) => emit({ event: EVENT.MESSAGE, data, send: send() });
};

export default ws;