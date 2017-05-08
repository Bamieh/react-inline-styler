import cp from 'child_process';
import { makeDir } from './lib/fs';

async function bundle() {
  await makeDir('distribution');
  await new Promise((resolve, reject) => {
     // cp.spawnSync('yarn', ['build', '-t', pkg.name, '.'], { stdio: 'inherit' });
     // babel src --out-file distribution/index.js
     cp.spawnSync('babel', ['src', '--out-file', 'distribution/index.js'], { stdio: 'inherit' });
     resolve();
  });
}

export default bundle;