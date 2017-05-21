import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {Tabs, Tab} from 'react-bootstrap';
import {save} from 'redux/modules/auth';

@connect(
  state => ({ user: state.auth.user, error: state.auth.saveError }), {save})
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.object,
    save: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
  }

  state = {
    username: this.props.user.username || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: ''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({error: nextProps.error.message});
    }

    if (nextProps.user) {
      this.setState({username: nextProps.user.username});
    }
  }

  save() {
    const {username, oldPassword, newPassword, confirmPassword} = this.state;

    if (newPassword !== confirmPassword) {
      this.setState({error: 'New and Confirm passwords have to be equal'});
    } else {
      this.props.save({username, oldPassword, newPassword});
    }
  }

  render() {
    const {username, error} = this.state;
    const {user} = this.props;

    const disabledProp = user.provider ? {disabled: true} : {};

    return (
      <div>
        <Helmet title="Settings"/>
        <div>
          <div className="row">
            <div style={{textAlign: 'center'}}>
              <h1>Settings</h1>
            </div>
            <div className="col-md-12" style={{marginTop: '20px'}}>
              <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                <Tab eventKey={1} title="General">
                  <div className="col-md-6 col-md-offset-3" style={{marginTop: '35px'}}>
                    <div style={{textAlign: 'center'}}>
                      <label style={{ color: '#ac2925', marginBottom: '10px'}}>{ error }</label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Username</label>
                      <input
                        type="text"
                        placeholder="Pick up your nickname"
                        value={username}
                        className="form-control"
                        onChange={e => this.setState({username: e.target.value})}
                      />
                    </div>
                    <br/>
                    <br/>
                    <div className="form-group">
                      <label htmlFor="email">Old Password</label>
                      <input
                        type="password"
                        placeholder="Enter your old parole"
                        className="form-control"
                        onChange={e => this.setState({oldPassword: e.target.value})}
                        {...disabledProp}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">New Password</label>
                      <input
                        type="password"
                        placeholder="Create your new password"
                        className="form-control"
                        onChange={e => this.setState({newPassword: e.target.value})}
                        {...disabledProp}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Confirm your identification"
                        className="form-control"
                        onChange={e => this.setState({confirmPassword: e.target.value})}
                        {...disabledProp}
                      />
                    </div>
                    <button className="btn btn-success pull-right" onClick={this.save}> <i className="fa fa-floppy-o"/>
                      {'  '}Save
                    </button>
                  </div>
                </Tab>
                <Tab eventKey={3} title="Avatar">Avatar</Tab>
              </Tabs>
            </div>
          </div>
        </div></div>
    );
  }
}
