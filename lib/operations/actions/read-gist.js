const GistPacker = require('../../../../node-gist-packer')

module.exports = (config, spinner) => {
    const gistPacker = GistPacker(config.get())

    spinner.text('Reading remote gist data')

    return gistPacker.gist
        .readGist()
        .then(bundles => {
            spinner.text('Successfully read remote gist data')
            return bundles
        })
        .catch(error => {
            spinner.fail('Failed reading remote gist data')
            console.error(error)
            process.exit(1)
        })
}
