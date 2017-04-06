import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { roles } from '../../../constants';

export default class ChatModal extends Component {
  static propTypes = {
    saveChatRoom: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    data: PropTypes.object,
    close: PropTypes.func.isRequired
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

  saveChatRoom() {
    const title = this.refs.title;
    const description = this.refs.description;

    if (title.value && description.value) {
      const data = this.props.data;
      const args = [title.value, description.value];
      const members = [];

      this.state.members.forEach((member, index) => {
        const key = `member-${index}`;
        const email = this.refs[`${key}-email`].value;
        const role = this.refs[`${key}-role`].value;

        members.push({ email, role });
      });

      args.push(members);

      if (data && data._id) {
        args.push(data._id);
      }

      this.props.saveChatRoom(...args);
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
    const { showModal, close } = this.props;
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

    return (
      <Modal show={ showModal } onHide={ close }>
        <Modal.Header closeButton style={ notEmphatic }>
          <Modal.Title>Make your chat and have some fun</Modal.Title>
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
                <label htmlFor="members" style={ lined }>Members:</label>
                <button onClick={ this.addMember.bind(this) }>Add</button>
                { members.map((member, index) => {
                  const key = `member-${index}`;
                  return (
                    <div key={key}>
                      <input type="text" ref={`${key}-email`} placeholder="Enter member email" defaultValue={member.email}/>
                      <input type="text" ref={`${key}-role`} placeholder="Choose role" defaultValue={member.role}/>
                      <button onClick={ () => this.removeMember(index) }>Remove</button>
                    </div>
                  );
                })
                }
              </div>
              <div style={ buttonGroup }>
                <button className="btn btn-success pull-right" onClick={ this.saveChatRoom.bind(this) } >Save</button>
                <button className="btn btn-link pull-right" onClick={ this.close.bind(this) }>Cancel</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
