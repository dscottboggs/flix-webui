import React from 'react';
import PropTypes from 'prop-types';
import { HeaderStyle } from './Styles';

export default class Header extends React.Component {
  get style() {
    return HeaderStyle(this);
  }
  get title() {
    return '"flix"';
  }
  render() {
    return (
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1 className="App-title" style={this.style}>{this.title}</h1>
      </header>
    );
  }
}

Header.propTypes = { Visible: PropTypes.bool.isRequired };
