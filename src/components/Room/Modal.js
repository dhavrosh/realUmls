import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class RoomModal extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    data: PropTypes.object,
    close: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired
  };

  state = {
    ...this.props.data,
    error: { message: '' }
  };

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        ...nextProps.data,
        error: { message: '' }
      });
    }
  }

  addMember() {
    const memberObj = { email: '', role: '' };
    this.setState({
      ...this.state,
      members: [...this.state.members, memberObj]
    });
  }

  removeMember(position) {
    this.state.members.splice(position, 1);

    this.setState({
      ...this.state,
      members: [...this.state.members]
    });
  }

  selectRole(memberPosition, roleTitle) {
    const member = this.state.members[memberPosition];
    member.role = this.props.roles.find(role => role.title === roleTitle)._id;
    this.setState({
      ...this.state,
      members: [...this.state.members]
    });
  }

  save() {
    const title = this.refs.title;
    const description = this.refs.description;

    if (title.value && description.value) {
      const data = this.props.data;
      const args = [title.value, description.value];
      const members = [];

      this.state.members.forEach((member, index) => {
        const key = `member-${index}`;
        const email = this.refs[`${key}-email`].value;
        const roleTitle = this.refs[`${key}-role`].value;
        const role = this.props.roles.find(item => item.title === roleTitle)._id;

        members.push({ email, role });
      });

      args.push(members);

      if (data && data._id) {
        args.push(data._id);
      }

      this.props.save(...args);
      this.props.close();
      this.setState({ error: null });

      title.value = '';
      description.value = '';
    } else {
      this.setState({ error: { message: 'All fields are required' }});
    }
  }

  close() {
    if (this.state.error) this.setState({ error: null });
    this.props.close();
  }

  render() {
    const { showModal, close, roles } = this.props;
    const { title, description, members } = this.state;
    const buttonGroup = { marginTop: 30 };
    const notEmphatic = { border: 'none' };
    const lined = { lineHeight: 1 };
    const error = { color: '#ac2925' };
    const bordered = {
      padding: '5px 10px',
      borderRadius: 5,
      border: '1px solid #ccc'
    };
    const memberRow = {
      marginTop: 15,
      minHeight: 35
    };
    const memberRemoveCol = {
      lineHeight: '30px'
    };
    const memberRemoveBtn = {
      verticalAlign: 'center',
      height: '34px',
      width: '100%',
      color: 'red',
      backgroundColor: 'white',
      borderColor: '#cccccc'
    };
    const memberCreateBtn = {
      fontSize: '14px'
    };

    return (
      <Modal show={ showModal } onHide={ close }>
        <Modal.Header closeButton style={ notEmphatic }>
          <Modal.Title>Make your room and have some fun</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <label style={ error }>{ this.state.error && this.state.error.message }</label>
              <div className="form-group">
                <label htmlFor="title" style={ lined }>Title:</label>
                <input
                  style={ bordered }
                  className="form-control"
                  ref="title"
                  type="text"
                  placeholder="Enter your title"
                  defaultValue={ title }
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" style={ lined }>Description:</label>
                <textarea
                  style={ bordered }
                  className="form-control"
                  ref="description"
                  placeholder="Enter your description"
                  defaultValue={ description }
                />
              </div>
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12">
                    <label htmlFor="members" style={ lined }>Members:</label>
                    <button className="btn btn-link btn-xs" style={memberCreateBtn} onClick={ this.addMember.bind(this) }>
                      Create
                    </button>
                  </div>
                </div>
                { members.map((member, index) => {
                  const key = `member-${index}`;
                  const memberRole = roles.find(role => role._id === member.role).title;

                  return (
                    <div className="row" style={memberRow} key={key}>
                      <div className="col-md-5 col-sm-5">
                        <input
                          type="text"
                          ref={`${key}-email`}
                          placeholder="Enter member email"
                          defaultValue={member.email}
                          style={ bordered }
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-5 col-sm-5">
                        <select
                          style={ bordered }
                          className="form-control"
                          ref={`${key}-role`}
                          placeholder="Choose role"
                          value={memberRole}
                          onChange={event => this.selectRole(index, event.target.value)}>
                          { roles.map(role =>
                            <option value={role.title} key={`role-${role.title}`}>
                              {role.title}
                            </option>)
                          }
                        </select>
                      </div>
                      <div className="col-md-2 col-sm-2" style={memberRemoveCol}>
                        <button className="btn btn-xs"
                                style={memberRemoveBtn}
                                onClick={() => this.removeMember(index)}>
                          <i className="fa fa-remove"/>
                        </button>
                      </div>
                    </div>
                  );
                })
                }
              </div>
              <div style={ buttonGroup }>
                <button className="btn btn-success pull-right" onClick={ this.save.bind(this) } >Save</button>
                <button className="btn btn-link pull-right" onClick={ this.close.bind(this) }>Cancel</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
