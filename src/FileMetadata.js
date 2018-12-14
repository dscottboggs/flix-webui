// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import {Sensible, Flash} from './misc';

export const DIRECTORY_FILE_TYPE = Symbol("a file that represents a directory")
export const VIDEO_FILE_TYPE = Symbol("a file that represents a video")
export const PHOTO_FILE_TYPE = Symbol("a file that represents a photo")


function isNotSpecial(key) {
  for( var special of ['thumbnail', 'title']){
    if( key && String(key).toLocaleLowerCase() === special ) return false;
  }
  return true;
}

export class IDNotFoundError extends Error {
  constructor(id) {
    super();
    this.id = id;
  }
  get text() {
    return `ID ${this.id} not found!`;
  }
}

class FileMetadata extends Sensible {
  // Title;
  // ID;
  // Parent;
  // Thumbnail;
  // toJSON() {
  //   return `{FileMetadata type: ${this.Type && this.Type.toString() || undefined}, Title: ${this.Title}, ID: ${this.ID}, Parent: ${this.Parent.ID}}`;
  // }
}

export class Directory extends FileMetadata {
  constructor(obj, ident, parent) {
    //console.debug(`Got ${JSON.stringify(obj)} as Directory`)
    super({
      Title: obj.Title || obj.title,
      ID: ident || null,
      Parent: parent || null,
      Thumbnail: obj.Thumbnail || obj.Thumbnail || null,
      children: new Sensible()
    });
    // Flash.DEBUG(
    //   `got directory from object ${JSON.stringify(obj)}, with id ${ident} and parent ${parent}`
    // );
    this.find = this.find.bind(this);
    this.flatten = this.flatten.bind(this);
    this.Children = obj;
  }
  //read-only value
  get Type() { return DIRECTORY_FILE_TYPE; }
  // Parse subdirectories and video files from the
  set Children(object) {
    // for( var key of Object.keys(object) ){ // doesn't work??
    Object.keys(object).forEach( key => {
      const value = object[key];
      // check for already initialized video/directory objects
      if( Directory.isPrototypeOf(value) || Video.isPrototypeOf(value) ) {
        object[value.ID] = value;
        return;
      }
      // videos are represented in dumps by string: string mappings
      if(  typeof value === 'string' && isNotSpecial(key) ) {
        this.children[key] = new Video(value, key, this);
        return;
      }
      // directories are objects
      if( typeof value === 'object' ) {
        this.children[key] = new Directory(value, key, this);
      }
    });
  }
  get Children() { return this.children.all; }
  async find(ID) {
    if( this.ID === ID) {
      return this;
    }
    const flat = await this.flatten();
    const found = flat[ID];
    if(found) return found;
    throw new IDNotFoundError(ID);
  }
  async flatten() {
    let out = new Sensible();
    let children = this.Children;
    let promises = [];
    for( var idx in children ) {
      const child = children[idx];
      promises.push(child.flatten());
    }
    for( var promise of promises ) {
      let flat = await promise;
      if(isNotSpecial(flat.ID)) out.extend(flat);
    }

    if( out.isEmpty ) throw new Error(
      `unable to flatten ${this.ID}: ${JSON.stringify(this.Children.map(child=>child.Title))}`
    );
    return out;
  }
}


export class Video extends FileMetadata {
  constructor(title, ident, parent) {
    // Flash.DEBUG(`Got ${title} with ID ${ident} as Video`);
    super({
      Title: title,
      ID: ident,
      Parent: parent || null
    });
  }
  get Type() { return VIDEO_FILE_TYPE; }
  get Thumbnail() { return this.ID; }
  flatten() { return new Promise( r => r(new Sensible({[this.ID]: this})) ); }
}
