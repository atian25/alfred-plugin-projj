'use strict';

const path = require('path');
const assert = require('assert');
const alfyTest = require('alfy-test');

describe('test/index.test.js', () => {
  it('should work', async () => {
    const alfy = alfyTest();
    alfy.config.set('HOME', path.join(__dirname, 'fixtures/projj'));

    let result;

    result = await alfy('examples');
    assert(result[0].title === 'not match git project `examples`');

    result = await alfy('egg');
    assert(result.length === 1);
    assert(result[0].title === 'eggjs/egg');
    assert(result[0].arg === '/tmp/github.com/eggjs/egg');
    assert(result[0].mods.alt.arg === 'https://github.com/eggjs/egg');
    assert(result[0].icon.path === path.join(__dirname, '../assets/github.png'));

    result = await alfy('github projj');
    assert(result.length === 2);

    result = await alfy('gitlab test');
    assert(result.length === 1);
    assert(result[0].icon.path === path.join(__dirname, '../assets/gitlab.png'));
  });

  it('should work for projj_v2', async () => {
    const alfy = alfyTest();
    alfy.config.set('HOME', path.join(__dirname, 'fixtures/projj_v2'));

    const result = await alfy('egg');
    assert(result.length === 1);
    assert(result[0].title === 'eggjs/egg');
    assert(result[0].arg === '/tmp/test/github.com/eggjs/egg');
    assert(result[0].icon.path === path.join(__dirname, '../assets/github.png'));
  });

  it('should work for projj_v2_multiply', async () => {
    const alfy = alfyTest();
    alfy.config.set('HOME', path.join(__dirname, 'fixtures/projj_v2_multiply'));

    const result = await alfy('egg');
    assert(result.length === 1);
    assert(result[0].mods.alt.arg === 'https://github.com/eggjs/egg');
    assert(result[0].title === 'eggjs/egg');
    assert(result[0].arg === '/tmp/test/github.com/eggjs/egg');
    assert(result[0].icon.path === path.join(__dirname, '../assets/github.png'));
  });
});
