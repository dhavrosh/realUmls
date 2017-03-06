import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import { ChatPanel } from 'components';
import { isLoaded, load as loadChatRooms, save as saveChatRooms } from 'redux/modules/chatRooms';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(loadChatRooms());
    }
  }
}])
@connect(state => ({
  user: state.auth.user,
  chatRooms: state.chatRooms.data
}), { saveChatRooms })
export default
class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object,
    chatRooms: PropTypes.array,
    saveChatRooms: PropTypes.func
  };

  addChatRoom() {
    const title = this.refs.title;
    const description = this.refs.description;

    this.props.saveChatRooms(title.value, description.value);

    title.value = '';
    description.value = '';
  }

  render() {
    const { user, chatRooms } = this.props;

    return (user &&
      <div className="container">
        <Helmet title="Dashboard"/>
        <h1>Dashboard</h1>
        <div>
          {/* <p>Hi, {user.username}. You have just successfully logged in, and you're welcome in our service! Let's have some fun!</p>*/}
          <input ref="title" type="text"/>
          <input ref="description" type="text"/>
          <button onClick={ this.addChatRoom.bind(this) }>Add chat room</button>
          <div className="row">
          { chatRooms.map(room =>
            <div className="col-md-3" key={ room._id }>
              <ChatPanel title={ room.title }>
                { room.description }
              </ChatPanel>
            </div>
          ) }
          </div>
        </div>
      </div>
    );
  }
}
