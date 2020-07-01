const path = require('path');
const fs = require('fs-extra');
const publicip = require('public-ip');
const { prompt } = require('enquirer');
const { flags: flagTypes } = require('@oclif/command');
const BaseCommand = require('../../oclif/command/BaseCommand');
const MuteOneLineError = require('../../oclif/errors/MuteOneLineError');

class ConfigCreateCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @param {Object} flags
   * @return {Promise<void>}
   */
  async runWithDependencies(
    {
      'config': config,
    },
    flags,
  ) {
    try {
      //check we aren't using a reserved config. maybe we can set static
      //names of reserved configs as a static variable somewhere else?
      if (config === 'local' ||
          config === 'evonet' ||
          config === 'testnet' ||
          config === 'config') {
          console.error('This config name is reserved, please try another.')
          this.exit();
      };

      //first argument is the name of the config
      const configFile = path.join(this.config.configDir, (config + '.json'));

      fs.ensureFile(configFile);

      //check config does not already exist
      fs.readdir(this.config.configDir)
        .then(function (files) {
          for (let file in files) {
            if (files[file] === (config + '.json')) {
              throw new Error('This configuration already exists'); // Why is this error so horrible??
            }
          }
        })


      //determine which information we still need to collect
      //make sure we only define MINIMUM configuration here
      //everything else gets modified with the get/set commands
      //don't forget to validate
      if (Object.values(flags).some(x => (x === null))) {
        let questions = [];

        if (!flags.network) {
          questions.push({
            type: 'select',
            name: 'network',
            message: 'Which network do you want to use?',
            initial: 1,
            choices: ['local', 'evonet', 'testnet']
          })
        }

        if (!flags.projectName) {
          questions.push({
            type: 'input',
            name: 'projectName',
            message: 'Enter a Docker Compose project name',
            initial: 'dash_masternode'
          })
        }

        if (!flags.coreVersion) {
          questions.push({
            type: 'input',
            name: 'coreVersion',
            message: 'Enter the Docker version tag you want use for Dash Core',
            required: true
          })
        }

        if (!flags.externalIp) {
          questions.push({
            type: 'input',
            name: 'externalIp',
            message: 'What is your IP address?',
            initial: await publicip.v4(),
            required: true
          })
        }

        if (!flags.p2pPort) {
          questions.push({
            type: 'input',
            name: 'p2pPort',
            message: 'Which port should be used for P2P traffic?',
            initial: 19999, // this should change depending on the selected network
            required: true
          })
        }

        if (!flags.blsPrivKey) {
          questions.push({
            type: 'input',
            name: 'blsPrivKey',
            message: 'Enter your BLS operator private key',
            //initial: // would be great to have an option generate bls keypairs here
            required: true
          })
        }

        // collect remaining information from user
        const res = await prompt(questions);

        // replace if value was provided
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            flags[key] = res[key];
          }
        }
      }

      //write out config file. should it be flat like this, or do we
      //want to nest the settings into sections? if we do start nesting,
      //then maybe it is easier to store the entire config in one file,
      //and add/remove json sections each time instead of
      //creating/deleting files? what is best practice or more
      //user-friendly?
      await fs.writeJson(configFile, {
        network: flags.network,
        projectName: flags.projectName,
        coreVersion: flags.coreVersion,
        externalIp: flags.externalIp,
        p2pPort: flags.p2pPort,
        blsPrivKey: flags.blsPrivKey,
      });

    } catch (e) {
      console.log(e);
      throw new MuteOneLineError(e); // Not working?
    }
  }
}

ConfigCreateCommand.description = 'Creates a new node configuration';

ConfigCreateCommand.args = [{
  name: 'config',
  required: true,
  description: 'config name',
},
/*
// not sure how to implement this
{
  name: 'from-config',
  required: false,
  description: 'config to use as base',
}*/];

ConfigCreateCommand.flags = {
  'network': flagTypes.string({ char: 'n', description: 'network to use', default: null }),
  'project-name': flagTypes.string({ char: 'r', description: 'prefix for services', default: null }),
  'core-version': flagTypes.string({ char: 'c', description: 'Dash Core version', default: null }),
  //'platform-version': flagTypes.string({ char: 'v', description: 'Dash Platform version', default: null }),
  'external-ip': flagTypes.string({ char: 'i', description: 'public IP address', default: null }),
  'p2p-port': flagTypes.string({ char: 'p', description: 'port for P2P traffic', default: null }),
  'bls-privkey': flagTypes.string({ char: 'b', description: 'BLS private key', default: null }),
};

module.exports = ConfigCreateCommand;
