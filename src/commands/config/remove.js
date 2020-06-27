const path = require('path');
const fs = require('fs-extra');
const BaseCommand = require('../../oclif/command/BaseCommand');

const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

class ConfigRemoveCommand extends BaseCommand {
    /**
     * @param {Object} args
     * @return {Promise<void>}
     */
    async runWithDependencies({'config': rmConfig}) {
        try {
            //check config exists
            const configFile = path.join(this.config.configDir, (rmConfig + '.json'));
            const { config } = await fs.readJson(path.join(this.config.configDir, ('config.json')));

            if (!await fs.pathExists(configFile)) {
                console.error('Configuration does not exist, please set the configuration first.')
                this.exit();
            };

            //check config is not selected
            if (config === rmConfig) {
                console.error('This configuration is currently selected, please select another configuraiton first.')
                this.exit(); //why does this return an 'ExitError: EEXIT: 0'?
            }

            if (rmConfig === 'local' ||
                rmConfig === 'evonet' ||
                rmConfig === 'testnet' ||
                rmConfig === 'config') {
                console.error('Cannot delete factory default configurations.')
                this.exit();
            };

            await fs.remove(configFile);

        } catch (e) {
            console.log(e);
            throw new MuteOneLineError(e); // Not working?
        }
    }
}

ConfigRemoveCommand.description = 'Removes a configuration';

ConfigRemoveCommand.args = [{
    name: 'config',
    required: true,
    description: 'config to use',
}];

module.exports = ConfigRemoveCommand;
