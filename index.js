'use strict';

const Promise = require('bluebird');
const co = require('co');

function wrapFunctions(target, methodNames) {
    _actualMethodKeys(target).forEach(function(key) {
        let constructor = target[key].constructor.name;

        if (methodNames) {
            if (methodNames.indexOf(key) === -1) return;
        } else if (!key.endsWith('Async') && constructor !== 'GeneratorFunction') {
            return;
        }
        var newKey = key.substring(0, key.length - 5);
        if (target[key].constructor.name === 'GeneratorFunction') {
            target[newKey] = co.wrap(target[key]);
        } else {
            target[newKey] = Promise.method(target[key]);
        }

        delete target[key];
    });
}


function _actualMethodKeys(target) {
    return Object.getOwnPropertyNames(target)
    .filter(key => {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
        return !propertyDescriptor.get && !propertyDescriptor.set;
    })
    .filter(key => typeof target[key] === 'function');
}

class AsyncClass {
    constructor () {
        var proto = Object.getPrototypeOf(this);
        wrapFunctions(proto);
        wrapFunctions(this);
    }
}

module.exports = AsyncClass;