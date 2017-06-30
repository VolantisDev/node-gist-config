const configure = require('./lib/configure')
const sync = require('./lib/sync')
const download = require('./lib/download')
const upload = require('./lib/upload')
const create = require('./lib/create')
const reset = require('./lib/reset')

module.exports = (cfg) => {
    const config = require('./lib/config')(cfg)
    
    return {
        config: config,
        configure: () => configure(config),
        reconfigure: () => configure(config, true),
        sync: (data) => sync(config, data),
        download: (data) => download(config, data),
        upload: (data) => upload(config, data),
        create: (data) => create(config, data),
        reset: () => reset(config)
    }
}
