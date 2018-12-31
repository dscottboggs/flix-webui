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
    this.setState({name: event.target.value});
  }
  authHasChanged(event) {
    this.setState({auth: event.target.value});
  }
  get postOptions() {
    return {
      method: 'POST',
      body: JSON.stringify({name: this.state.name, password: this.state.auth})
    };
  }
  submit() {
    if(!this.state) Flash.WARNING("state was null in submit");
    fetch("/sign_in", this.postOptions)
      .then(result => {
        if(result.status === 200) return result.json();
        if(result.status === 403) throw "wrong username or password";
        throw `got unexpected response status ${result.status} ${result.statusText}`;
      })
      .then(this.props.Callback)
      .catch(err => Flash.CRITICAL(`Error submitting sign-in info: "${err}"`));
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
