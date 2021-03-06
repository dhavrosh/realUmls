import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';

export default class RoomPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.string.isRequired,
    edit: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired
  };

  render() {
    const { title, edit, remove, redirect } = this.props;
    const margin = {
      margin: '0 2px',
      textAlign: 'center',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: '#01b49e',
      fontSize: '1.0em'
    };
    const titleStyle = {
      color: '#4c4c4c',
      fontSize: '1.1em',
    };
    const align = { verticalAlign: 'middle', margin: 0 };
    const pointer = { cursor: 'pointer' };
    const header = (
      <span>
        <div className="row">
          <div className="col-md-8 col-sm-8 col-xs-7">
            <span style={titleStyle}>{ title }</span>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-5  ">
            {
              remove &&
              <button className="btn btn-danger btn-xs pull-right" onClick={ remove } style={ margin }>
                <i className="fa fa-times" style={ align }/>
              </button>
            }
            {
              edit &&
              <button className="btn btn-info btn-xs pull-right" onClick={ edit } style={ margin }>
                <i className="fa fa-pencil-square-o" style={ align }/>
              </button>
            }
          </div>
        </div>
      </span>
    );

    return (
      <Panel
        style={ pointer }
        onClick={ redirect }
        header={ header }>
        { this.props.children }
      </Panel>
    );
  }
}
