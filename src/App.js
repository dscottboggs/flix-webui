// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React, { Component } from 'react'
import './App.css'
import Header from './Header'
import Player from './Player'
import Footer from './Footer'
import MenuWrapper from './MenuWrapper'
import LoginScreen from './Login'
import { Flash, removeSpinner } from './misc'


export default class App extends Component {
  constructor(props) {
    super(props)
    this.VideoWasSelected  = this.VideoWasSelected.bind(this)
    this.backButtonClicked = this.backButtonClicked.bind(this)
    this.authorizationReceived = this.authorizationReceived.bind(this)
    this.state = {
      auth: null,
      playing: null
    }
  }
  authorizationReceived(json){
    Flash.DEBUG(`received auth token ${JSON.stringify(json)}`)
    // if( this.loadingScreen ){
    //   this.loadingScreen
    //     .then(el => el.parent.appendChild(el.spinner))
    //     .catch(err => Flash.CRITICAL(`Failed to display loading screen due to ${err}`));
    // }
    this.setState({auth: json.token})
  }
  VideoWasSelected(identifier) {
    Flash.DEBUG(`identifier: "${identifier}".`)
    this.setState( {playing: identifier } )
  }
  backButtonClicked() { this.setState({playing: null}) }
  get playerOptions() {
    Flash.DEBUG(`playing video at "${this.state.playing}"`)
    return {
      BackButtonClicked: this.backButtonClicked,
      AuthToken: this.state.auth,
      Identifier: this.state.playing
    }
  }
  get MainBody() {
    if(!this.state) return null
    if (!this.state.auth) {
      this.loadingScreen = removeSpinner()
      return <LoginScreen Callback={this.authorizationReceived}/>
    }
    if( this.state.rootDirectories === null ) return null
    if( this.state.playing ) return <Player { ...this.playerOptions } />
    return <MenuWrapper OnSelected={this.VideoWasSelected} AuthToken={this.state.auth}/>
  }
  render() {
    return (
      <div className="App">
        <div className="not-footer">
          <div className="not-footer-content">
            <Header Visible={!this.state.playing}/>
            <div className="App-root">
              {this.MainBody}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
