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

  // TODO: add validation
  handleSubmit = (event) => {
    event.preventDefault();

    const {location} = this.props;
    const {email, password, username} = this.refs;
    const data = {
      email: email.value,
      password: password.value,
      username: username.value
    };

    if (location.query.k && location.query.next) {
      const room = location.query.next;

      data.keys = [{value: location.query.k, room}];
      data.room = room;
    }

    this.props.signup(data);

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
        <div style={{marginTop: '30px'}}>
          <form className="col-md-6 col-md-offset-3 login-form" onSubmit={this.handleSubmit}>
            <div style={{textAlign: 'center'}}>
            <label className="error">{ registerError && registerError.message }</label>
            </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref="email" placeholder="Enter your email address" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" ref="username" placeholder="Pick up your nickname" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Password</label>
                <input type="password" id="pwd" ref="password" placeholder="Type your parole code" className="form-control"/>
              </div>
            <button className="btn btn-success pull-right" onClick={this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}
