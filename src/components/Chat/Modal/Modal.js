import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';

export default class ChatModal extends Component {
  static propTypes = {
    saveChatRoom: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    data: PropTypes.object,
    close: PropTypes.func.isRequired
  };

  saveChatRoom() {
    const title = this.refs.title;
    const description = this.refs.description;
    const data = this.props.data;
    const args = [title.value, description.value];

    if (data && data._id) {
      args.push(data._id);
    }

    this.props.saveChatRoom(...args);
    this.props.close();

    title.value = '';
    description.value = '';
  }

  render() {
    const { showModal, close, data } = this.props;
    const buttonGroup = { marginTop: 30 };
    const notEmphatic = { border: 'none' };
    const lined = { lineHeight: 1 };
    const bordered = {
      padding: '5px 10px',
      borderRadius: 5,
      border: '1px solid #ccc'
    };

    return (
      <Modal show={ showModal } onHide={ close }>
        <Modal.Header closeButton style={ notEmphatic }>
          <Modal.Title>Make your chat and have fun</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="title" style={ lined }>Title:</label>
                <input
                  style={ bordered }
                  className="form-control"
                  ref="title"
                  type="text"
                  placeholder="Enter your title"
                  defaultValue={ data && data.title }
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" style={ lined }>Description:</label>
                <textarea
                  style={ bordered }
                  className="form-control"
                  ref="description"
                  placeholder="Enter your description"
                  defaultValue={ data && data.description }
                />
              </div>
              <div style={ buttonGroup }>
                <button className="btn btn-success pull-right" onClick={ this.saveChatRoom.bind(this) } >Save</button>
                <button className="btn btn-link pull-right" onClick={ this.props.close }>Cancel</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
