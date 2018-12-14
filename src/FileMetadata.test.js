// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import Chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  Directory,
  Video,
  DIRECTORY_FILE_TYPE,
  VIDEO_FILE_TYPE
} from './FileMetadata';
import { Sensible } from './misc';

const testDump = new Sensible(
  {itemOne: "value one", itemTwo: {Title: "Item Two", val2key: "value 2"}}
);

Chai.use(chaiAsPromised);

describe('directory', () => {
  it('has the right static attributes', () => {
    const testVal = new Directory(testDump);
    expect(testVal.Title).to.be.undefined;
    expect(testVal.Parent).to.be.null;
    expect(testVal.children.itemOne.Title).to.equal("value one");
    expect(testVal.children.itemOne.ID).to.deep.equal("itemOne");
    expect(testVal.Thumbnail).to.be.null;
    expect(testVal.ID).to.be.null;
    expect(testVal.Type).to.deep.equal(DIRECTORY_FILE_TYPE);
  });
  it('it gathers the right children', () => {
    const testVal = new Directory(testDump);
    expect(testVal.Children).to.not.be.empty;
    expect(testVal.Children.itemOne.Title).to.equal("value one");
    expect(testVal.Children.itemTwo.Title).to.equal("Item Two");
    expect(
      testVal.Children.itemTwo.Children.val2key.Title
    ).to.deep.equal('value 2');
    expect(
      testVal.Children.itemTwo.Children.val2key.Thumbnail
    ).to.deep.equal('val2key');
    let counter = 0;
    testVal.Children.forEach( () => counter++ );
    expect(counter).to.deep.equal(2);
  });
  it('flattens', () => {
    const testVal = new Directory(testDump);
    const willFlatten = testVal.flatten()
    expect(willFlatten).to.not.be.undefined;
    return new Promise((resolve) => {
      willFlatten.then(flat => {
        expect(flat.keys).to.have.length(2);
        expect(flat.itemOne).to.not.be.undefined;
        expect(flat.itemOne.Title).to.deep.equal("value one");
        expect(flat.itemTwo).to.be.undefined;
        expect(flat.val2key).to.not.be.undefined;
        expect(flat.val2key.Title).to.deep.equal("value 2");
      });
      testVal.Children.itemOne.flatten().then(
        flat => expect(
          flat.itemOne
        ).to.deep.equal(
          testVal.Children.itemOne
        )
      );
      resolve();
    });
  });
  it('finds a Video', () => {
    const testVal = new Directory(testDump);
    return Promise.all([
      testVal.find('itemOne').then(found => {
        expect(found.ID).to.deep.equal("itemOne");
        expect(found.Title).to.deep.equal('value one');
        expect(testVal.find('invalid key')).to.be.rejected;
      })
    ]);
  });
  it('finds a Video, recursively', (done) => {
    const testVal = new Directory(testDump);
    testVal.find('val2key').then((found => {
      expect(found.ID).to.deep.equal("val2key");
      expect(found.Title).to.deep.equal('value 2');
      done();
    }));
  });
});

describe('Video',()=>{
  it('has the right static elements', () => {
    const mockParent = "javscript don't give a fuck";
    const testVid = new Video("test video title", "testVideoID", mockParent);
    expect(testVid.Title).to.deep.equal("test video title");
    expect(testVid.Thumbnail).to.deep.equal("testVideoID");
    expect(testVid.ID).to.deep.equal("testVideoID");
    expect(testVid.Type).to.deep.equal(VIDEO_FILE_TYPE);
    expect(testVid.Parent).to.deep.equal(mockParent);
  });
  it('it promises to return a simplified version on flatten()', () => {
    const testVid = new Video("test video title", "testVideoID");
    testVid.flatten().then(flat => {
      expect(flat.testVideoID.Title).to.deep.equal("test video title");
    });
  });
});
