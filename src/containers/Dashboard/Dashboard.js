import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Cookies from "universal-cookie";
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { RoomPanel, EditModal } from 'components';
import {
  isLoaded as areRoomsLoaded,
  loadOwn,
  save,
  remove
} from 'redux/modules/rooms';
import {
  isLoaded as areRolesLoaded,
  load as loadRoles
} from 'redux/modules/roles';
import { show as showAlertModal } from 'redux/modules/alert';
import {
  getWidth as getWindowWidth,
} from 'helpers/Window';

let cookies;

if (__CLIENT__) {
  cookies = new Cookies();
}

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!areRoomsLoaded(getState())) {
      promises.push(dispatch(loadOwn()));
    }

    if (!areRolesLoaded(getState())) {
      promises.push(dispatch(loadRoles()));
    }

    return Promise.all(promises);
  }
}])
@connect(state => ({
  user: state.auth.user,
  rooms: state.rooms.data,
  roles: state.roles.data
}), {
  save,
  remove,
  showAlertModal,
  pushState: push
})
export default class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object,
    rooms: PropTypes.object,
    save: PropTypes.func,
    remove: PropTypes.func,
    showAlertModal: PropTypes.func,
    pushState: PropTypes.func,
    roles: PropTypes.array.isRequired
  };

  state = {
    modal: { show: false, data: this.getEmptyDataObj() }
  };

  getEmptyDataObj() {
    return {
      title: '',
      description: '',
      isVisible: false,
      members: []
    };
  }

  showEditModal() {
    this.setState({
      ...this.state,
      modal: { data: this.getEmptyDataObj(), show: true }
    });
  }

  close() {
    this.setState({
      ...this.state,
      modal: { data: null, show: false }
    });
  }

  componentWillMount() {
    if (__CLIENT__ && this.props.user && cookies.get('next')) {
      this.props.pushState(`/room/${cookies.get('next')}`);
      cookies.remove('next');
    }
  }

  render() {
    const {
      user,
      roles,
      rooms,
      save: saveAction,
      showAlertModal: showAlert
    } = this.props;
    const headingPosition = getWindowWidth() < 600 ? '15px' : '40%';
    const margin = { margin: '30px -15px' };
    const noMargin = {margin: 0, display: 'inline', position: 'absolute', left: headingPosition};

    return (user &&
      <div>
        <Helmet title="Dashboard"/>
        <div className="row" style={ margin }>
          <div className="col-md-12 col-sm-12 col-xs-12" style={{position: 'relative'}}>
            <h1 style={ noMargin }>Dashboard</h1>
            <button className="btn btn-success pull-right"
                    onClick={ this.showEditModal.bind(this) }>
              Create
            </button>
          </div>
          {/*<div className="col-md-3 col-sm-3 col-xs-3">*/}
            {/*<button className="btn btn-success pull-right"*/}
                    {/*onClick={ this.showEditModal.bind(this) }>*/}
              {/*Create*/}
            {/*</button>*/}
          {/*</div>*/}
        </div>
        <div>
          <div className="row">
            <div className="col-md-12">
              <h3>Own</h3>
            </div>
          </div>
          <div className="row">
          { rooms && (rooms.own.length && rooms.own.map(room => {
            const editAction = event => {
              event.stopPropagation();
              this.setState({
                ...this.state,
                modal: { data: room, show: true }
              });
            };
            const removeAction = event => {
              event.stopPropagation();
              showAlert({
                title: `Want to remove a room?`, // "${room.title}"
                size: 'sm',
                accept: () => this.props.remove(room._id)
              });
            };
            const redirectAction = () => this.props.pushState(`/room/${ room._id }`);
            return (
                <div className="col-md-4" key={ room._id }>
                    <RoomPanel
                      title={ room.title }
                      edit={ editAction }
                      remove={ removeAction }
                      redirect={ redirectAction }>
                      { room.description }
                    </RoomPanel>
                </div>
             );
          }) || <div className="col-md-12" style={{marginBottom: 30}}>Press 'Create' to add rooms to your Dashboard</div>)
          }
          </div>
          <div className="row">
            <div className="col-md-12">
              <h3>Shared</h3>
            </div>
          </div>
          <div className="row">
            { rooms && (rooms.shared.length && rooms.shared.map(room => {
              const redirectAction = () => this.props.pushState(`/room/${ room._id }`);
              return (
                <div className="col-md-4" key={ room._id }>
                  <RoomPanel
                    title={ room.title }
                    redirect={ redirectAction }>
                    { room.description }
                  </RoomPanel>
                </div>
              );
            }) || <div className="col-md-12">
                    You haven't got any shared room yet
                  </div>)
            }
          </div>
        </div>
        <EditModal
          showModal={ this.state.modal.show }
          data={ this.state.modal.data }
          close={ this.close.bind(this) }
          save={ saveAction }
          roles={ roles && roles.filter(role => role.title !== 'creator') || [] }
        />
      </div>
    );
  }
}
