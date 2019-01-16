// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react'
import PropTypes from 'prop-types'

import videojs from 'video.js'
import './video-js.css'
import './Player.css'

import BackButton from './BackButton'

export default class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loaded: false}
    // this.authorizedHeaders = {'X-Token': this.props.AuthToken}
    videojs.xhr.beforeRequest = options => {
      if( !options.headers ) options.headers = {}
      options.headers['X-Token'] = this.props.AuthToken
    }
    // videojs.xhr(
    //   {headers: this.authorizedHeaders, url: this.videoSource},
    //   () => this.setState({loaded: true})
    // )
  }
  get posterSource() { return `/img/${this.props.Identifier}` }
  get videoSource() { return `/vid/${this.props.Identifier}` }
  get backButton() {
    return (
      <BackButton ButtonClick={this.props.BackButtonClicked}
                  className="player-back-button" />
    )
  }
  get beforeRequest(){
    return options => {
      if (!options.headers) options.headers = {}
      options.headers['X-Token'] = this.props.AuthToken
      return options
    }
  }
  componentWillUnmount() { if( this.player ) this.player.dispose() }
  componentDidMount() {

    this.player = videojs(this.videoElement)
    // if (!this.player.hls.xhr.headers) this.player.hls.xhr.headers = {}
    // this.player.hls.xhr.headers['X-Token'] = this.props.AuthToken
    // this.player.autoplay(true)
    // this.player.controls(true)
    // this.player.poster(`/img?id=${this.props.Identifier}`)
    // this.player.src(`/vid?id=${this.props.Identifier}`)
    // this.player.ready()
  }
  render() {
    return (
      <div className="videojs-player-parent">
        {this.backButton}
        <div className={
          `video-wrapper-${this.state.loaded? 'ready': 'not-ready'}`
        } >
          <video ref={elem => this.videoElement = elem}
                 className='video-js vjs-big-play-centered'
                 autoPlay controls
                 poster={this.posterSource}>
            <source src={this.videoSource} />
          </video>
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  BackButtonClicked: PropTypes.func.isRequired,
  AuthToken: PropTypes.string.isRequired,
  Identifier: PropTypes.string.isRequired
}
