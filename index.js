module.exports = (cfg) => {
    const config = require('./lib/config').set(cfg)
    const cli = require('./lib/cli')(config)
    const sync = require('./lib/operations/sync')
    const download = require('./lib/operations/download')
    const upload = require('./lib/operations/upload')
    const create = require('./lib/operations/create')
    const reset = require('./lib/operations/reset')
    
    return {
        config,
        cli,
        sync: (data) => sync(config, data),
        download: (data) => download(config, data),
        upload: (data) => upload(config, data),
        create: (data) => create(config, data),
        reset: () => reset(config)
    }
}
