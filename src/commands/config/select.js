const path = require('path');
const fs = require('fs-extra');
const BaseCommand = require('../../oclif/command/BaseCommand');
const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

class ConfigSelectCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @return {Promise<void>}
   */
  async runWithDependencies({'config': config}) {
    try {
      await fs.ensureDir(this.config.configDir);

      //first argument is the name of the config to load
      const loadConfigFile = path.join(this.config.configDir, ('config.json'));
      const configFile = path.join(this.config.configDir, (config + '.json'));

      //check config file exists
      if (!await fs.pathExists(configFile)) {
        console.error('Configuration does not exist, please set the configuration first.')
        this.exit();
      };

      //load config file
      await fs.writeJson(loadConfigFile, {
        config: config,
      });

    } catch (e) {
      console.log(e);
      throw new MuteOneLineError(e); // Not working?
    }
  }
}

ConfigSelectCommand.description = 'Selects node configuration';

ConfigSelectCommand.args = [{
  name: 'config',
  required: true,
  description: 'config to use',
}];

module.exports = ConfigSelectCommand;
