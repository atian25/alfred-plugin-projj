'use strict';

const alfy = require('alfy');
const path = require('path');
const { fs } = require('mz');
const homedir = require('node-homedir');

async function run() {
  const keyword = alfy.input.split(/\s+/);
  let cfg;
  let cache = {};

  // read config
  const homeDir = alfy.config.get('HOME') || homedir();
  const cfgPath = path.join(homeDir, '.projj/config.json');
  const cachePath = path.join(homeDir, '.projj/cache.json');

  if (await fs.exists(cfgPath)) {
    cfg = require(cfgPath);
  } else {
    throw new Error(`${cfgPath} not found, please run \`projj init\` first.`);
  }

  if (await fs.exists(cachePath)) {
    cache = require(cachePath);
  }

  const result = [];
  for (const key of Object.keys(cache)) {
    // filter
    if (keyword.some(str => !key.includes(str))) continue;

    const title = key.substring(key.indexOf('/') + 1);
    const filePath = path.join(cfg.base, key);

    // icon
    let type;
    if (key.startsWith('github.com')) {
      type = 'github';
    } else if (key.startsWith('gitlab')) {
      type = 'gitlab';
    }

    result.push({
      title,
      // subtitle: key,
      arg: filePath,
      // quicklookurl: path.join(filePath, 'README.md'),
      mods: {
        alt: {
          arg: `https://${key}`,
          subtitle: `open in browser`,
        },
        cmd: {
          arg: filePath,
          subtitle: `open in iTerm`,
        },
      },
      icon: {
        path: path.join(__dirname, 'assets', `${type}.png`),
      },
    });
  }

  // response
  if (result.length) {
    alfy.output(result);
  } else {
    alfy.output([ { title: `not match git project \`${alfy.input}\`` }]);
  }
}

run().catch(alfy.err);
