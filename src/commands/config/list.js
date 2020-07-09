const fs = require('fs-extra');
const BaseCommand = require('../../oclif/command/BaseCommand');

const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');
const ConfigManager = require('../../config/ConfigManager');

class ConfigListCommand extends BaseCommand {
  /**
   * @param {ConfigManager} config
   * @return {Promise<void>}
   */
  async runWithDependencies(config) {
    try {
      console.log('Entering list command');

      async () => config.loadConfigs();
      console.log(config);

      this.exit();


      //check config dir exists. actually maybe we can do that in
      //util/configs.js? or in some parent class?
      if (!await fs.pathExists(this.config.configDir)) {
        console.error('Configuration directory does not exist, please set the configuration first.')
        this.exit();
      };

      //there has to be a better way!
      fs.readdir(this.config.configDir)
        .then(function (files){
          const index = files.indexOf('config.json');
          if (index > -1) {
            files.splice(index, 1);
          }
          for (let file in files) {
            console.log(files[file].replace(".json", ""));
          }
        })

    } catch (e) {
      console.log(e);
      throw new MuteOneLineError(e); // Not working?
    }
  }
}

ConfigListCommand.description = 'Lists available configurations';

module.exports = ConfigListCommand;
