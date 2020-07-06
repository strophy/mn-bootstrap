const path = require('path');
const fs = require('fs-extra');
const { configs } = require('../../util/configs');
const BaseCommand = require('../../oclif/command/BaseCommand');

const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

class ConfigSetCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @return {Promise<void>}
   */
  async runWithDependencies({
    //'config': config,
    'option': option,
    'value': value,
  }) {
    try {
      let { config, presets } = await configs(this);
      const configFilePath = path.join(this.config.configDir, 'config.json');
      const configFile = require(configFilePath);
      const objIndex = configFile.configs.findIndex(x => x.name === config);

      presets[option] = value;
      configFile.configs[objIndex] = presets;
      await fs.writeJson(configFilePath, configFile);

    } catch (e) {
      console.log(e);
      throw new MuteOneLineError(e);
    }
  }
}

ConfigSetCommand.description = 'Sets node configuration';

ConfigSetCommand.args = [/*{
  //should we specify the config to use here, or read it from what we
  //specified using `mn config:select <config>`? I think the command
  //written like `mn config:set network evonet` is most user-friendly
  name: 'config',
  required: true,
  description: 'config to use',
},*/
{
  name: 'option',
  required: true,
  description: 'option to set',
},
{
  name: 'value',
  required: true,
  description: 'value to set',
}];

module.exports = ConfigSetCommand;
