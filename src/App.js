// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Player from './Player';
import Footer from './Footer';
import MenuWrapper from './MenuWrapper';
import LoginScreen from './Login';
import { IDNotFoundError } from './FileMetadata';
import { Flash, removeSpinner } from './misc';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.VideoWasSelected  = this.VideoWasSelected.bind(this);
    this.backButtonClicked = this.backButtonClicked.bind(this);
    this.authorizationReceived = this.authorizationReceived.bind(this);
    this.state = {
      auth: null,
      playing: null
    };
  }
  authorizationReceived(json){
    Flash.DEBUG(`received auth token ${JSON.stringify(json)}`);
    this.loadingScreen.parent.addChild(this.loadingScreen.spinner);
    this.setState({auth: json.token});
  }
  async VideoWasSelected(identifier) {
    try {
      this.setState(
        {playing: await this.state.rootDirectories.find(identifier) }
      );
    } catch (err) {
      if( !IDNotFoundError.isPrototypeOf(err) ) throw err;
      this.setState({playing: null});
      Flash.ERROR(
        `Invalid ID ${JSON.stringify(identifier)} was clicked, with error: ${err}`
      );
    }
  }
  backButtonClicked() { this.setState({playing: null}); }
  get playerOptions() {
    return {
      BackButtonClicked: this.backButtonClicked,
      autoplay: true,
      controls: true,
      sources: [{
        src: `/vid?id=${this.state.playing.ID}`
      }]
    };
  }
  get MainBody() {
    if (!this.state.auth) {
      this.loadingScreen = removeSpinner();
      return <LoginScreen Callback={this.authorizationReceived}/>;
    }
    if( this.state.rootDirectories === null ) return null;
    if( this.state.playing ) return <Player { ...this.playerOptions } />;
    return <MenuWrapper OnSelected={this.VideoWasSelected}/>;
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
    );
  }
}
