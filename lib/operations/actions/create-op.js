module.exports = (config, data, spinner) => {
    const confirm = require('../../cli/confirm')
    const actions = require('./')(config, spinner)
    var bundles

    spinner.text('Creating gist from local data')

    return actions
        .packData(data)
        .then(gistBundles => {
            bundles = gistBundles
            return actions.generateState(gistBundles)
        })
        .then(stateBundle => {
            bundles.push(stateBundle)
            return confirm.create(config, stateBundle)
        })
        .then(confirmed => {
            if (confirmed) {
                return actions.createGist(bundles)
                    .then(id => {
                        if (id) {
                            spinner.text('Uploaded data to new gist ' + id)
                            return id
                        } else {
                            spinner.text('Failed to create new gist')
                            throw new Error('Failed to create new gist')
                        }
                    })
            } else {
                spinner.text('Did not confirm creation, canceling')
                throw new Error('Did not confirm creation, canceling')
            }
        })
        .catch(error => {
            spinner.fail('Failed to create gist')
            console.error(error)
            process.exit(1)
        })
}
