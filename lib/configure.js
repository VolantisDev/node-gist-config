const Promise = require('bluebird')
const inquirer = require('inquirer')
const chalk = require('chalk')
const confirm = require('./confirm')

module.exports = configure

function configure (config, forceReconfigure) {
    return new Promise((resolve, reject) => {
        if (needsReconfigure(config, forceReconfigure)) {
            reconfigure(config)
                .then(() => { resolve(config) })
                .catch(reject)
        } else resolve(config)
    })
}

function needsReconfigure (config, forceReconfigure) {
    return config.get('gistConfig.interactive', true) && (forceReconfigure || !config.get('gistConfig.gitHubToken'))
}

function questions(config, includeGistId) {
    return [
        {
            type: 'password',
            name: 'gitHubToken',
            message: 'Auth token for GitHub (https://github.com/settings/tokens/new):',
            default: config.get('gistConfig.gitHubToken')
        },
        {
            type: 'input',
            name: 'gistId',
            message: 'Gist ID to sync (blank to handle automatically):',
            default: config.get('gistConfig.gistId'),
            when: includeGistId
        }
    ]
}

function setAnswers(config, answers) {
    return confirm.configure(config, answers)
        .then(confirmed => {
            if (confirmed) {
                if (answers.gitHubToken) {
                    config.set('gistConfig.gitHubToken', answers.gitHubToken)
                }
                        
                if (answers.gistId) {
                    config.set('gistConfig.gistId', answers.gistId)
                }
            }

            return config
        })
}

function reconfigure (config, includeGistId) {
    return inquirer
        .prompt(questions(config, includeGistId))
        .then(answers => setAnswers(config, answers))
}
