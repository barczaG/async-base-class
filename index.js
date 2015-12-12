'use strict';

const Promise = require('bluebird');
const co = require('co');

class AsyncClass {
	constructor () {
		var proto = Object.getPrototypeOf(this);
		var classMethods = Object.getOwnPropertyNames(proto);
		
		classMethods.forEach(function(method) {
		    var methodName = method;
		    var fn = proto[methodName];
		    
		    if(methodName.endsWith('Async')) {
		        var newKey = methodName.substring(0, methodName.length - 5);

		        if( fn.constructor.name === 'GeneratorFunction') {
		            proto[newKey] = co.wrap(proto[methodName]);
		        } else {
		            proto[newKey] = Promise.method(proto[methodName]);
		        }
		        
		        delete proto[methodName];
		    }
		});
	}
}

module.exports = AsyncClass;