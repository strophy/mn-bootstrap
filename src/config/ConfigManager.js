const path = require('path');
const fs = require('fs-extra');

class ConfigManager /* extends Config? */ {
  /**
   * 
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Load configs from file
   * 
   * @return {Promise<Config>}
   */
  async loadConfigs() {
    try {
      console.log('Entering loadConfigs function');

      const configFile = path.join(this.config.configDir, ('config.json'));

      //check config file exists
      if (!await fs.pathExists(configFile)) {
        console.error('Configuration does not exist, please set the configuration first.')
        this.exit();
      };
      const configData = fs.readJSONSync(configFile);

      for (let config in configData.configs) {
        console.log(config);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @return {Promise<void>}
   */
  async saveConfigs() {
    const configFile = path.join(this.config.configDir, 'config.json');
    try {
      fs.writeJSONSync(configFile, config)
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @return {Promise<Array>}
   */
  async getAllConfigs() {

  }

  /**
   * @param {string} name
   * @param {string} [fromConfig]
   * @return {Promise<void>}
   */
  async create(name, fromConfig = undefined) {

  }

  /**
   * @param {string} name
   * @return {Promise<void>}
   */
  async remove(name) {

  }

  /**
   * @param {string} name
   */
  setCurrentConfig(name) {

  }

  /**
   * @param {string} name
   */
  getConfig(name) {

  }
}

module.exports = ConfigManager;
