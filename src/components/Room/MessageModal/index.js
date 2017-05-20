import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';


export default class MessageModal extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  render() {
    const {children} = this.props;

    return (
      <Modal show={ true }>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              {children}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}