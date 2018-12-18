import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flash } from './misc';
import './Login.css';
import './CenteredDiv.css';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.nameHasChanged = this.nameHasChanged.bind(this);
    this.authHasChanged = this.authHasChanged.bind(this);
    this.submit = this.submit.bind(this);
    this.state = { name: '', auth: ''};
  }
  nameHasChanged(event) {
    if(!this.state) Flash.WARNING("state was null in nameHasChanged");
    this.setState({name: event.target.value});
  }
  authHasChanged(event) {
    if(!this.state) Flash.WARNING("state was null in authHasChanged");
    this.setState({auth: event.target.value});
  }
  get postOptions() {
    if(!this.state) Flash.WARNING("state was null in get postOptions");
    return {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, password: this.state.auth})
    };
  }
  submit(event) {
    if(!this.state) Flash.WARNING("state was null in submit");
    Flash.DEBUG(`got submit event ${event} with username ${this.state.name} and password ${this.state.auth}`);
    fetch("/sign_in", this.postOptions)
      .then(result => result.json())
      .then(this.props.Callback)
      .catch(err => Flash.CRITICAL(`Error submitting sign-in info ${err}`));
  }
  render() {
    if(!this.state) Flash.WARNING("state was null in Login.render");
    return (
      <div className="centered-div parent">
        <div className="centered-div middle">
          <div className="centered-div content">
            <input className="login-screen" id='name' placeholder="name" type="text" onChange={this.nameHasChanged} value={this.state.name} />
            <br />
            <input className="login-screen" id='auth' placeholder="password" type="password" onChange={this.authHasChanged} value={this.state.auth} />
            <br />
            <button className="login-screen" id="submit" onClick={this.submit}>
              Authorize
            </button>
          </div>
        </div>
      </div>
    );
  }
}

LoginScreen.propTypes = {
  Callback: PropTypes.func.isRequired
};
