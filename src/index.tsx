import * as React from 'react';

const OPEN_STATE = 1;

export const EVENT = Object.freeze({
  OPEN: 'open',
  CLOSED: 'close',
  MESSAGE: 'message',
  ERROR: 'error',
});

interface Props { 
  on: Function,
  url: string,
  retry: boolean,
  protocol?: string,
  children: React.ReactNode | React.ReactNode[]
};

export default class Websocket extends React.PureComponent<Props, {}> {
  client: WebSocket | undefined;
  heartbeat: number | undefined;
  constructor(props: Props) {
    super(props);

    this.client = undefined;
    this.heartbeat = undefined;
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.clear();
  }

  start = () => {
    const { url, protocol } = this.props;
    try {
      this.client = new WebSocket(url, protocol);
      this.client.onopen = this.open;
      this.client.onclose = this.closed;
      this.client.onmessage = this.message;
      this.client.onerror = this.error;
    } catch (e) {
      // some websockets will throw an error with SECURITY_ERROR
      this.emit({ event: EVENT.ERROR, error: e });
    }
  }

  clear = () => {
    clearInterval(this.heartbeat);
    if (this.client) this.client.close();
  }

  emit = (args: any) => {
    if (this.props.on) this.props.on(args);
  }

  send = (msg: any) => {
    if (this.client) this.client.send(msg);
  }

  keepalive = () => {
    if (this.client && this.client.readyState === OPEN_STATE) {
      this.send(`${0x9}`); // ping
    }
  }

  open = () => {
    this.heartbeat = setInterval(this.keepalive, 1000);
    this.emit({
      send: this.send,
      event: EVENT.OPEN,
    });
  }

  closed = ({ code, reason }: any) => {
    this.emit({ event: EVENT.CLOSED, code, reason });
    this.clear();
  }

  message = ({ data }: any) => this.emit({
    send: this.send,
    event: EVENT.MESSAGE,
    data,
  });

  error = (error: any) => {
    this.emit({ event: EVENT.ERROR, error });
    this.clear();

    if (this.props.retry !== false) {
      this.start();
    }
  }

  render() {
    return (<React.Fragment>{this.props.children}</React.Fragment>);
  }

};