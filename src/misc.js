// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import { Component } from 'react';
import { PropTypes } from 'prop-types';
import dedent from 'dedent';


export const DEBUG_MODE = true;

// Log a message
export const Flash = (...message) => {
  if( DEBUG_MODE ) console.log(...message)
};

// Logs a message with debug severity
Flash.LOG = Flash.DEBUG = (...message) => {
  if( DEBUG_MODE ) console.debug(...message)
};
// Logs a message with the default severity
Flash.DEFAULT = Flash.INFO = (...message) => {
  if( DEBUG_MODE ) console.log(...message)
};
// Logs a warning, or a message to the user
Flash.WARN = Flash.WARNING = Flash.MESSAGE = (...message) => {
  if( DEBUG_MODE ) console.log(...message)
};
// Logs an error or unexpected situation
Flash.ERROR = Flash.PROBLEM = (...message) => {
  if( DEBUG_MODE ) console.error(...message)
};
// creates an alert window
Flash.FATAL = Flash.CRITICAL = (...message) => {
  if( DEBUG_MODE ) alert(...message)
};


// Sensible contains some sensible methods for working with generic objects.
// forEach, filter, map -- each take a function that accepts (value, key)
// pairs, or just the values.
// There is also a will... (e.g. willMap, willDoForEach) function for each
// of these that returns a Promise to do the same.
//
// It's important to note that this is intended to be used as a class to hold
// a mapping of data, and will filter out any keys which are found in the
// prototype. Be wary of accidental overrides as well.
export class Sensible {
  constructor(obj) {
    for( var key in obj ) {
      if( Sensible.prototype.hasOwnProperty(key) ) throw TypeError(dedent`
        ${key} is a member of Sensible, from which the inheriting object
        inherits, and should not be overridden unnecessarily. If you want to
        override, you can still subclass, implement separately, or assign after
        the constructor. This is mostly to prevent user input from accidentally
        (or maliciously)overriding one of the methods of this class, then
        getting executed (or failing to execute and causing problems).`
      )
      this[key] = obj[key];
    }
  }
  // returns a generator which will return the result of fun(value, key) each
  // time it's called for each member of the object which it is called from.
  *gMap(fun) {
    for( var key in this ) {
      const value = this[key];
      yield fun(value, key);
    }
  }
  *gFilter(fun) {
    const result = (key) => {return {key: key, value: this[key]}}
    for( var key in this ) {
      const value = this[key];
      if( fun(value, key) ) yield result(key);
    }
  }
  forEach(fun) {
    for( var key in this ){
      fun(this[key], key);
    }
    return this;
  }
  filter(fun) {
    let out = new Sensible();
    for( var key in this ){
      if( fun(this[key], key) ) /* then */ out[key] = this[key];
    }
    return out;
  }
  map(fun) {
    let out = new Sensible();
    for( var key in this ){
      out[key] = fun(this[key], key);
    }
    return out;
  }
  async willFilter(fun) {
    return this.filter(fun);
  }
  willDoForEach(fun) {
    return new Promise(resolve => {
      this.forEach(fun);
      resolve();
    });
  }
  async willMap(fun){
    return this.map(fun);
  }
  get all() { return this.filter(() => true); }
  extend(obj) {
    for( var key in obj ) {
      if( obj.hasOwnProperty(key) ) {
        this[key] = obj[key];
      }
    }
    return this;
  }
  get values() {
    return this.keys.map(key => this[key]);
  }
  get keys() {
    return Object.keys(this.all);
  }
  get length() {
    let count = 0;
    this.forEach(() => count++);
    return count;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

export function not(b) { return !b; }

export const PLACEHOLDER_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4ggVFh4TiLtdhgAAABtpVFh0Q29tbWVudAAAAAAAMXB4IGNsZWFyIGltYWdl6nCYogAAAAtJREFUCNdjYAACAAAFAAHiJgWbAAAAAElFTkSuQmCC";

/* A ComponentWithThumbnail is a React Component that needs a thumbnail.
 *
 * The constructor sets the state of this to a new Sensible with the appropriate
 * starting state for a ComponentWithThumbnail, so in a constructor that extends
 * this, you need to use this.state.extend({...}), not this.state = {...}.
 *
 * Requires the following props:
 *  Thumbnail: the ID of an image accessible at
 *             http://{webroot}/img?id={the prop value},
 *
 * Sets the following state so that you can work with the thumbnail:
 *  thumbnailHasLoaded: true if the actual image has been aquired from the
 *                      server, false if it's still the PLACEHOLDER_IMG.
 *  ThumbnailSource: a URL-encoded image to pass to an <img> tag's 'src'
 *                   parameter. Until the request goes through it's a base64-
 *                   encoded 1px transparent PNG. Once the full image has been
 *                   downloaded, it's base64-encoded and set to this value.
 */
export class ComponentWithThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = new Sensible({
      thumbnailHasLoaded: false,
      ThumbnailSource: PLACEHOLDER_IMG
    });
  }
  checkForThumbnail() {
    if( not(this.props.Thumbnail) ){
      Flash.WARN("thumbnail prop not set");
      this.setState({thumbnailHasLoaded: true});
      return;
    }
    let x = new XMLHttpRequest();
    x.responseType = "blob";
    x.onreadystatechange = ()=>{
      if( x.readyState === XMLHttpRequest.DONE && x.status === 200 ){
        this.setState({
          thumbnailHasLoaded: true,
          ThumbnailSource: URL.createObjectURL(x.response)
        });
      } else if( x.readyState === XMLHttpRequest.DONE && x.status ){
        // uhh... error
        Flash.ERROR(
          `error downloading thumbnail for ${this.props.Title}. status: ${x.status}`
        );
      }
    };
    x.open('GET', `${process.env.PUBLIC_URL}/img?id=${this.props.Thumbnail}`);
    x.withCredentials = true;
    x.send();
  }
  componentDidMount() {
    this.checkForThumbnail();
  }
}
ComponentWithThumbnail.propTypes = {
  Thumbnail: PropTypes.string.isRequired
}

