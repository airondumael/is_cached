'use strict';

/**
 * Memory Cache
 * saves data in a variable for future use
 **/
var cache = {},
    init = function (redisClient) {
        cache = redisClient;
        return this;
    },

    set = function(key, value, ttl) {
        ttl = ttl || 60;
        cache.set(key, value);
        cache.expire(key, ttl);
    },

    get = function(key, callback) {
        if (typeof key !== 'string') {
            throw new Error('Invalid Key.');
        }

        cache.get(key, callback);
    },

    clear = function(cb) {
        var syncs = 0;
        cb = cb || function () {
            //YOLO
        };

        cache.keys("*", function (err, keys) {
            syncs = keys.length;
            if (!keys.length) { cb(null, []); }
            keys.forEach(function (key) {
                cache.del(key, function () {
                   if (!--syncs) {
                        cb.apply(arguments);
                   }
                });
            });
        });
    },

    remove = function(key, cb) {
        removeIfExist(key, cb);
    },

    removeIfExist = function(key, cb) {
        cb = cb || function () {
            //YOLO
        };

        cache.get(key, function (err, result) {
            if (!err) {
                cache.del(key, cb);
            }
        });
    };

exports.init = init;
exports.set = set;
exports.get = get;
exports.clear = clear;
exports.remove = remove;
