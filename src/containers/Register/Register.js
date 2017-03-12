import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import * as authActions from 'redux/modules/auth';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (authActions.isSignupError(getState())) {
      promises.push(dispatch(authActions.resetSignupError()));
    }

    return Promise.all(promises);
  }
}])
@connect(state => ({ registerError: state.auth.registerError }), authActions)
export default class Register extends Component {
  static propTypes = {
    registerError: PropTypes.object,
    signup: PropTypes.func
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const email = this.refs.email;
    const password = this.refs.password;
    const username = this.refs.username;

    this.props.signup(email.value, password.value, username.value);

    email.value = '';
    password.value = '';
    username.value = '';
  };

  render() {
    const { registerError } = this.props;
    const styles = require('../Login/Login.scss');

    return (
      <div className={ styles.loginPage }>
        <Helmet title="Signup"/>
        <h1>Signup</h1>
        <div>
          <form className="col-md-6 col-md-offset-3 login-form" onSubmit={this.handleSubmit}>
            <label className="error">{ registerError && registerError.message }</label>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" ref="email" placeholder="Enter your email" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" ref="username" placeholder="Enter your username" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Password:</label>
                <input type="password" id="pwd" ref="password" placeholder="Enter your password" className="form-control"/>
              </div>
            <button className="btn btn-success pull-right" onClick={this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}
