// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React, { Component } from 'react';
import './App.css';
import Section from './Section';
import Header from './Header';
import Player from './Player';
import Footer from './Footer';
import Dump from './Dump';
import { IDNotFoundError } from './FileMetadata';
import { Flash } from './misc';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.VideoWasSelected  = this.VideoWasSelected.bind(this);
    this.sectionProps      = this.sectionProps.bind(this);
    this.backButtonClicked = this.backButtonClicked.bind(this);
    this.state = {
      auth: null,
      columns: null,
      playing: null,
      rootDirectories: null
    };
  }
  componentDidMount() {
    Dump.request().then(
      roots => this.setState({rootDirectories: roots}, () => removeSpinner())
    ).catch(
      err => {
        Flash.ERROR(
              `error gettting roots, ${err};`);
      }
    );
  }
  async VideoWasSelected(identifier) {
    try {
      this.setState(
        {playing: await this.state.rootDirectories.find(identifier) }
      );
    } catch (err) {
      if( IDNotFoundError.isPrototypeOf(err) ) {
        this.setState({playing: null});
        Flash.ERROR(
          `Invalid ID ${JSON.stringify(identifier)} was clicked, with error: ${err}`
        );
      }else {
        throw err;
      }
    }
    this.state.rootDirectories.refresh();
  }
  sectionProps(root, index) {
    Flash.DEBUG(
      `returning props for root (keys: ${Object.keys(root)}; values `,
      `${Object.values(root)}) at index ${index}. root has children ${root.Children}`);
    if( isNaN(index) ) {
      Flash.ERROR( `Got root ${root} with non-numeric index ${index}`)
      return null;
    }
    return {
      Content: root,
      InitiallyExpanded: true,
      ItemClicked: this.VideoWasSelected,
      Thumbnail: root.thumbnail,
      ThumbnailLoaded: this.thumbnailLoaded,
      Title: root.Title,
      key: `rootdir ${index}`
    };
  }
  backButtonClicked() { this.setState({playing: null}); }
  thumbnailLoaded(id) {
    Flash.DEBUG(
      `Image for ${this.state.rootDirectories[id]}} loaded...`
    );
  }
  get playerOptions() {
    return {
      BackButtonClicked: this.backButtonClicked,
      autoplay: true,
      controls: true,
      sources: [{
        src: `/vid?id=${this.state.playing.ID}`,
        type: 'video/mp4'
      }]
    };
  }
  get MainBody() {
    if( this.state.rootDirectories === null ) return null;
    if( this.state.playing ) return <Player { ...this.playerOptions } />
    return this.state.rootDirectories.map(
      (root, i) => {
        if(root.Children) return <Section {...this.sectionProps(root, i)} />;
        // type check ^^
        return null;
      }
    ).values;
  }
  render() {
    return (
      <div className="App">
        <Header Visible={this.state.playing === null}/>
        <div className="App-root">
          {this.MainBody}
        </div>
        <Footer />
      </div>
    );
  }
}


function removeSpinner() {
  const spinner = document.getElementById('loading-screen-parent');
  spinner.parentNode.removeChild(spinner);
}
