// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import './Footer.css';


// A regular <a> link with an href and text provided in the constructor.
class Link {
  constructor(address, text) {
    this.address = address;
    this.text = text;
  }
  get addr() { return this.address; }
  get href() {
    return ( <div className="Footer Footer-link"
                key={this.address}>
              <a href={this.address} className="Footer-link">{this.text}</a>
            </div>
    );
  }
  get asHTML() { return this.href; }
}
// BackgroundLink is actually a div  which performs an XHR onClick, not an <a>
// tag at all. An optional "go" function will be called in place of the XHR
// onClick.
class BackgroundLink extends Link {
  constructor(address, text, gofunc) {
    super(address, text);
    if( gofunc ) this.go = gofunc;
    this.go = this.go.bind(this);
  }
  go() {
    let req = new XMLHttpRequest();
    req.open('GET', process.env.PUBLIC_URL + this.address);
    req.send();
  }
  get asHTML() {
    return (<div className="Footer Footer-link"
                 onClick={ ()=>this.go()}
                 key={this.address}/>
    );
  }
}

const links = [
  new Link("https://gitlab.com/dscottboggs/goMediaServer", "Source Code"),
  new BackgroundLink('/scan', "Scan For Updated Metadata")
];

export default class Footer extends React.Component {
  render() {
    return (
      <div className="Footer" id="Footer-parent">
        { links.map( link => link.asHTML ) }
      </div>
    );
  }
}
