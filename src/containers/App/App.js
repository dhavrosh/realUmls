import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { AlertModal } from 'components';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import {NavDropdown, MenuItem} from 'react-bootstrap';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    user: state.auth.user,
    alert: state.alert
  }),
  { logout, pushState: push }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    alert: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const {user, location, pushState} = this.props;

    if (!user && nextProps.user) {
      const roomId = location.query.next;
      const route = roomId
        ? `/room/${roomId}`
        : '/dashboard';
      pushState(route);
    } else if (user && !nextProps.user) {
      pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user, alert } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#01b49e'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar pullLeft>
              {user &&
                <LinkContainer to="/dashboard">
                  <NavItem eventKey={1}>Dashboard</NavItem>
                </LinkContainer>
              }
            </Nav>
            <Nav navbar pullRight>
                {!user &&
                <LinkContainer to="/login">
                  <NavItem eventKey={6}>Login</NavItem>
                </LinkContainer>}
                {!user &&
                <LinkContainer to="/signup">
                  <NavItem eventKey={7}>Signup</NavItem>
                </LinkContainer>}
              {user &&
                <div style={{padding: '15px'}}>
                  <NavDropdown eventKey="8" id="nav-dropdown" title={user.username}>
                    <MenuItem eventKey="9">
                      <LinkContainer to="/settings">
                        <NavItem eventKey={11}>Settings</NavItem>
                      </LinkContainer>
                     </MenuItem>
                    <MenuItem eventKey="10" onClick={this.handleLogout}>Logout</MenuItem>
                  </NavDropdown>
                </div>
              }
              </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className="container" style={{ marginTop: 70}}>
          {this.props.children}
        </div>


        <AlertModal { ...alert }/>
      </div>
    );
  }
}
