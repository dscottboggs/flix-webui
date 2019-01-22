// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react'
import PropTypes from 'prop-types'
import VideoBox from './VideoBox'
import Thumbnail from './Thumbnail'
import { SectionStyle, SectionHeadStyle } from './Styles'
import { Flash, ComponentWithThumbnail, not, Sortable } from './misc'
import { DIRECTORY_FILE_TYPE, VIDEO_FILE_TYPE } from './FileMetadata'
import './Section.css'

export default class Section extends ComponentWithThumbnail {
  constructor(props) {
    super(props)
    this.sort = this.sort.bind(this)
    this.toComponents = this.toComponents.bind(this)
    this.makeVideoComponent = this.makeVideoComponent.bind(this)
    this.makeComponent = this.makeComponent.bind(this)
    this.handleClickedHeader = this.handleClickedHeader.bind(this)
    this.handleMouseOverHeader = this.handleMouseOverHeader.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.state.extend({ expanded: this.props.InitiallyExpanded })
  }
  componentDidMount() {
    ComponentWithThumbnail.prototype.componentDidMount.call(this)
    this.sort(this.props.Content.Children)
        .then(this.toComponents)
        .then( made => this.setState({filteredAndSorted: made }) )
        .catch( err => {
            Flash.ERROR(err)
            // eslint-disable-next-line promise/no-nesting
            this.make(this.props.Content.Children)
              .then(made => this.setState( {filteredAndSorted: made.values} ) )
              .catch(err => Flash.CRITICAL(
                "failed to display even unsorted media! Please report this, it's "+
                'definitely a bug. Error message: ' + err))
          })
  }
  get type() {
    return 'Section'
  }
  get style() {
    return SectionStyle(this)
  }
  get headStyle() {
    return SectionHeadStyle(this)
  }
  get numberOfChildren() { return this.props.Content.Children.keys.length }
  // Top-level directories are numerically assigned, others according
  // to their hash
  get isNotTopLevel() { return isNaN(Number(this.props.Content.ID)) }
  get content() {
    if (this.state.filteredAndSorted && this.state.expanded ){
      return (
        <div className={`section-content visible`}
             id={`section-content-${this.props.Content.Title}`}>
          {this.state.filteredAndSorted}
        </div>
      )
    } else {
      return <span className='section-content hidden'/>
    }
  }
  get HeaderContent() {
    if (not(this.isNotTopLevel)) {
      return null
    }
    if( this.state.thumbnailHasLoaded ) return (
      <div className={`section-header-content${this.isNotTopLevel?'':' top-level'}`}
           id={this.props.Content.Title}
           onMouseOver={ this.handleMouseOverHeader }>
        <Thumbnail Identifier={this.props.Content.ID}
                   ParentType={this.type}
                   Source={this.state.ThumbnailSource}/>
        {this.props.Content.Title}
      </div>
    )
    return (
      <div className='section-header-content'
           onMouseOver={ this.handleMouseOverHeader }>
        {this.props.Content.Title}
      </div>
    )

  }
  get headerPadding() { return '1.2em' }
  handleMouseOverHeader() {
    if( this.isNotTopLevel ) this.setState(
      {hasMouseFocus: true},
      () => {
        setTimeout(() => {
          if( this.state.hasMouseFocus ) this.setState({expanded: true})
        }, 200)
      }
    )
  }
  handleMouseLeave() {
    if( this.isNotTopLevel ) this.setState(
      {hasMouseFocus: false},
      () => {
        setTimeout(
          () => {
            if( not(this.state.hasMouseFocus) ) this.setState({expanded: false})
          },
          750
        )
      }
    )
  }
  handleClickedHeader() {
    if( this.isNotTopLevel ) this.setState({expanded: !this.state.expanded})
  }
  makeComponent(content){
    if( content.Type === DIRECTORY_FILE_TYPE ) return (
      <Section key={`video-box-${content.ID}`}
               Content={content}
               ItemClicked={this.props.ItemClicked}
               InitiallyExpanded={false}
               ThumbnailLoaded={this.props.ThumbnailLoaded}
               Thumbnail={content.Thumbnail}
               AuthToken={this.props.AuthToken}/>
    )
    if( content.Type === VIDEO_FILE_TYPE ) return (
      <VideoBox {...this.makeVideoComponent(content)} />
    )
    // Flash.WARNING(
    //   `got unknown typed content in section ${this.props.Title}
    //   content: ${JSON.stringify(content)}
    //   type: ${typeof content}
    //   prototype: ${Object.getPrototypeOf(content)}
    //   key: ${content.ID}`
    // );
  }
  makeVideoComponent(video){
    // separate function to enable testing
    return {
      Identifier: video.ID,
      key: video.ID,
      OnClick: this.props.ItemClicked,
      Title: video.Title,
      ThumbnailLoaded: () => this.props.ThumbnailLoaded(video.ID),
      Thumbnail: video.ID,
      AuthToken: this.props.AuthToken
    }
  }
  // Sort the components in this section. Videos come first, then Directories
  sortFunction(elA, elB) {
    if( elA.value.Type === DIRECTORY_FILE_TYPE ) {
      if( elB.value.Type === DIRECTORY_FILE_TYPE ) {
        // fall back on sorting by keys in alphabetical order
        return (elA.key > elB.key)? Sortable.swap : Sortable.noSwap
      }
      if( elB.value.Type !== VIDEO_FILE_TYPE ) throw new TypeError(
        `got unknown filetype at key ${elB.key}`
      )
      // elB is a Video, it should go to the top.
      return Sortable.swap
    }
    if( elB.value.Type === VIDEO_FILE_TYPE ) {
      // fall back on sorting by keys in alphabetical order
      return (elA.key > elB.key)? Sortable.swap: Sortable.noSwap
    }
    if( elB.value.Type !== DIRECTORY_FILE_TYPE ) throw new TypeError(
      `got unknown filetype at key ${elB.key}`
    )
    // elA is a Video, and elB is a Directory
    return Sortable.noSwap
  }
  sort(children) {
    return new Promise((resolve, reject) => {
      new Sortable(children).sortWith(this.sortFunction)
                            .then(resolve)
                            .catch(reject)
    })
  }
  async toComponents(children) {
    return children.map(this.makeComponent)
  }
  render() {
    return (
      <div className='section'
           id={`section-for-${this.props.Content.Title}`}
           style={this.style}
           onMouseLeave={ this.handleMouseLeave }>
        <div className='section-header'
             id={`section-header-${this.props.Content.Title}`}
             style={this.headStyle}
             onClick={ this.handleClickedHeader }>
          {this.HeaderContent}
        </div>
        {this.content}
      </div>
    )
  }
}


Section.propTypes = {
  Content: PropTypes.object.isRequired,
  ItemClicked: PropTypes.func.isRequired,
  InitiallyExpanded: PropTypes.bool.isRequired,
  Thumbnail: PropTypes.string,
  AuthToken: PropTypes.string.isRequired
}
