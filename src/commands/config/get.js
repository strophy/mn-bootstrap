const { configs } = require('../../util/configs');
const BaseCommand = require('../../oclif/command/BaseCommand');

const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

class ConfigGetCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @return {Promise<void>}
   */
  async runWithDependencies({'option': option}) {
    try {
      const { presets } = await configs(this);

      // it would be awesome if we could get tab  completion for option names in this command
      console.log(presets[option]);

    } catch (e) {
      throw new MuteOneLineError(e);
    }
  }
}

ConfigGetCommand.description = 'Gets node configuration';

ConfigGetCommand.args = [/*{
  //see set.js for comment on why this was removed
  name: 'config',
  required: true,
  description: 'config to use',
},*/
{
  name: 'option',
  required: true,
  description: 'option to get'
}];

module.exports = ConfigGetCommand;
