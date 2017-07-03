const Promise = require('bluebird')
const inquirer = require('inquirer')
const chalk = require('chalk')
const confirm = require('./confirm')

module.exports = initialize

function initialize (config) {
    return askQuestions(config)
}

function alreadyConfigured (config) {
    return config.initialized || (config.gitHubToken && !config.interactive)
}

function askQuestions (config) {
    return inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'initialize',
                message: 'It looks like you haven\'t initialized your gist sync settings yet. Would you like to do so now?',
                default: true,
                when: !alreadyConfigured(config) && config.get('gitHubToken')
            }
        ])
        .then(answers => {
            const initialize = typeof answers.initialize !== 'undefined' ? answers.initialize : false

            return inquirer.prompt([
                {
                    type: 'password',
                    name: 'gitHubToken',
                    message: 'Auth token for GitHub (https://github.com/settings/tokens/new):',
                    default: config.get('gitHubToken'),
                    when: initialize
                },
                {
                    type: 'input',
                    name: 'gistId',
                    message: 'If you\'ve already configured this before and have a gist ID, you can paste it here:',
                    default: config.get('gistId'),
                    when: initialize
                }
            ])
        })
        .then(answers => {
            if (answers.gitHubToken) {
                config.set('gitHubToken', answers.gitHubToken)
            }

            if (answers.gistId) {
                config.set('gistId', answers.gistId)
            }

            config.set('initialized', true)

            return config
        })
}
