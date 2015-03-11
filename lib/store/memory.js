'use strict';

/**
 * Memory Cache
 * saves data in a variable for future use
 **/

var cache = {},
    set = function(key, value, ttl) {
        var now = (new Date()).getTime(),
            expire = ttl + now,
            record = {
                value: value,
                expire: expire,
            },
            timeout = setTimeout(function() {
                delete cache[key];
            }, ttl);

        record.timeout = timeout;

        cache[key] = record;
    },
    get = function(key, callback) {
        if (typeof key !== 'string') {
            throw new Error('Invalid Key.');
        }

        var record = cache[key],
            now = (new Date()).getTime();

        if (typeof record === 'undefined' || record.expire < now) {
            return callback({
                message: 'Cache does not exist.'
            }, null);
        }

        callback(null, result);
    },
    clear = function() {
        Object.keys(cache).forEach(function(key) {
            removeIfExist(key);
        });
    },
    remove = function(key) {
        removeIfExist(key);
    },
    removeIfExist = function(key) {
        var record = cache[key];

        if (typeof record === 'undefined') {
            return false;
        }

        clearTimeout(cache[key].timeout);
        delete cache[key];
    };

exports.set = set;
exports.get = get;
exports.clear = clear;
exports.remove = remove;
