const path = require('path');
const fetch = require('node-fetch');

const extract = require('extract-zip');
const prettyByte = require('pretty-bytes');

const fs = require('fs');

const { Observable } = require('rxjs');
const { Listr } = require('listr2');

/**
 * @param {string} homeDirPath
 * @return {downloadBootstrapTask}
 */
function downloadBootstrapTaskFactory(homeDirPath) {
  /**
   * @typedef {downloadBootstrapTask}
   * @param {Config} config
   * @return {Listr}
   */
  function downloadBootstrapTask(config) {
    return new Listr([
      {
        title: 'Check for existing bootstrap',
        task: (ctx, task) => {
          ctx.bootstrapDir = path.join(homeDirPath, 'bootstraps');
          if (!fs.existsSync(ctx.bootstrapDir)) {
            fs.mkdirSync(ctx.bootstrapDir);
          }

          ctx.bootstrapZipFilePath = path.join(ctx.bootstrapDir, `${config.getName()}-bootstrap.dat.zip`);
          if (fs.existsSync(ctx.bootstrapZipFilePath)) {
            ctx.bootstrapExists = true;
            // eslint-disable-next-line no-param-reassign
            task.output = 'Bootstrap zip file already exists, aborting download...';
          } else {
            ctx.bootstrapExists = false;
          }
        },
        options: { persistentOutput: true },
      },
      {
        title: 'Download zip file',
        skip: (ctx) => ctx.bootstrapExists === true,
        task: async (ctx) => {
          let url = '';
          const bootstrapDate = new Date();
          bootstrapDate.setDate(bootstrapDate.getDate() + 1);

          // 3 retries to find the right file
          for (let r = 0; r < 3; r++) {
            url = `https://dash-bootstrap.ams3.digitaloceanspaces.com/${config.getName()}/${bootstrapDate.toISOString().slice(0, 10)}/bootstrap.dat.zip`;
            const res = await fetch(url, {
              method: 'HEAD',
            });
            if (res.ok) {
              break;
            }
            bootstrapDate.setDate(bootstrapDate.getDate() - 1);
          }
          // debug
          url = 'http://192.168.1.4:8080/bootstrap.dat.zip';

          const res = await fetch(url);
          const fileStream = fs.createWriteStream(ctx.bootstrapZipFilePath);
          const size = parseInt(res.headers.get('Content-Length'), 10);
          let written = 0;

          return new Observable(async (observer) => {
            await new Promise((resolve, reject) => {
              res.body.on('data', (data) => {
                fileStream.write(data, () => {
                  written += data.length;
                  observer.next(`${prettyByte(written)} of ${prettyByte(size)} (${((written / size) * 100).toFixed(2)}%)`);
                });
              });
              res.body.on('error', reject);
              res.body.on('end', () => fileStream.close());
              fileStream.on('finish', resolve);
            });

            observer.complete();
          });
        },
      },
      {
        title: 'Unzip bootstrap',
        // skip: (ctx) => ctx.bootstrapExists === true,
        task: async (ctx) => {
          const bootstrapFilePath = path.join(ctx.bootstrapDir, `${config.getName()}-bootstrap.dat`);

          await extract(ctx.bootstrapZipFilePath, { dir: ctx.bootstrapDir });
          fs.renameSync(ctx.bootstrapZipFilePath, bootstrapFilePath);
        },
      },
    ]);
  }

  return downloadBootstrapTask;
}

module.exports = downloadBootstrapTaskFactory;
