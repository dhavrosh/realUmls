import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

export default class ErrorComponent extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired
  };

  render() {
    const {description: errorDescription} = this.props;
    const description = "Please make sure you have all accesses and params correct";

    return (
      <BaseComponent
        image="error"
        heading={errorDescription}
        description={description}
      />
    );
  }
}