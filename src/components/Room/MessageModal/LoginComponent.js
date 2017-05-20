import React, { Component, PropTypes } from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import BaseComponent from './BaseComponent';

@connect(state => ({}), { pushState: push })
export default class LoginComponent extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    const {pushState, query} = this.props;
    const description = "It seems that you're already registered in the system, so please go through the authentication";

    return (
      <BaseComponent
        image="login"
        heading="Hey there!"
        description={description}
      >
        <button
          className="btn btn-md btn-success"
          onClick={() => pushState(`/login?${query}`)}
          style={{margin: '10px 0'}}
        >
          Go to the Login
        </button>
      </BaseComponent>
    );
  }
}