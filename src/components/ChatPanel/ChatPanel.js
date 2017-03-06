import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Panel from 'react-bootstrap/lib/Panel';

@connect(state => ({info: state.info.data}))
export default class ChatPanel extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.string.isRequired
  };

  render() {
    const title = this.props.title;
    const margin = { margin: '0 2px', textAlign: 'center' };
    const align = { verticalAlign: 'middle', margin: 0 };
    const header = (
      <span>
        <div className="row">
          <div className="col-md-8">
            <span>{ title }</span>
          </div>
          <div className="col-md-4">
            <button className="btn btn-danger btn-xs pull-right" style={margin}>
              <i className="fa fa-times" style={align}/>
            </button>
            <button className="btn btn-info btn-xs pull-right" style={margin}>
              <i className="fa fa-pencil-square-o" style={align}/>
            </button>
          </div>
        </div>
      </span>
    );

    return (<Panel header={ header }>{ this.props.children }</Panel>);
  }
}
