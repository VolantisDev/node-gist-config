const GistPacker = require('gist-packer')

module.exports = (config, bundles, spinner) => {
    const gistPacker = GistPacker(config.get())

    spinner.text('Importing downloaded data')

    return gistPacker.packer.unpack(bundles)
        .then(items => {
            spinner.text('Successfully imported downloaded data')
            return items
        })
        .catch(error => {
            spinner.fail('Failed importing downloaded data')
            console.error(error)
            process.exit(1)
        })
}
