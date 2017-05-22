import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {Tabs, Tab} from 'react-bootstrap';
import {save, saveAvatar} from 'redux/modules/auth';
import Dropzone from 'react-dropzone';

@connect(
  state => ({ user: state.auth.user, error: state.auth.saveError }), {save, saveAvatar})
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    error: PropTypes.object,
    save: PropTypes.func.isRequired,
    saveAvatar: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.save = this.save.bind(this);
    this.saveAvatar = this.saveAvatar.bind(this);
  }

  state = {
    username: this.props.user.username || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    image: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({error: nextProps.error.message});
    }

    if (nextProps.user) {
      this.setState({username: nextProps.user.username});
    }
  }

  onDrop(files) {
    const image = files[0];

    console.log(image);

    this.setState({image});
  }

  removeImage(e) {
    e.preventDefault();

    this.setState({image: null});
  }

  save() {
    const {username, oldPassword, newPassword, confirmPassword} = this.state;

    if (newPassword !== confirmPassword) {
      this.setState({error: 'New and Confirm passwords have to be equal'});
    } else {
      this.props.save({username, oldPassword, newPassword});
    }
  }

  saveAvatar() {
    const image = this.state.image;

    if (image) {
      this.props.saveAvatar(image);
    } else {
      // set error
    }
  }

  render() {
    const {username, error, image} = this.state;
    const {user} = this.props;
    const dropzoneStyle = {
      width: '1000px',
      height: '400px',
      border: '1px solid #ccc',
      textAlign: 'center',
      /*position: 'relative',*/
      cursor: 'pointer',
      display: 'table-cell',
      verticalAlign: 'middle'
    };
    const dropMeta = {
      margin: '15px 0'
    };
    const imageStyle = {
      marginTop: '15px',
      maxWidth: '85%'
    };

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
                <Tab eventKey={3} title="Avatar">
                  <div className="col-md-6 col-md-offset-3" style={{marginTop: '35px'}}>
                    <Dropzone accept="image/jpeg, image/png" onDropAccepted={this.onDrop} style={dropzoneStyle}>
                      <image
                        className="img-circle"
                        src={image && image.preview || 'images/user.png'}
                        style={imageStyle}
                      />
                      {
                        image
                        &&
                          <div style={dropMeta}>
                            <button className="btn btn-link">Change</button>
                            <button
                              className="btn btn-link"
                              style={{marginLeft: '10px'}}
                              onClick={this.removeImage}
                            >Remove</button>
                          </div>
                        ||
                          <p style={dropMeta}>Try drop some files here, or click to select</p>
                      }
                    </Dropzone>
                    <button className="btn btn-success pull-right" onClick={this.saveAvatar} style={{marginTop: '15px'}}>
                      <i className="fa fa-floppy-o"/>
                      {'  '}Save
                    </button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div></div>
    );
  }
}
