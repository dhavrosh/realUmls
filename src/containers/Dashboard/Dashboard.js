import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { ChatPanel, ChatModal } from 'components';
import {
  isLoaded,
  load as loadChatRooms,
  save as saveChatRooms,
  remove as removeChatRoom
} from 'redux/modules/chatRooms';

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
}), { saveChatRooms, removeChatRoom, pushState: push })
export default class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object,
    chatRooms: PropTypes.array,
    saveChatRooms: PropTypes.func,
    removeChatRoom: PropTypes.func,
    pushState: PropTypes.func
  };

  state = {
    modal: { show: false, data: null }
  };

  showChatModal() {
    this.setState({
      modal: { ...this.state.modal, show: true }
    });
  }

  close() {
    this.setState({
      modal: { data: null, show: false }
    });
  }

  render() {
    const { user, chatRooms, saveChatRooms: saveAction } = this.props;
    const margin = { margin: '30px -15px' };
    const noMargin = { margin: 0 };

    return (user &&
      <div>
        <Helmet title="Dashboard"/>
        <div className="row" style={ margin }>
          <div className="col-md-9 col-sm-9 col-xs-9">
            <h1 style={ noMargin }>Dashboard</h1>
          </div>
          <div className="col-md-3 col-sm-3 col-xs-3">
            <button className="btn btn-info pull-right"
                    onClick={ this.showChatModal.bind(this) }>
              Create
            </button>
          </div>
        </div>
        <div>
          <div className="row">
          { chatRooms && (chatRooms.length && chatRooms.map(room => {
            const editAction = event => { event.stopPropagation(); this.setState({ modal: { data: room, show: true }}); };
            const removeAction = event => { event.stopPropagation(); this.props.removeChatRoom(room._id); };
            const redirectAction = () => this.props.pushState(`/chat/${ room._id }`);
            return (
                <div className="col-md-4" key={ room._id }>
                    <ChatPanel
                      title={ room.title }
                      edit={ editAction }
                      remove={ removeAction }
                      redirect={ redirectAction }>
                      { room.description }
                    </ChatPanel>
                </div>
             );
          }) || <div className="col-md-12">Press 'Create' to add chats to your Dashboard</div>)
          }
          </div>
        </div>
        <ChatModal
          showModal={ this.state.modal.show }
          data={ this.state.modal.data }
          close={ this.close.bind(this) }
          saveChatRoom={ saveAction }
        />
      </div>
    );
  }
}
