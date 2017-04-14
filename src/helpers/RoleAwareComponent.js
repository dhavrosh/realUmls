import { Component, PropTypes } from 'react';

export default class RoleAwareComponent extends Component {

  static propTypes = {
    permission: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  hasPermission(type) {
    const permissions = this.props.permission;

    return typeof permissions !== 'undefined'
      && permissions[type] === true;
  }
}
