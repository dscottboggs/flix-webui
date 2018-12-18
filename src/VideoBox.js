// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

// A VideoBox holds a thumbnail and the title to a movie for the main page.
import React from 'react';
import PropTypes from 'prop-types';
import Thumbnail from './Thumbnail';
import { ComponentWithThumbnail, Flash } from './misc';
import './VideoBox.css';

// A box to hold a video's title and its thumbnail
class VideoBox extends ComponentWithThumbnail {
  constructor(props){
    super(props);
    this.clicked   = this.clicked.bind(this);
    this.hideTitle = this.hideTitle.bind(this);
    this.showTitle = this.showTitle.bind(this);
    // ComponentWithThumbnail sets state, we need to update that, not overwrite it
    if(!this.state) Flash.WARNING("state was null in VideoBox constructor");
    this.state.extend({ displayTitle: true });
  }
  clicked()  { this.props.OnClick(this.props.Identifier); }
  get URL()  { return `/vid?id=${this.props.Identifier}`; }
  get type() { return "VideoBox"; }
  showTitle() {
    if( this.state.thumbnailHasLoaded ) this.setState({ displayTitle: true });
  }
  hideTitle() {
    if( this.state.thumbnailHasLoaded ) this.setState({ displayTitle: false });
  }
  get title() {
    return (
      <div className='video-box-centering-wrapper-outer'
           onMouseOver={this.hideTitle}
           onMouseOut={this.showTitle}>
        <div className='video-box-centering-wrapper-inner'
             style={ {
                 opacity: this.state.displayTitle? 1: 0,
                 transition: "opacity .3s" } }>
          {this.props.Title}
        </div>
      </div>
    );
  }
  get thumbnail() {
    if( this.state.thumbnailHasLoaded ) {
      return (
        <Thumbnail Identifier={this.props.Identifier}
                   ClassName={`thumbnail-${
                     this.state.displayTitle? 'dimmed': 'not-dimmed'
                   }`}
                   ParentType={this.type}
                   Source={this.state.ThumbnailSource} />
      );
    }
    return <span className="no-thumbnail" />;
  }
  render() {
    return (
      <div className="video-box"
           id={`video-${this.props.Identifier}-parent`}
           onClick={() => this.clicked()}>
        { this.thumbnail }
        <div className="video-box-title"
             id={`video-${this.props.Identifier}-title`}>
          {this.title}
        </div>
      </div>
    );
  }
}

VideoBox.propTypes = {
  Identifier: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  OnClick: PropTypes.func.isRequired,
  // ThumbnailLoaded: PropTypes.func.isRequired,
  Thumbnail: PropTypes.string.isRequired,
  AuthToken: PropTypes.string.isRequired
};

export default VideoBox;
