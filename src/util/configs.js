const path = require('path');

/**
 * Asynchronously handle config
 * @param {Object} ctx Current context
 * @return {Promise<object>} The promise to await
 */
async function configs(ctx) {
  try {
    // is it safe to read files with sync like this? everything else
    // needs to wait for settings anyway, so maybe without async like
    // this is better
    const configFile = require(path.join(ctx.config.configDir, 'config.json'));
    
    const config = configFile.config;
    const presets = configFile.configs.find(x => x.name === config);

    // we should validate minimum required configuration here
    // or maybe when creating the file?

    return {config, presets};
  } catch (error) {
    console.log('error!');
  }
}

module.exports.configs = configs;
