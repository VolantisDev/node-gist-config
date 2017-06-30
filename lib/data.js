var check = require('check-types')
var fs = require('sander')
var isJson = require('is-json')
var dir = require('node-dir')

module.exports = {
    toObject: getDataObject,
    fromObject: getDataItem
}


function getFilePath(data, basePath) {
    return basePath
        ? data.replace(basePath, '')
        : data
}

function toDataObject(data) {
    return {
        type: 'object',
        data: data
    }
}

function toArrayObject(data) {
    var arrayData = [];
    data.forEach(dataItem => { arrayData.push(getDataObject(dataItem)) })

    return {
        type: 'array',
        data: arrayData
    }
}

function toJsonObject(data, path, basePath) {
    return {
        type: 'json',
        path: getFilePath(path, basePath),
        data: JSON.parse(data)
    }
}

function toTextFileObject(data, path, basePath) {
    return {
        type: 'file',
        path: getFilePath(path, basePath),
        data: data
    }
}

function toFileObject(data, basePath) {
    return fs.readFile(data).then(fileData => {
        return isJson(fileData)
            ? toJsonObject(fileData, data, basePath)
            : toTextFileObject(fileData, data, basePath)
    })
}

function toDirectoryObject(data, basePath) {
    return dir.promiseFiles(data)
        .then(files => {
            data = []
            files.forEach(file => { data.push(toFileObject(file, basePath)) })

            return {
                type: 'directory',
                path: getFilePath(path, basePath),
                data: data
            }
        })
}

function getDataObject (data, basePath) {
    return new Promise((resolve, reject) => {
        if (check.nonEmptyObject(data)) {
            return toDataObject(data)
        }

        if (check.array(data)) {
            return toArrayObject(data)
        }

        if (check.nonEmptyString(data)) {
            return fs.stat(data).then(stats => {
                if (stats.isFile(data)) {
                    return toFileObject(data, basePath)
                } else if (stats.isDirectory(data)) {
                    return toDirectoryObject(data, basePath)
                }

                return reject('String provided is not a valid path')
            })
        }

        reject('Data type is not valid.')
    })
}

function getDataItem (dataObject, basePath) {
    return new Promise((resolve, reject) => {
        // @todo restore data objects to their original form
    })
}
