import React, {Component, PropTypes} from 'react';
import Cookies from "universal-cookie";
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import * as authActions from 'redux/modules/auth';

let cookies;

if (__CLIENT__) {
  cookies = new Cookies();
}

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (authActions.isLoginError(getState())) {
      promises.push(dispatch(authActions.resetLoginError()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({ loginError: state.auth.loginError }), authActions)
export default class Login extends Component {
  static propTypes = {
    loginError: PropTypes.object,
    login: PropTypes.func,
  };

  componentDidMount() {
    const {location} = this.props;

    if (location.query.next) {
      const expires = new Date();

      expires.setDate(expires.getTime() + 10000);
      cookies.set('next', location.query.next, {expires, path: "/"});
    }
  }

  // TODO: add fields validation
  handleSubmit = (event) => {
    event.preventDefault();

    const {email, password} = this.refs;
    const {login} = this.props;

    login(email.value, password.value);

    email.value = '';
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
            <form className="col-md-6 col-md-offset-3 login-form" onSubmit={this.handleSubmit} style={{marginTop: '20px'}}>
              <div style={{textAlign: 'center'}}>
              <label className="error">{ loginError && loginError.message }</label>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref="email" placeholder="Enter your email address" className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="pwd">Password</label>
                <input type="password" id="pwd" ref="password" placeholder="Type your parole code" className="form-control"/>
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
