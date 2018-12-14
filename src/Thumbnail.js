// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import PropTypes from 'prop-types';
import { ThumbnailStyle } from './Styles';

// A Thumbnail for a given hash-identified media in the list.
export default class Thumbnail extends React.Component {
  get style() { return ThumbnailStyle(this); }
  get ID() { return this.props.Identifier? ' ' + this.props.Identifier :''; }
  render(){
    // console.debug(`rendering Thumbnail with source ${this.props.Source}`);
    return <img src={this.props.Source}
                className={this.props.ClassName || "Thumbnail"}
                style={this.style}
                alt={`video${this.ID}`} />;
  }
}

Thumbnail.propTypes = {
  ParentType: PropTypes.string.isRequired,
  Identifier: PropTypes.string,
  ClassName: PropTypes.string,
  Source: PropTypes.string.isRequired
};
