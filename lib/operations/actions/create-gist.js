const GistPacker = require('gist-packer')

module.exports = (config, bundles, spinner) => {
    const gistPacker = GistPacker(config.get())

    spinner.text('Creating gist from local data')

    return gistPacker.gist.createGist(bundles)
        .then(id => {
            if (id) {
                spinner.text('Created gist with id ' + id)
                return id
            } else {
                throw new Error('Failed to create new gist')
            }
        })
        .catch(error => {
            spinner.fail('Failed creating gist')
            console.error(error)
            process.exit(1)
        })
}
