const inquirer = require('inquirer')
const confirm = require('./confirm')

module.exports = initialize

function initialize (config) {
    return questions(config)
}

function askQuestions (confirmed, config) {
    return inquirer.prompt([
        require('./questions/token')(config, confirmed),
        require('./questions/gist-id')(config, confirmed)
    ])
}

function handleAnswers(answers, config) {
    if (answers.token) {
        config.set('token', answers.token)
    }

    if (answers.gistId) {
        config.set('gistId', answers.gistId)
    }
    
    config.set('initialized', true)
    return config
}

function questions (config) {
    return confirm.initialize(config)
        .then(confirmed => askQuestions(confirmed, config))
        .then(answers => handleAnswers(answers, config))
}
