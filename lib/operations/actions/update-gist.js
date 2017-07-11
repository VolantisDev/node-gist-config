const GistPacker = require('../../../../node-gist-packer')

module.exports = (config, bundles, spinner) => {
    const gistPacker = GistPacker(config.get())

    spinner.text('Updating gist from local data')

    return gistPacker.gist.updateGist(bundles)
        .then(id => {
            spinner.text('Updated gist with id ' + id)
            return id
        })
        .catch(error => {
            spinner.fail('Failed updating gist')
            console.error(error)
            process.exit(1)
        })
}
