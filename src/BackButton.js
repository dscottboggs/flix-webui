// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import PropTypes from 'prop-types';
import { Flash } from './misc';
import './BackButton.css';

export default class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.visibleFor = 1000;
    this.display = this.display.bind(this);
    this.state = { visible: false };
  }
  componentDidMount() {
    this.display();
    if (this.props.environment) return;
    this.approot = document.getElementById('root');
    if( this.approot === null) {
      Flash.ERROR(
            'really bad error! approot is null at component mount! env: ' + this.props.environment);
      return;
    }
    this.approot.addEventListener('mousemove', this.display);
  }
  componentWillUnmount() {
    if( (this.approot === null) && !this.props.environment) {
      Flash.ERROR(
        'really bad error! approot is null at component unmount! env: ' + this.props.environment);
      return;
    }
    this.approot.removeEventListener('mousemove', this.display);
  }
  display() {
    this.setState({visible: true}, () => {
      setTimeout(() => this.setState({visible: false}), this.visibleFor);
    });
  }
  get text(){ return "Main Menu"; }
  get className() {
    return `back-button-${this.state.visible? 'visible': 'invisible'}`;
  }
  render() {
    return (
      <div className={this.className}
           onClick={this.props.ButtonClick}>
        <div className="back-button-arrow" />
        <div className="back-button-text"> {this.text} </div>
      </div>
    );
  }
}

BackButton.propTypes = {
  ButtonClick: PropTypes.func.isRequired,
  environment: PropTypes.string
};
