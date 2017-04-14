import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { load } from 'redux/modules/room';
import { asyncConnect } from 'redux-async-connect';
import RoleAwareComponent from 'helpers/RoleAwareComponent';

@asyncConnect([{
  promise: ({
    store: { dispatch },
    params: { id },
    location: { search }}
  ) => {
    return dispatch(load(id, search));
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    room: state.room.data,
    error: state.room.loadError,
    permission: state.room.permission
  })
)
export default class Room extends RoleAwareComponent {

  static propTypes = {
    user: PropTypes.object,
    room: PropTypes.object,
    permission: PropTypes.object,
    params: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  state = {
    message: '',
    messages: []
  };

  componentDidMount() {
    if (socket) {
      socket.emit('JOIN_ROOM', this.props.params.id);

      socket.on('MESSAGE', this.onMessageReceived);
      socket.on('INIT', this.onInit);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('MESSAGE', this.onMessageReceived);
      socket.removeListener('INIT', this.onInit);
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
        author: this.props.user && this.props.user.username || 'Anonymous',
        text: msg
      });
    }
  };

  render() {
    const { room, error } = this.props;
    const style = require('./Room.scss');
    const margin = { marginTop: 30 };

    return error ? (<div>ERROR: {error.message}</div>) : (
      <div className={style.room}>
        <Helmet title="Room"/>
        <h1 className={style}>{ `Room ${room.title}` }</h1>

        <div>
          <ul style={ margin } ref="messages">
          {this.state.messages.map((msg) => {
            return msg ? <li key={`room.msg.${msg._id}`}>{msg.author}: {msg.text}</li> : '';
          })}
          </ul>
          { this.hasPermission('write') &&
            <form className="login-form" onSubmit={this.handleSubmit}>
              <input type="text"
                   ref="message"
                   placeholder="Enter your message"
                   value={this.state.message}
                   onChange={ (event) => this.setState({message: event.target.value}) }
              />
              <button className="btn" onClick={ this.handleSubmit }>Send</button>
            </form>
          }
        </div>
      </div>
    );
  }
}
