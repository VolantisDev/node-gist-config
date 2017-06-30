var Promise = require('bluebird')
var fs = require('sander')
var jsonfile = Promise.promisifyAll(require('jsonfile'))

module.exports = getDataItem

function fullPath(dataObject, basePath) {
    var basePath = basePath || ''
    var path = dataObject.path || ''

    return path.resolve(basePath, path)
}

function fromDataObject(dataObject) {
    return dataObject.data
}

function fromArrayObject(dataObject, basePath) {
    var items = []

    dataObject.data.forEach(dataItem => {
        items.push(getDataItem(dataItem, basePath))
    })

    return items
}

function fromJsonObject(dataObject, basePath) {
    var path = fullPath(dataObject, basePath)

    return jsonfile.writeFileAsync(path, dataObject.data)
        .then(() => {
            return path
        })
}

function fromFileObject(dataObject, basePath) {
    var path = fullPath(dataObject, basePath)

    return fs.writeFile(path, dataObject.data)
        .then(() => {
            return path
        })
}

function fromDirectoryObject(dataObject, basePath) {
    var files = []
    var requests = dataObject.data

    requests.map(fileObject => {
        return new Promise((resolve, reject) => {
            fromFileObject(fileObject, basePath)
                .then(files.push)
                .then(resolve)
                .catch(reject)
        })
        
    })

    return Promise.all(requests).then(() => {
        return files
    })
}

function getDataItem (dataObject, basePath) {
    return new Promise((resolve, reject) => {
        var dataItem

        if (dataObject.type === 'object') {
            dataItem = fromDataObject(dataObject)
        } else if (dataObject.type === 'array') {
            dataItem = fromArrayObject(dataObject, basePath)
        } else if (dataObject.type === 'json') {
            dataItem = fromJsonObject(dataObject, basePath)
        } else if (dataObject.type === 'file') {
            dataItem = fromFileObject(dataObject, basePath)
        } else if (dataObject.type === 'directory') {
            dataItem = fromDirectoryObject(dataObject, basePath)
        }

        return typeof dataItem !== 'undefined'
            ? dataItem
            : reject('Data object doesn\'t have a valid type')
    })
}
