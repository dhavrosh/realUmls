import { Component } from 'react';

export default class RoleAwareComponent extends Component {

  constructor(props) {
    super(props);
  }

  initialize(permissions) {
    this.permissions = permissions;
  }

  has(type) {
    const permission = this.permissions[type];
    return typeof permission !== 'undefined' && permission === true;
  }
}
