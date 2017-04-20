import React, {PropTypes, Component} from 'react';
import MessageBar from './MessageBar';

export default class Room extends Component {

  static propTypes = {
    userId: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    sendMessage: PropTypes.func.isRequired,
    blockHeight: PropTypes.number.isRequired
  };

  state = {
    message: ''
  };

  handleSubmit = event => {
    event.preventDefault();

    const msg = this.state.message;

    if (msg) {
      this.props.sendMessage(msg);
      this.setState({ message: '' });
    }
  };

  render() {
    const { messages, userId, blockHeight } = this.props;
    const style = require('./Chat.scss');

    return (
      <div className={`${style['chat-container']} panel panel-default`}>
        <div className="panel-heading">
          Chat {/* Close btn */}
        </div>
        <div
          style={{height: `${blockHeight}px`}}
          className={`panel-body ${style['panel-body']}`}>
          <ul className={style.chat} ref="messages">
            { Array.isArray(messages) && messages.map((msg, index) =>
                <MessageBar
                  key={`room.msg.${msg._id}`}
                  isOwn={userId == msg.authorId}
                  message={msg}
                />
            )}
          </ul>
        </div>
        <div className="panel-footer">
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <input
                id="btn-input"
                type="text"
                ref="message"
                className="form-control input-sm"
                value={this.state.message}
                onChange={event => this.setState({message: event.target.value})}
                placeholder="Type your message here..." />
              <span className="input-group-btn">
                  <button
                    className="btn btn-info btn-sm"
                    id="btn-chat"
                    onClick={ this.handleSubmit }>
                    Send
                  </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
