// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react'
import PropTypes from 'prop-types'
import { Flash } from './misc'
import './Footer.css'


// A regular <a> link with an href and text provided in the constructor.
class Link {
  constructor(address, text) {
    this.address = address
    this.text = text
  }
  get addr() { return this.address }
  get href() {
    return ( <div className="Footer Footer-link"
                  key={this.address}>
      <a href={this.address} className="Footer-link">{this.text}</a>
    </div>
    )
  }
  asHTML() { return this.href }
}
// BackgroundLink is actually a div  which performs an XHR onClick, not an <a>
// tag at all. An optional "go" function will be called in place of the XHR
// onClick.
class BackgroundLink extends Link {
  constructor(address, text, gofunc) {
    super(address, text)
    if( gofunc ) this.go = gofunc
    this.go = this.go.bind(this)
  }
  go(token) {
    fetch(this.address, {headers: {'x-token': token}})
      .then(Flash.INFO(this.text + ' done.'))
      .catch(e => Flash.ERROR(this.text + ' ' + e))
  }
  asHTML(token) {
    return (
      <div className="Footer Footer-link"
           onClick={ ()=>this.go(token)}
           key={this.address}> {this.text}
      </div>
    )
  }
}

let links = [
  new Link('https://gitlab.com/dscottboggs/goMediaServer', 'Source Code'),
  new BackgroundLink('/scan', 'Scan For Updated Metadata')
]

export default class Footer extends React.Component {
  constructor(props) {
    super(props)
    links.push(this.logout)
  }
  get logout() {
    return new BackgroundLink('/sign_out', 'Log out', this.props.LogoutCallback)
  }
  get links() {
    return links.map( link => link.asHTML(this.props.AuthToken) )
  }
  render() {
    return (
      <div className="Footer" id="Footer-parent">
        { this.links }
      </div>
    )
  }
}

Footer.propTypes = {
  LogoutCallback: PropTypes.func.isRequired,
  AuthToken: PropTypes.string.isRequired
}
