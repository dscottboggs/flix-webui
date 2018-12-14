// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import Chai, { expect } from 'chai';
import { mount } from 'enzyme';
import Thumbnail from './Thumbnail';
import { PLACEHOLDER_IMG } from './misc';

const givenID = "test-Thumbnail";
const expectedURL = "/img?id=" + givenID;
const ParentType = "VideoBox";
const propsobj = {
  Identifier: givenID, ParentType: ParentType, Source: PLACEHOLDER_IMG,
};

describe("<Thumbnail/>", () => {
  it('has the expected properties', () => {
    const testval = new Thumbnail(propsobj);
    expect(testval.props).to.deep.equal(propsobj);
    expect(testval.ID).to.deep.equal(' '+givenID)
  });
  it('accepts a ClassName prop and passes that to the img tag', () => {
    const testClassName = "TestClassName";
    const comp = mount(<Thumbnail {...propsobj} className={testClassName}/>);
    comp.mount();
    expect(comp.find('.' + testClassName)).to.have.length(1);
    expect(comp.find('.Thumbnail')).to.be.empty;
  });
  it('defaults to the Thumbnail className prop for the img tag', () => {
    const comp = mount(<Thumbnail {...propsobj} />);
    comp.mount();
    expect(comp.find('.Thumbnail')).to.have.length(1);
  });
  it('the Source prop gets forwarded to the src attribute of the img tag', () => {
    const mntd = mount(<Thumbnail {...propsobj}/>);
    mntd.mount();
    expect(
      mntd.find('img').props()
    ).to.have.own.property(
      'src', PLACEHOLDER_IMG
    );
  });
});
