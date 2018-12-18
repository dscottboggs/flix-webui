import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Section from './Section';
import Dump from './Dump';
import { Flash, removeSpinner } from './misc';

export default class MenuWrapper extends Component {
  constructor(props) {
    super(props);
    this.sectionProps      = this.sectionProps.bind(this);
  }
  componentDidMount() {
    Dump.request()
      .then(roots => this.setState(
        {rootDirectories: roots},
        () => removeSpinner()))
      .catch(err => Flash.ERROR(`error getting roots, ${err};`));
  }
  get sections() {
    if( !this.state.rootDirectories ) return null;
    return this.state.rootDirectories.map(
      (root, i) => {
        if(root.Children) return <Section {...this.sectionProps(root, i)} />;
        // type check ^^
        return null;
      }
    ).values;
  }
  sectionProps(root, index) {
    // Flash.DEBUG(
    //   `returning props for root (keys: ${Object.keys(root)}; values `,
    //   `${Object.values(root)}) at index ${index}. root has children ${root.Children}`);
    // The root directories are shown as a list (as there can be more than one
    // "root"), so they're indexed numerically
    if( isNaN(index) ) {
      Flash.ERROR( `Got root ${root} with non-numeric index ${index}`);
      return null;
    }
    return {
      Content: root,
      InitiallyExpanded: true,
      ItemClicked: this.VideoWasSelected,
      Thumbnail: root.thumbnail,
      Title: root.Title,
      key: `rootdir ${index}`
    };
  }
  render() {
    return <div className="menu-wrapper">{this.sections}</div>;
  }
}

MenuWrapper.propTypes = {
  OnSelected: PropTypes.func.isRequired
};
