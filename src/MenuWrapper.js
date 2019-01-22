import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Section from './Section'
import Dump from './Dump'
import { IDNotFoundError } from './FileMetadata'
import { Flash, removeSpinner } from './misc'

export default class MenuWrapper extends Component {
  constructor(props) {
    super(props)
    this.sectionProps      = this.sectionProps.bind(this)
    this.state = { rootDirectories: null }
  }
  componentDidMount() {
    const { AuthToken, LogoutCallback } = this.props
    Dump.setAuthorization(AuthToken, LogoutCallback)
      .request()
      .then(roots => this.setState(
        {rootDirectories: roots},
        () => removeSpinner()))
      .catch(err => Flash.ERROR(`error getting roots, ${err};`))
  }
  async videoWasSelected(ident) {
    try {
      this.props.OnSelected(await this.state.rootDirectories.find(ident))
    } catch (err) {
      if( !IDNotFoundError.isPrototypeOf(err) ) throw err
      this.setState({playing: null})
      Flash.ERROR(
        `Invalid ID ${JSON.stringify(ident)} was clicked, with error: ${err}`
      )
    }
  }
  get sections() {
    if( !this.state.rootDirectories ) return null
    return this.state.rootDirectories.map(
      (root, i) => {
        if(root.Children) return <Section {...this.sectionProps(root, i)} />
        // type check ^^
        return null
      }
    ).values
  }
  sectionProps(root, index) {
    // Flash.DEBUG(
    //   `returning props for root (keys: ${Object.keys(root)}; values `,
    //   `${Object.values(root)}) at index ${index}. root has children ${root.Children}`);
    // The root directories are shown as a list (as there can be more than one
    // "root"), so they're indexed numerically
    if( isNaN(index) ) {
      Flash.ERROR( `Got root ${root} with non-numeric index ${index}`)
      return null
    }
    // Flash.DEBUG(`got root ${JSON.stringify(root)}`)
    return {
      Content: root,
      InitiallyExpanded: true,
      ItemClicked: this.props.OnSelected,
      Thumbnail: root.Thumbnail,
      Title: root.Title,
      AuthToken: this.props.AuthToken,
      key: `rootdir ${index}`
    }
  }
  render() {
    return <div className="menu-wrapper">{this.sections}</div>
  }
}

MenuWrapper.propTypes = {
  OnSelected: PropTypes.func.isRequired,
  AuthToken: PropTypes.string.isRequired,
  LogoutCallback: PropTypes.func.isRequired
}
