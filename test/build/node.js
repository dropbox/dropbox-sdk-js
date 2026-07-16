import fs from 'fs';
import os from 'os';
import path from 'path';

const { exec, execFileSync, spawnSync } = require('child_process');

const legacyFetchDependencies = ['node-fetch', 'whatwg-url', 'tr46'];

const findLegacyFetchDependencies = (dependencies, matches = []) => {
  Object.entries(dependencies || {}).forEach(([name, dependency]) => {
    if (legacyFetchDependencies.includes(name)) {
      matches.push(`${name}@${dependency.version}`);
    }
    findLegacyFetchDependencies(dependency.dependencies, matches);
  });
  return matches;
};

describe('Node Definitions', () => {
  describe('JS CJS Imports', () => {
    const dirPath = path.resolve(__dirname, 'node/js_cjs');

    beforeEach((done) => {
      exec(`cd ${dirPath} && npm install`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    it('Require', (done) => {
      exec(`cd ${dirPath} && npm run test:require`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });
  });

  describe('JS ESM Imports', () => {
    const dirPath = path.resolve(__dirname, 'node/js_esm');

    beforeEach((done) => {
      exec(`cd ${dirPath} && npm install`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    it('Import', (done) => {
      exec(`cd ${dirPath} && npm run test:import`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    // Named imports do not currently work.
    // it("Named Import", (done) => {
    //   exec(`cd ${dirPath} && npm run test:namedImport`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(stdout);
    //       done(error);
    //     } else {
    //       done();
    //     }
    //   });
    // });
  });

  describe('TS ES6 Imports', () => {
    const dirPath = path.resolve(__dirname, 'node/ts_es6');

    beforeEach((done) => {
      exec(`cd ${dirPath} && npm install && npm run build`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    it('Import', (done) => {
      exec(`cd ${dirPath} && npm run test:import`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    // Named imports do not currently work
    // it("Named Import", (done) => {
    //   exec(`cd ${dirPath} && npm run test:namedImport`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(stdout);
    //       done(error);
    //     } else {
    //       done();
    //     }
    //   });
    // });
  });

  describe('TS CJS Imports', () => {
    const dirPath = path.resolve(__dirname, 'node/ts_cjs');

    beforeEach((done) => {
      exec(`cd ${dirPath} && npm install && npm run build`, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          done(error);
        } else {
          done();
        }
      });
    });

    // Current Namespace definitions fail compilation
    // it("Require", (done) => {
    //   exec(`cd ${dirPath} && npm run test:require`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.log(stdout);
    //       done(error);
    //     } else {
    //       done();
    //     }
    //   });
    // });
  });

  describe('Built JS ESM entry point', () => {
    it('executes directly in Node', () => {
      const packageRoot = path.resolve(__dirname, '../..');
      const esPackageJson = path.join(packageRoot, 'es/package.json');

      fs.writeFileSync(esPackageJson, '{"type":"module"}\n');
      try {
        execFileSync(
          process.execPath,
          [
            '--input-type=module',
            '--eval',
            [
              "const sdk = await import('./es/index.js');",
              "if (typeof sdk.Dropbox !== 'function' || typeof sdk.DropboxAuth !== 'function') {",
              "  throw new Error('Built ES module did not expose the SDK entry points');",
              '}',
            ].join('\n'),
          ],
          { cwd: packageRoot, stdio: 'pipe' },
        );
      } finally {
        fs.unlinkSync(esPackageJson);
      }
    });
  });

  describe('Runtime dependencies', () => {
    let dirPath;

    before(() => {
      dirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'dropbox-sdk-js-runtime-dependencies-'));
      const npmCache = path.join(dirPath, '.npm-cache');
      const packageRoot = path.resolve(__dirname, '../..');
      const packOutput = execFileSync(
        'npm',
        ['pack', packageRoot, '--pack-destination', dirPath, '--cache', npmCache, '--json'],
        { encoding: 'utf8' },
      );
      const [{ filename }] = JSON.parse(packOutput);
      execFileSync(
        'npm',
        [
          'install',
          '--ignore-scripts',
          '--no-save',
          '--package-lock=false',
          '--cache',
          npmCache,
          path.join(dirPath, filename),
        ],
        { cwd: dirPath, stdio: 'pipe' },
      );
    });

    after(() => {
      fs.rmSync(dirPath, { recursive: true, force: true });
    });

    it('does not install the legacy fetch dependency chain', () => {
      const npmList = spawnSync(
        'npm',
        ['ls', ...legacyFetchDependencies, '--all', '--json'],
        { cwd: dirPath, encoding: 'utf8' },
      );
      if (!npmList.stdout) {
        throw npmList.error || new Error(npmList.stderr);
      }
      const dependencyTree = JSON.parse(npmList.stdout);
      const matches = [...new Set(findLegacyFetchDependencies(dependencyTree.dependencies))];
      if (matches.length > 0) {
        throw new Error(`Legacy fetch dependencies installed: ${matches.join(', ')}`);
      }
    });
  });
});