// Adds the sortBy and sortByKeys methods, in addition to the methods defined in
// sensible, to a given object.
export class Sortable extends Sensible {
  // sortBy returns an array of the values of a parameter sorted by the given
  // parameter on each value, or the key if the parameter value is null.
  // the "using" function, if specified, receives mappings like
  // {key: (key value), value: this[(key value)][parameter]}
  // for each key in the subclassed object.
  async sortBy(parameter) {
    if( ( parameter === undefined || parameter === null ) ) {
      return {using: this.sortWith};
    } else {
      let sortable = this.keys.map(
        key => {return {key: key, value: this[key][parameter]}}
      )
      return {
        using: async (sortFunc) => {
          if( sortFunc ){
            sortable.sort(sortFunc);
          } else {
            sortable.sort(
              (a, b) => a.value > b.value? Sortable.swap: Sortable.noSwap
            );
          }
          return sortable.map(sorted => this[sorted.key]);
        }
      }
    }
  }
  async sortByWith(parameter, sortFunc) {
    const ready = await this.sortBy(parameter)
    return ready.using(sortFunc)
  }
  async sortWith(fun) {
    let sortable = this.keys.map(key => {return {key: key, value: this[key]};});
    sortable.sort(fun);
    return sortable.map(sorted => sorted.value)
  }
  // sortBy returns an array of the values of a parameter sorted by their keys
  // in this object, according to fun. returns a function which can receive
  // a sorting function, like so
  // let sortable = new Sortable({... some values ...});
  // sortable.sortByKeys(sortFunction).then(sorted => ... action);
  // //    or
  // sortable.sortByKeys().then(sorted => ...action);
  async sortByKeys(fun) {
    let keys = this.keys;
    keys.sort(fun);
    return keys.map(key => this[key]);
  }
}

Sortable.noSwap = -1;
Sortable.swap = 1;
Sortable.defaultSortFunction = null;
