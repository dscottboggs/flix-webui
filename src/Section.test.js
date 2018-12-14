// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import Chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Section from './Section';
import {Directory} from './FileMetadata';
import VideoBox from './VideoBox';
import { not, Sensible, PLACEHOLDER_IMG } from './misc';

let clicked = false;
function onItemClicked() {
  clicked = true;
}

const NOOP_FUN = ()=>undefined; // a void function that does nothing.

const title = "Test section title";
const thumb = "Test section thumbnail ID string";
const content = new Directory(
  {
    itemOne: "value one",
    Title: title,
    Thumbnail: thumb,
    itemTwo: {
      Title: "Item Two",
      Thumbnail: "Item two thumbnail",
      val2key: "value 2"
    },
    itemThree: "Value three"
  }
);
const propsobj = {
  ItemClicked: onItemClicked,
  Content: content,
  InitiallyExpanded: false,
  Thumbnail: thumb
};

const testurl = "http://example.com";

describe('<Section />', () => {
  beforeAll( ()=>clicked=false );
  it('has the expected props', () => {
    const testval = new Section(propsobj);
    expect(testval.props).to.have.own.property('ItemClicked');
    expect(testval.props).to.have.own.property('InitiallyExpanded');
    expect(testval.props.InitiallyExpanded).to.be.false;
    expect(testval.props.Content.Title).to.deep.equal(title);
    expect(testval.props).to.have.own.property('Content');
    expect(testval.props.Content.Title).to.deep.equal(title)
    expect(testval.props.Content.Thumbnail).to.not.be.null;
    expect(testval.props.Thumbnail).to.not.be.null;
    expect(
      testval.props.Content.Children.itemOne.Title
    ).to.deep.equal(
      'value one'
    );
    expect(
      testval.props.Content.Children.itemTwo.Title
    ).to.deep.equal(
      'Item Two'
    );
    expect(
      testval.props.Content.Children.itemTwo.Children.val2key.Title
    ).to.deep.equal(
      "value 2"
    );
  });
  it('responds correctly to the InitiallyExpanded prop', () => {
    let testval = mount(<Section ItemClicked={onItemClicked}
                                 Content={content}
                                 Title={title}
                                 InitiallyExpanded={false}
                                 Thumbnail={thumb}
                                 ThumbnailLoaded={NOOP_FUN} /> );
    testval.mount();
    expect(testval.exists(), 'test value existence').to.be.true;
    expect(testval.find('.section-header')).to.have.length(1);
    expect(testval.find('.section-content.visible')).to.have.length(0);

    testval = mount(<Section ItemClicked={onItemClicked}
                                 Content={content}
                                 Title={title}
                                 InitiallyExpanded={true}
                                 Thumbnail={thumb}
                                 ThumbnailLoaded={NOOP_FUN} /> );
    testval.mount();
    expect(testval.exists(), "the test component doesn't exist.").to.be.true;
    expect(testval.find('.section-content.visible')).to.have.length(0)
    expect(testval.state().expanded).to.be.true;
  });
  it('has the correct content in the header', () => {
    let testval = new Section(propsobj);
    expect(testval.state.thumbnailHasLoaded).to.be.false;
    // console.log(JSON.stringify(testval.HeaderContent))
    expect(testval.HeaderContent.props.children).to.equal(testval.props.Content.Title);
    expect(testval.props.Content.Thumbnail).to.not.be.undefined;
    expect(testval.props.Content.Thumbnail).to.equal(thumb);
    expect(testval.state.ThumbnailSource).to.deep.equal(PLACEHOLDER_IMG);
  });
  it('makes the right video component props', () => {
    let thisTestProps = propsobj;
    let tlCalled = false;
    thisTestProps.ThumbnailLoaded = (key) => tlCalled = key;
    const testval = new Section(thisTestProps);
    const vcomp = testval.makeVideoComponent(content.Children.itemOne);
    expect(vcomp.Identifier).to.deep.equal("itemOne");
    expect(vcomp.OnClick).to.not.be.undefined;
    expect(vcomp.Title).to.deep.equal(content.Children.itemOne.Title);
    expect(tlCalled).to.be.false;
    vcomp.ThumbnailLoaded();
    expect(tlCalled).to.deep.equal("itemOne");
  });
});
