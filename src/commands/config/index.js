const { configs } = require('../../util/configs');
const path = require('path');

const BaseCommand = require('../../oclif/command/BaseCommand');

class ConfigCommand extends BaseCommand {
  /**
   * @return {Promise<void>}
   */
  async runWithDependencies() {

    console.log(await configs(this));  
      
  }
}

ConfigCommand.description = 'Show current config';

module.exports = ConfigCommand;
