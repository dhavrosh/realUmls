import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import {load} from 'redux/modules/room';
import {asyncConnect} from 'redux-async-connect';
import RoleAwareComponent from 'helpers/RoleAwareComponent';
import {Chat, Diagram} from 'components';
import {
  getHeight as getWindowHeight,
  getWidth as getWindowWidth,
  getElementHeight
} from 'helpers/Window';

@asyncConnect([{
  promise: ({
              store: {dispatch},
              params: {id},
              location: {search}
            }) => {
    return dispatch(load(id, search));
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    room: state.room.data,
    error: state.room.loadError,
    permission: state.room.permission,
    authenticationRequired: state.room.authenticationRequired,
    isAnonymRegistered: state.room.isAnonymRegistered
  }), { pushState: push }
)
export default class Room extends RoleAwareComponent {

  static propTypes = {
    user: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    permission: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    authenticationRequired: PropTypes.bool.isRequired,
    pushState: PropTypes.func.isRequired,
    isAnonymRegistered: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.DIAGRAM_MIN_WIDTH = 800;
    this.COL_SM_MAX = 991;
    this.MARGIN_CONST = 180;
    this.DEFAULT_BLOCK_HEIGHT = 450;
  }

  state = {
    message: '',
    blockHeight: this.DEFAULT_BLOCK_HEIGHT,
    room: this.props.room,
    error: this.props.error
  };

  componentDidMount() {
    if (socket) {
      const room = this.state.room;

      socket.emit('JOIN_ROOM', room._id);
      socket.on('MESSAGE', this.onMessageReceived);
      socket.on('INIT', this.onInit);
    }

    this.setContainerHeight();
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('MESSAGE', this.onMessageReceived);
      socket.removeListener('INIT', this.onInit);
    }
  }

  onInit = () => {
    console.log('INIT');
  };

  onMessageReceived = (data) => {
    const room = this.state.room;

    if (!Array.isArray(room.messages)) {
      room.messages = [];
    }

    room.messages.push(data);

    this.setState({...this.state, room});
  };

  sendMessage = msg => {
    const {params, user} = this.props;

    if (socket) {
      socket.emit('MESSAGE', params.id, {
        authorId: user && user._id || '#1234',
        text: msg
      });
    }
  };

  setContainerHeight() {
    const navbarHeight = getElementHeight('.navbar');
    const titleHeight = getElementHeight('.room-title');

    if (navbarHeight && titleHeight) {
      const windowHeight = getWindowHeight();
      const marginHeight = this.MARGIN_CONST;
      const blockHeight = windowHeight - (navbarHeight + titleHeight + marginHeight);

      this.setState({...this.state, blockHeight});
    }
  }

  isDiagramAppropriate() {
    return getWindowWidth() > this.DIAGRAM_MIN_WIDTH;
  }

  isSmallScreen() {
    return getWindowWidth() <= this.COL_SM_MAX;
  }

  render() {
    const {room, error} = this.state;
    const {user,
      authenticationRequired,
      pushState,
      location,
      isAnonymRegistered
    } = this.props;
    const style = require('./Room.scss');
    const hasPermission = this.hasPermission.bind(this);

    let blockHeight = this.DEFAULT_BLOCK_HEIGHT; // this.state.blockHeight

    return ((() => {
      let component;

      if (error) {
        component = (<div>ERROR: {error.message}</div>);
      } else if (!user && authenticationRequired) {
        const query = `k=${location.query.k}&next=${room._id}`;

        component = isAnonymRegistered
          ?(<div><button onClick={() => pushState(`/login?${query}`)}>Login</button></div>)
          : (<div><button onClick={() => pushState(`/signup?${query}`)}>Signup</button></div>)
      } else if (!user && !authenticationRequired) {
        component = (<div>Write your personal info</div>)
      } else {
          component = (
            <div className={style.room}>
              <Helmet title="Room"/>
              <h1 className="room-title">{ `Room ${room.title}` }</h1>
              <div className={`${style.marginTop} row`}>
                <div className="col-md-9 col-sm-12">
                  {
                    this.isDiagramAppropriate() &&
                    <Diagram
                      room={room}
                      blockHeight={blockHeight}
                      hasPermission={hasPermission}
                    />
                    || 'Use device with bigger screen resolution, diagram is not available here'
                  }
                </div>
                <div
                  className={`col-md-3 col-sm-12 ${this.isSmallScreen() && style.marginTop}`}>
                  <Chat messages={room.messages}
                        userId={user && user._id}
                        sendMessage={this.sendMessage}
                        blockHeight={blockHeight}
                        hasPermission={hasPermission}
                  />
                </div>
              </div>
            </div>
          )
        }

      return component;
    })());
  }
}
