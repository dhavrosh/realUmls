import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { close as closeAlertModal } from 'redux/modules/alert';
import Modal from 'react-bootstrap/lib/Modal';

@connect(null, { closeAlertModal })
export default class AlertModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    size: PropTypes.string,
    accept: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    closeAlertModal: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.close = this.close.bind(this);
    this.accept = this.accept.bind(this);
  }

  accept() {
    this.props.accept();
    this.close();
  }

  close() {
    this.props.closeAlertModal();
  }

  render() {
    const { showModal, title, size } = this.props;
    const notEmphatic = { border: 'none' };

    return (
      <Modal bsSize={ size || 'lg' } show={ showModal } onHide={ this.close }>
        <Modal.Header style={ notEmphatic }>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-danger pull-right" onClick={ this.accept }>Ok</button>
              <button className="btn btn-link pull-right" onClick={ this.close }>Cancel</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
