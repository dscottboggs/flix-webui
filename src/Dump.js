// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import { Sensible, not, Flash } from './misc'
import { Directory, IDNotFoundError } from './FileMetadata'

export function isSpecial(key) {
  return ['Title', 'Thumbnail'].indexOf(key) > -1
}


/* A Dump is what the server sends when it receives a request on the /dmp
 * endpoint. It is an array of root Directory representations. See
 * FileMetadata for more information.
 */
export default class Dump extends Sensible {
  constructor(dump) {
    super()
    this.find = this.find.bind(this)
    this.refresh = this.refresh.bind(this)
    this.request = this.refresh
    this.parse = this.parse.bind(this)
    this.parse(dump)
  }
  get(key) {
    return this[key]
  }
  parse(dump) {
    this.values.forEach((_, key) => delete this[key])
    // assign numeric values to `this`.
    for( let i in dump ) if( not(isNaN(i)) ) this[i] = new Directory(dump[i], i)
    return this.values
  }
  // The 'values' in this case are any elements of this whose keys are numeric.
  get values(){ return this.filter((_, key)=>not(isNaN(key))) }
  async refresh() {
    return this.parse(
      JSON.parse(
        await Dump.request("and don't parse the result.")
      )
    )
  }
  find(ID) {
    return new Promise((resolve, reject) => {
      this.values.forEach(dir => {
        try {
          resolve(dir.find(ID))
        } catch (e) {
          Flash.DEBUG( `In Dump.find(${ID}), at dir ${dir}, got ${e}`)
        }
        reject(new IDNotFoundError(ID))
      })
    })
  }
  async getvideos(){
    const values = this.values
    const videos = new Sensible()
    let flattened = []
    for( var idx in values.all ) {
      let dir = values[idx]
      flattened.push(dir.flatten())
    }
    for(var flat of flattened) {
      for(var id in await flat){
        videos[id] = flat[id]
      }
    }
    return videos
  }
}

Dump.parse = (rawdump) => {
  return new Dump(JSON.parse(rawdump))
}

Dump.AuthHeaders = () => {
  let out = {}
  out['X-Token'] = Dump.AuthToken
  return out
}

// Chainable auth token setter
Dump.setAuthorization = (token, callback) => {
  Dump.AuthToken = token
  Dump.LogoutCallback = callback
  return Dump
}

Dump.request = (noparse) => {
  return new Promise(function(resolve, reject) {
    fetch(process.env.PUBLIC_URL + '/dmp', {headers: Dump.AuthHeaders()})
      .then(processServerResponse)
      .then(text => resolve(noparse? text
                                   : Dump.parse(text)))
      .catch(reject)
  })
}

function processServerResponse(response) {
  if (response.ok) return response.text()
  if (response.status === 403){
    if(Dump.LogoutCallback) Dump.LogoutCallback()
    else throw 'LogoutCallback was not a function!'
  }
  throw 'bad response from server'
}

export function isDump(possiblyADump) {
  if( possiblyADump === null || possiblyADump === undefined ) return false
  return Dump.isPrototypeOf(possiblyADump)
}
