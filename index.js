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
  const homeDir = alfy.config.get('HOME') || /* istanbul ignore next */ homedir();
  const cfgPath = path.join(homeDir, '.projj/config.json');
  const cachePath = path.join(homeDir, '.projj/cache.json');

  /* istanbul ignore else */
  if (await fs.exists(cfgPath)) {
    cfg = require(cfgPath);
  } else {
    throw new Error(`${cfgPath} not found, please run \`projj init\` first.`);
  }

  /* istanbul ignore else */
  if (await fs.exists(cachePath)) {
    cache = require(cachePath);
  }

  const result = [];
  for (const key of Object.keys(cache)) {
    // filter
    if (keyword.some(str => !key.includes(str))) continue;

    const [ host, ...repository ] = key.split('/').splice(-3);
    const title = repository.join('/');

    let filePath;
    if (Array.isArray(cfg.base)) {
      filePath = key;
    } else {
      if (!key.startsWith(cfg.base)) {
        filePath = path.join(cfg.base, key);
      } else {
        filePath = key;
      }
    }

    // icon
    let type;
    if (host.startsWith('github.com')) {
      type = 'github';
    } else if (host.startsWith('gitlab')) {
      type = 'gitlab';
    } else {
      type = 'git';
    }

    result.push({
      title,
      // subtitle: key,
      arg: filePath,
      // quicklookurl: path.join(filePath, 'README.md'),
      mods: {
        alt: {
          arg: `https://${host}/${title}`,
          subtitle: 'open in browser',
        },
        cmd: {
          arg: filePath,
          subtitle: 'open in iTerm',
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
    alfy.output([{ title: `not match git project \`${alfy.input}\`` }]);
  }
}

run().catch(alfy.err);
