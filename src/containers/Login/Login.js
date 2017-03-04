import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import * as authActions from 'redux/modules/auth';

@connect(
  state => ({ loginError: state.auth.loginError }), authActions)
export default class Login extends Component {
  static propTypes = {
    loginError: PropTypes.object,
    login: PropTypes.func,
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const username = this.refs.email;
    const password = this.refs.password;
    this.props.login(username.value, password.value);
    username.value = '';
    password.value = '';
  };

  render() {
    const { loginError } = this.props;
    const styles = require('./Login.scss');
    return (
      <div className={ styles.loginPage }>
        <Helmet title="Login"/>
        <div>
          <div className="row">
            <h1>Login</h1>
            <form className="col-md-6 col-md-offset-3 login-form" onSubmit={this.handleSubmit}>
              <label className="error">{ loginError && loginError.message }</label>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" ref="email" placeholder="Enter your email" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Password:</label>
                <input type="password" id="pwd" ref="password" placeholder="Enter your password" className="form-control"/>
              </div>
              <button className="btn btn-success pull-right" onClick={this.handleSubmit}><i className="fa fa-sign-in"/>
                {' '}Log In
              </button>
            </form>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <h1>or use existing accounts</h1>
              <a href="/api/auth/facebook">
                <span>Log in with Facebook</span>
              </a>
              <br></br>
              <a href="/api/auth/google">
                <span>Log in with Google</span>
              </a>
            </div>
          </div>
        </div></div>
    );
  }
}
