import * as React from 'react';

const OPEN_STATE = 1;

interface Props { 
  onError: Function,
  onOpen: Function,
  onClose: Function,
  onMessage: Function,
  url: string,
  retry: boolean,
  protocol?: string,
  children: Function,
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
      this.error(e);
    }
  }

  clear = () => {
    clearInterval(this.heartbeat);
    if (this.client) this.client.close();
    this.client = undefined;
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
    this.props.onOpen({
      send: this.send,
    });
  }

  closed = ({ code, reason }: any) => {
    this.props.onClose({ code, reason });
    this.clear();
  }

  message = ({ data }: any) => {
    this.props.onMessage({
      send: this.send,
      data,
    })
  }

  error = (error: any) => {
    this.props.onError(error);
    if (this.props.retry !== false) {
      this.start();
    }
  }

  render() {
    const { children } = this.props;
    if (!children || typeof children !== 'function') {
      throw new Error(`Websocket Component requires the immediate child to be a function`);
    }
    return children({ send: this.send, close: this.clear });
  }

};
