// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react'
import PropTypes from 'prop-types'

import videojs from 'video.js'
import './video-js.css'
import './Player.css'
import { Flash } from './misc'

import BackButton from './BackButton'

export default class Player extends React.Component {
  constructor(props) {
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.loaded = this.loaded.bind(this)
    this.state = {loaded: false}
  }
  get backButton() {
    return (
      <BackButton ButtonClick={this.props.BackButtonClicked}
                  className="player-back-button" />
    )
  }
  get info() {
    return new Promise((resolve, reject) => {
      fetch(`/nfo?id=${this.props.Identifier}`, {headers: {'X-Token': this.props.AuthToken}})
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw `unexpected HTTP status "${response.statusText}" for "/nfo?id=${this.props.Identifier}"`
        }
      }).then(resolve).catch(reject)
    })
  }
  componentWillUnmount() { if( this.player ) this.player.dispose() }
  loaded() { this.setState({loaded: true}) }
  componentDidMount() {
    this.info.then(info => {
      let src = this.props.sources || []
      src.push({
        src: `/vid?id=${this.props.Identifier}&auth=${this.props.AuthToken}`,
        type: info.MimeType
      })
      return src
    }).catch(err => {
      Flash.WARNING(`error fetching info ${err}, trying default MIME type`)
      let src = this.props.sources || []
      src.push({
        src: `/vid?id=${this.props.Identifier}&auth=${this.props.AuthToken}`,
        type: 'video/mp4'
      })
      return src
    })
    // eslint-disable-next-line promise/always-return
      .then(src => {
        this.player = videojs(
          this.videoElement,
          {sources: src, autoplay: true, controls: true},
          this.loaded
        )
      })
      .catch(Flash.CRITICAL)
  }
  render() {
    return (
      <div className="videojs-player-parent">
        {this.backButton}
        <div className={`video-wrapper-${this.state.loaded? 'ready': 'not-ready'}`}>
          <video ref={elem => this.videoElement = elem}
                 className='video-js vjs-big-play-centered'
                 autoPlay controls
          />
        </div>
      </div>
    )
  }
}

Player.propTypes = {
  BackButtonClicked: PropTypes.func.isRequired,
  AuthToken: PropTypes.string.isRequired,
  Identifier: PropTypes.string.isRequired,
  sources: PropTypes.array
}
