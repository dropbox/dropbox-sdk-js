import path from 'path';

const { exec } = require('child_process');

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
});
