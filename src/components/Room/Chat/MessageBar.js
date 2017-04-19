import React, {PropTypes, Component} from 'react';
import moment from 'moment';

export default class Room extends Component {

  static propTypes = {
    message: PropTypes.object.isRequired,
    isOwn: PropTypes.bool.isRequired
  };

  getOwnHeaderComponent(authorName, createdAt) {
    return (
      <div className="header">
        <small className="text-muted">
          <i className="fa fa-clock-o"/>&nbsp;{createdAt}
        </small>
        <strong className="pull-right primary-font">{authorName}</strong>
      </div>
    )
  }

  getOthersHeaderComponent(authorName, createdAt) {
    return (
      <div className="header">
        <strong className="primary-font">{authorName}</strong>
        <small className="pull-right text-muted">
          <i className="fa fa-clock-o"/>&nbsp;{createdAt}
        </small>
      </div>
    )
  }

  render() {
    const {message, isOwn} = this.props;
    const createdAt = moment(message.createdAt).fromNow();
    const style = require('./Chat.scss');
    const side = isOwn ? 'right' : 'left';

    return (
      <li className={`${style[side]} clearfix`}>
        <span className={`chat-img pull-${side}`}>
            <img
              src="http://placehold.it/50/FA6F57/fff&text=ME"
              alt="User Avatar"
              className="img-circle"/>
        </span>
        <div className={style['chat-body']}>
          {
            isOwn
              ? this.getOwnHeaderComponent(message.authorName, createdAt)
              : this.getOthersHeaderComponent(message.authorName, createdAt)
          }
          <p>{message.text}</p>
        </div>
      </li>
    )
  }
}