// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import PropTypes from 'prop-types';

import videojs from 'video.js';
import './video-js.css';
import './Player.css';
import { Flash } from './misc';

import BackButton from './BackButton';
import Loading from './Loading';

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
  get info() {
    return new Promise(function(resolve, reject) {
      fetch(`/nfo?id=${this.props.ID}`)
        .then(response => {
          if ( response.status === 200 ) return response.json();
          else throw `unexpected HTTP status "${response.statusText}" for "/nfo?id=${this.props.ID}"`;})
        .then(resolve)
        .catch(reject);
    });
  }
  get ready() { return this.state.loaded? 'ready': 'not-ready'; }
  componentWillUnmount() { if( this.player ) this.player.dispose(); }
  componentDidMount() {
    Flash.DEBUG(this.videoElement, this.props, this.state);
    this.info.then(info => {
      let src = this.props.sources || [];
      src.push({
        src: `/vid?id=${this.props.ID}`,
        type: info.MimeType
      });
      return src;
    }).catch(err => {
      Flash.ERROR(`error fetching info: ${err}, trying default`);
      let src = this.props.sources || [];
      src.push({
        src: `/vid?id=${this.props.ID}`,
        type: 'video/mp4'
      });
      return src;
    })
    // eslint-disable-next-line promise/always-return
      .then(src => {
        this.player = videojs(
        this.videoElement,
        {sources: src, ...this.props},
        // callback may be specified here:
        () => this.setState({loaded: true})
      );
    }).catch(Flash.ERROR);
  }
  render() {
    return (
      <div className="videojs-player-parent">
        {this.backButton}
        { (this.state.loaded) ? null : <Loading /> }
        <div className={`video-wrapper-${this.ready}`} >
          <video ref={elem => this.videoElement = elem}
                 className='video-js vjs-big-play-centered' />
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  BackButtonClicked: PropTypes.func.isRequired,
  ID: PropTypes.string.isRequired,
  sources: PropTypes.array
};
