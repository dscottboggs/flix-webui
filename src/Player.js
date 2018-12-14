// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import PropTypes from 'prop-types';

import videojs from 'video.js';
import './video-js.css';
import './Player.css';

import BackButton from './BackButton';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
  }
  get backButton() {
    return (
      <BackButton ButtonClick={this.props.BackButtonClicked}
                  className="player-back-button" />
    );
  }
  componentWillUnmount() { if( this.player ) this.player.dispose(); }
  componentDidMount() {
    // videojs.xhr.withCredentials = true;
    this.player = videojs(
      this.videoElement,
      this.props,
      // callback may be specified here:
      () => this.setState({loaded: true})
    );
  }
  render() {
    return (
      <div className="videojs-player-parent">
        {this.backButton}
        <div className={
               `video-wrapper-${this.state.loaded? 'ready': 'not-ready'}`
             } >
          <video ref={elem => this.videoElement = elem}
                 className='video-js vjs-big-play-centered' />
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  BackButtonClicked: PropTypes.func.isRequired
};
