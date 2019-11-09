const fs = require('fs').promises;
const del = require('del');
const createLoggerFn = require('./utils/logger');
const createImageRenditions = require('./utils/create-image-renditions');

const logger = {
  debug: createLoggerFn(console.debug, '  '),
  info: createLoggerFn(console.info, '  '),
  warn: createLoggerFn(console.warn, '⚠️'),
  error: createLoggerFn(console.error, '🚨')
};

const exec = async () => {
  try {
    logger.debug('Starting images build...');

    const { renditions, buildConfig } = JSON.parse(await fs.readFile('images.json'));

    logger.debug('Creating output directories...');

    const outputDirJobs = buildConfig.output.map(path => async () => {
      await del(path);
      await fs.mkdir(path, { recursive: true });
    });

    await Promise.all(outputDirJobs.map(job => job()));

    logger.debug('Creating renditions...');

    await createImageRenditions({ logger }, renditions, buildConfig);

    logger.info('Finished building images.', '✅');
  } catch (err) {
    logger.error(err);
    logger.error('Something went wrong, terminating process');
    setImmediate(process.exit.bind(process, 1));
  }
};

exec();
