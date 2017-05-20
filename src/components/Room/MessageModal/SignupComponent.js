import React, { Component, PropTypes } from 'react';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';

import BaseComponent from './BaseComponent';

@connect(state => ({}), { pushState: push })
export default class SignupComponent extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    const {pushState, query} = this.props;
    const description = "To participate in current room you need to have an account, so please go through registration";

    return (
      <BaseComponent
        image="signup"
        heading="Want to try it out?"
        description={description}
      >
        <button
          className="btn btn-md btn-success"
          onClick={() => pushState(`/signup?${query}`)}
          style={{margin: '10px 0'}}
        >
          Go to the Sign Up
        </button>
      </BaseComponent>
    );
  }
}