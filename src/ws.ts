
const STATES = Object.freeze({
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
});

const EVENTS = Object.freeze({
  OPEN: 'open',
  CLOSED: 'closed',
  MESSAGE: 'message',
  ERROR: 'error',
});

export default (url: string, fn: Function, protocol?: string) => {
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

  client.onerror = (error) => emit({ event: EVENTS.ERROR, error });
  client.onopen = () => {
    heartbeat();
    emit({ 
      event: EVENTS.OPEN, 
      send: send() 
    });
  }

  client.onclose = () => emit({ event: EVENTS.CLOSED });
  client.onmessage = ({ data }) => emit({ event: EVENTS.MESSAGE, data, send: send() });
  return client;
};