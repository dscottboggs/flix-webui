// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import React from 'react';
import Chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Dump from './Dump';
import { Directory } from './FileMetadata';

Chai.use(chaiAsPromised);

const title = "mock title";
const thumb = "mock thumbnail";
const mockDump = [{
  itemOne: "value one",
  Title: title,
  Thumbnail: thumb,
  itemTwo: {
    Title: "Item Two",
    Thumbnail: "Item two thumbnail",
    val2key: "value 2"
  },
  itemThree: "Value three"
}];
describe('Dump', () => {
  it('has the right static members', () => {
    let testval = new Dump(mockDump)[0];
    expect(testval.ID).to.deep.equal('0');
    expect(testval.Title).to.deep.equal(title);
    expect(testval.Thumbnail).to.deep.equal(thumb);
    expect(testval.Children.itemThree.Title).to.deep.equal("Value three");
    expect(testval.Children.itemThree.ID).to.deep.equal("itemThree");
    // recursion
    expect(testval.Children.itemTwo.Children.val2key.Title).to.deep.equal("value 2");
    expect(testval.Children.itemTwo.Children.val2key.ID).to.deep.equal("val2key");
    expect(testval.Children.itemTwo.Thumbnail).to.deep.equal("Item two thumbnail");
    expect(testval.Children.itemTwo.Title).to.deep.equal("Item Two");
  });
  it('replaces its contents on Parse', () => {
    const testval = new Dump(mockDump);
    testval.parse([{
      newItemOne: "value one",
      Title: "new " + title,
      Thumbnail: "new " + thumb,
      itemTwo: {
        Title: "New Item Two",
        Thumbnail: "new thumb for item2",
        subItemOne: "sub item one",
        subItemTwo: "sub item two"
      }
    }]);
    expect(testval[0].Title).to.deep.equal("new " + title);
    expect(testval[0].Children.itemTwo.Title).to.deep.equal("New Item Two");
    expect(
      testval[0].Children.itemTwo.Children.subItemOne.Title
    ).to.deep.equal(
      "sub item one"
    );
  });
  it('returns the right values', () => {
    const testval = new Dump(mockDump);
    expect(testval.values.keys).to.deep.equal(['0']);
    expect(testval.values[0].Title).to.deep.equal(title);
    expect(testval.values[0].Children.itemTwo.Title).to.deep.equal("Item Two")
  });
  it('properly gathers all the videos', (done) => {
    const testval = new Dump(mockDump);
    // testval.values.forEach((dir, i) => dir.flatten().then(
    //   flat => flat.forEach(
    //     (vid, idx) => console.log(`At index ${idx} got video ${vid.Title}\n\n`)
    //   )
    // ));
    // const willGetVids = testval.getvideos();
    // console.log(willGetVids)
    testval.getvideos().then(allVideos => {
      expect(allVideos.keys).to.deep.equal(['itemOne', 'val2key', 'itemThree']);
      done();
    });
  });
  it("finds a video", (done) => {
    const testval = new Dump(mockDump);
    testval.find('itemOne').then(found => {
      expect(found.Title).to.deep.equal("value one");
      done();
    });
  });
  it("finds a video, recursively", () => {
    return expect(
      new Dump(mockDump).find("val2key")
    ).to.eventually.include(
      {Title: "value 2"}
    );
  });
});
