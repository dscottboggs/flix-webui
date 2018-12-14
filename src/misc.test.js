// flix-webui: a web ui for the flix media server built on React.js and Video.js.
// Copyright (C) 2018 D. Scott Boggs, Jr.

// Please see LICENSE.md for terms of use and modification

import Chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Sensible, not, Sortable } from './misc';

Chai.use(chaiAsPromised);

const gObj = {itemOne: "value one", itemTwo: {title: "Item Two", val2key: "value 2"}}
const sObj = new Sensible(gObj);

describe('Sensible', () => {
  it('receives attributes from the constructor', () => {
    expect(sObj.itemOne).to.deep.equal(gObj.itemOne);
    expect(sObj.itemTwo.title).to.deep.equal(gObj.itemTwo.title)
  });
  it('gives the original object for its "all" attribute', ()=> {
    expect((()=>true)()).to.be.true;
    expect(sObj.filter(() => true)).to.deep.equal(gObj);
    expect(sObj.all).to.deep.equal(gObj);
  });
  it('has the right keys', () => {
    expect(sObj.keys).to.deep.equal(["itemOne", "itemTwo"]);
  });
  it('has the right values', () => {
    expect(sObj.values).to.deep.equal(Object.values(gObj));
  })
  it('filters out an entry', () => {
    expect(sObj.filter(item => !item.title ).itemTwo).to.be.undefined;
    expect(sObj.filter((_, key) => key !== 'itemOne').itemOne).to.be.undefined;
  });
  it('iterates over the object', ()=> {
    let count = 0;
    sObj.forEach((value, key)=> {
      switch(count){
        case 0:
          expect(key).to.deep.equal('itemOne');
          expect(value).to.deep.equal(gObj.itemOne);
          break;
        case 1:
          expect(key).to.deep.equal('itemTwo');
          expect(value).to.deep.equal(gObj.itemTwo);
        default:
          expect(count).to.not.be.above(1);
      }
      count ++;
    });
    expect(count).to.equal(2);
  });
  it('maps correctly', () => {
    const mapped = sObj.map((value, key) => `new value at ${key}`);
    mapped.forEach(
      (value, key) => expect(value).to.deep.equal(`new value at ${key}`)
    );
  });
  it('can be extended', () => {
    sObj.extend({itemThree: 3});
    expect(sObj.itemThree).to.deep.equal(3);
  });
  it('filters asynchronously', () => {
    sObj.willFilter((value) => typeof value === 'string').then(filtered => {
      expect(filtered.itemOne).to.deep.equal(sObj.itemOne);
      expect(filtered.itemTwo).to.be.undefined;
      expect(filtered.itemThree).to.be.undefined;
    });
  });
  it('properly sets the length property', () => {
    expect(new Sensible().length).to.deep.equal(0);
    expect(new Sensible({nonEmpty: "object"}).length).to.deep.equal(1);
  });
  it('properly sets the isEmpty property', () => {
    expect(new Sensible().isEmpty).to.be.true;
    expect(new Sensible({nonEmpty: "object"}).isEmpty).to.be.false;
  });
});

describe('not', () => {
  it('acts the same as the ! operator', () => {
    expect(not(3)).to.be.false;
    expect(not(0)).to.be.true;
    expect(not("string")).to.be.false;
    const emptyString = "";
    expect(not(emptyString)).to.be.true;
    expect(not({})).to.be.false;
    expect(not([])).to.be.false;
  });
});

describe('Sortable', () => {
  const testobj = {a: 4, b: 3, c: 2, d: 1};
  it('sorts by keys with the default function', () => {
    return expect(new Sortable(testobj).sortByKeys()).to.become([4, 3, 2, 1]);
  });
  it('sorts by keys with a custom function', () => {
    return expect(new Sortable(testobj).sortByKeys(
      (a, b) => a > b? Sortable.noSwap : Sortable.swap
    )).to.become([1, 2, 3, 4]);
  });
  it(
    'sorts "with" a particular function, iterating over key-value pairs',
    () => {
      return expect(new Sortable(testobj).sortWith((a, b)=> {
        expect(a).to.have.own.property('key')
        expect(a).to.have.own.property('value');
        expect(b).to.have.own.property('key')
        expect(b).to.have.own.property('value');
        return a.value < b.value ? Sortable.noSwap: Sortable.swap;
      })).to.become([1, 2, 3, 4]);
    }
  );
  it(
    'sorts by a particular element of the test object which has objects as '+
    'values', () => {
      return expect(
        new Sortable({
          a: {testvalue: 4},
          b: {testvalue: 3},
          c: {testvalue: 2},
          d: {testvalue: 1},
        }).sortByWith('testvalue')
      ).to.become([
        {testvalue: 1}, {testvalue: 2}, {testvalue: 3}, {testvalue: 4}
      ]);
    }
  );
  it(
    'sorts by a particular element of the test object which has arrays as '+
    'values', () => {
      return expect(
        new Sortable({
          a: [4],
          b: [3],
          c: [2],
          d: [1],
        }).sortByWith(0)
      ).to.become([
        [1], [2], [3], [4]
      ]);
    }
  );
  it(
    'has a sortBy().using() chain that works the same as sortByWith',
    async () => {
      return (await new Sortable({
        a: {testvalue: 4},
        b: {testvalue: 3},
        c: {testvalue: 2},
        d: {testvalue: 1},
      }).sortBy('testvalue')).using(Sortable.defaultSortFunction);
    }
  );
})
