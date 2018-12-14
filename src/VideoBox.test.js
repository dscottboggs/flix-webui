// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import Chai, { expect } from 'chai';
import { mount } from 'enzyme';
import VideoBox from './VideoBox';
import { PLACEHOLDER_IMG } from './misc';


const NO_OP_FUN = () => undefined;


describe('<VideoBox/>', () => {
  it('has the right value for URL', () => {
    // const testval = <VideoBox URL="http://example.com"
    //                           Identifier="test-VideoBox"
    //                           Title="Test VideoBox Title"/>;
    const testval=new VideoBox({
      URL: "http://example.com",
      Identifier: "test-VideoBox",
      Title: "Test VideoBox Title",
      onClick: NO_OP_FUN,
      Thumbnail: PLACEHOLDER_IMG
    });
    //console.log(testval.render())
    expect(testval.URL).to.equal("/vid?id=test-VideoBox");
  });
  it('has the expected properties', () => {
    const baseURL = "http://expected.url/";
    const givenID = "test-Thumbnail";
    const propsobj = {
      URL: baseURL,
      Identifier: givenID,
      Title: "Test VideoBox Title",
      Thumbnail: PLACEHOLDER_IMG
    };
    const testval = new VideoBox(propsobj);
    expect(testval.props).to.deep.equal(propsobj);
  });
  it('responds to a click', () => {
    let called = false;
    const mockfun = () => called = true;
    const givenID = "test-Thumbnail";
    const propsobj = {
      Identifier: givenID,
      Title: "Test VideoBox Title",
      ThumbnailLoaded: NO_OP_FUN,
      OnClick: mockfun,
      Thumbnail: PLACEHOLDER_IMG
    };
    const testval = mount(React.createElement(VideoBox, propsobj));
    testval.mount();
    expect(typeof(testval)).to.not.equal("undefined");
    testval.simulate('click');
    expect(called).to.be.true;
  });
  it("displays when thumbnailHasLoaded is set to true.", () => {
    const givenID = "test-thumb-click-VideoBox";
    const props = {
      Identifier: givenID,
      Title: "Test VideoBox Title",
      ThumbnailLoaded: NO_OP_FUN,
      OnClick: NO_OP_FUN,
      Thumbnail: PLACEHOLDER_IMG
    };
    const box = new VideoBox(props);
    expect(box.state.thumbnailHasLoaded).to.be.false;
    expect(box.thumbnail.type).to.deep.equal("span"); // a generic span component
    expect(box.thumbnail.props).to.include({className: "no-thumbnail"});
    box.state.thumbnailHasLoaded = true;
    expect(box.thumbnail.props).to.include({
      Identifier: box.props.Identifier,
      ClassName: "thumbnail-dimmed",
      ParentType: box.type,
      Source: PLACEHOLDER_IMG,
      // ThumbnailSource: PLACEHOLDER_IMG
    });
  });
});
