module.exports = ((config, spinner) => {
    return {
        setConfig: (cfg) => { config = cfg },
        createGist: (bundles) => require('./create-gist')(config, bundles, spinner),
        createOp: (data) => require('./create-op')(config, data, spinner),
        downloadOp: () => require('./download-op')(config, spinner),
        extractState: (bundles) => require('./extract-state')(config, bundles, spinner),
        generateState: () => require('./generate-state')(config, spinner ),
        importData: (bundles) => require('./import-data')(config, bundles, spinner),
        initialize: () => require('./initialize')(config, spinner),
        packData: (data) => require('./pack-data')(config, data, spinner),
        readGist: () => require('./read-gist')(config, spinner),
        resetOp: () => require('./reset-op')(config, spinner),
        syncOp: (data) => require('./sync-op')(config, data, spinner),
        updateGist: (bundles) => require('./update-gist')(config, bundles, spinner),
        uploadOp: (data) => require('./upload-op')(config, data, spinner)
    }
})
