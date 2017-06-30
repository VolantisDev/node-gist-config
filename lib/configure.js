const Promise = require('bluebird')
const inquirer = require('inquirer')
const chalk = require('chalk')

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
    return config.interactive && (forceReconfigure || !(config.gistId || config.gitHubToken))
}

function questions(config) {
    return [
        {
            type: 'password',
            name: 'gitHubToken',
            message: 'Auth token for GitHub (https://github.com/settings/tokens/new):',
            default: config.gitHubToken
        },
        {
            type: 'input',
            name: 'gistId',
            message: 'Gist ID to sync (blank generates a new gist):',
            default: config.gistId
        }
    ]
}

function setAnswers(config, answers) {
    if (answers.gitHubToken) {
         config.set('gistConfig.gitHubToken', answers.gitHubToken)
    }
            
    if (answers.gistId) {
        config.set('gistConfig.gistId', answers.gistId)
    }

    return config
}

function reconfigure (config) {
    console.log(chalk.blue('Starting interactive configuration of gist-config'))

    return inquirer
        .prompt(questions(config))
        .then(answers => setAnswers(config, answers))
}
