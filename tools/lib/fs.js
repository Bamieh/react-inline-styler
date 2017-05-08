/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';

import glob from 'glob';

import rimraf from 'rimraf';
import mkdirp from 'mkdirp';

export const makeDir = name => new Promise((resolve, reject) => {
  mkdirp(name, err => (err ? reject(err) : resolve()));
});

export const cleanDir = (pattern, options) => new Promise((resolve, reject) =>
  rimraf(pattern, { glob: options }, (err, result) => (err ? reject(err) : resolve(result))),
);

export default {
  makeDir,
  cleanDir,
};