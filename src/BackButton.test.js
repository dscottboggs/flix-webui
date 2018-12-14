// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import BackButton from './BackButton';

describe( "<BackButton />", () => {
  it( "responds to a click", () => {
    let clicked = false;
    const mockfun = () => clicked = true;
    const val = shallow(
      <BackButton ButtonClick={mockfun} environment="testing" />
    );
    expect(clicked).to.be.false;
    val.simulate('click');
    expect(clicked).to.be.true;
  });
});
