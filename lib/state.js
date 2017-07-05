const Promise = require('bluebird')
const GistPacker = require('../../node-gist-packer')
const name = 'gist-config-state.json'

module.exports = config => {
    const gistPacker = GistPacker(config)

    function generate() {
        return new Promise(resolve => {
            gistPacker.packer.pack(config.get(), { name })
                .then(configBundles => {
                    resolve(configBundles.pop())
                })
        })        
    }

    function extract(bundles) {
        return new Promise(resolve => {
            var stateBundle

            bundles.forEach((bundle, index) => {
                if (bundle.meta.name === name) {
                    stateBundle = bundle
                    delete bundles[index]
                    return false
                }
            })

            resolve(stateBundle)
        })
    }

    function compare (stateA, stateB, prop) {
        prop = prop || 'lastSaved'

        var comp
        if (stateA[prop] > stateB[prop]) {
            comp = 1
        } else if (stateA[prop] < stateB[prop]) {
            comp = -1
        } else {
            comp = 0
        }

        return comp
    }

    return {
        name,
        generate,
        extract,
        compare
    }
}
