import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
import { RoomPanel, RoomModal } from 'components';
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
    rooms: PropTypes.array,
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
      members: []
    };
  }

  showRoomModal() {
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

  render() {
    const {
      user,
      roles,
      rooms,
      save: saveAction,
      showAlertModal: showAlert
    } = this.props;
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
                    onClick={ this.showRoomModal.bind(this) }>
              Create
            </button>
          </div>
        </div>
        <div>
          <div className="row">
          { rooms && (rooms.length && rooms.map(room => {
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
                title: `Do you want to remove "${room.title}" Room?`,
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
          }) || <div className="col-md-12">Press 'Create' to add rooms to your Dashboard</div>)
          }
          </div>
        </div>
        <RoomModal
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
