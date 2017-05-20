import React, { Component, PropTypes } from 'react';

export default class BaseComponent extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    children: PropTypes.string,
  };

  render() {
    const {image, heading, description, children} = this.props;
    const imageSrc = require(`./img/${image}.png`);
    const containerStyle = {
      textAlign: 'center'
    };

    return (
      <div className="row"  style={containerStyle}>
        <div className="col-md-12">
          <image src={imageSrc}/>
          <h2>{heading}</h2>
          <p>{description}</p>
          {children}
        </div>
      </div>
    );
  }
}