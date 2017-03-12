import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';

@connect(state => ({ user: state.auth.user }))
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object,
    params: PropTypes.object
  };

  state = {
    message: '',
    messages: []
  };

  componentDidMount() {
    if (socket) {
      socket.emit('JOIN_ROOM', this.props.params.id);

      socket.on('NEW_PARTICIPANT', () => console.log('New Participant'));
      socket.on('MESSAGE', this.onMessageReceived);
      socket.on('INIT', this.onInit);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('MESSAGE', this.onMessageReceived);
    }
  }

  onInit = messages => {
    if (this.refs.messages) {
      this.setState({ messages });
    }
  };

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({ messages });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const msg = this.state.message;
    const roomId = this.props.params.id;

    if (msg) {
      this.setState({ message: '' });
      socket.emit('MESSAGE', roomId, {
        from: this.props.user && this.props.user.username || 'Anonymous',
        text: msg
      });
    }
  };

  render() {
    const style = require('./Chat.scss');
    const margin = { marginTop: 30 };

    return (
      <div className={style.chat}>
        <Helmet title="Chat"/>
        <h1 className={style}>Chat</h1>

        <div>
          <ul style={ margin } ref="messages">
          {this.state.messages.map((msg) => {
            return msg ? <li key={`chat.msg.${msg.id}`}>{msg.from}: {msg.text}</li> : '';
          })}
          </ul>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input type="text" ref="message" placeholder="Enter your message"
             value={this.state.message}
             onChange={ (event) => this.setState({ message: event.target.value }) }/>
            <button className="btn" onClick={ this.handleSubmit }>Send</button>
          </form>
        </div>
      </div>
    );
  }
}
