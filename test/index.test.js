'use strict';

const path = require('path');
const assert = require('assert');
const alfyTest = require('alfy-test');

describe('test/index.test.js', () => {
  it('should work', async () => {
    const alfy = alfyTest();
    alfy.config.set('HOME', path.join(__dirname, 'fixtures'));

    let result;

    result = await alfy('examples');
    assert(result[0].title === 'not match git project `examples`');

    result = await alfy('egg');
    assert(result.length === 1);
    assert(result[0].title === 'eggjs/egg');
    assert(result[0].arg === '/tmp/github.com/eggjs/egg');
    assert(result[0].icon.path === path.join(__dirname, '../assets/github.png'));

    result = await alfy('github projj');
    assert(result.length === 2);

    result = await alfy('gitlab test');
    assert(result.length === 1);
     assert(result[0].icon.path === path.join(__dirname, '../assets/gitlab.png'));
  });
});
