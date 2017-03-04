import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';

@connect(
    state => ({user: state.auth.user}),
    authActions)
export default
class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
  };

  render() {
    const { user } = this.props;
    return (user &&
      <div className="container">
        <h1>Login Success</h1>

        <div>
          <p>Hi, {user.username}. You have just successfully logged in, and you're welcome in our service! Let's have some fun!</p>
        </div>
      </div>
    );
  }
}
