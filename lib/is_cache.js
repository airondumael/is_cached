'use strict';
var store = null,
    queues = {},
    defaults = {
        ttl: 60000
    },
    init = function(options, cacheStore) {
        store = cacheStore;

        return this;
    },
    get = function(key, action, next, ttl) {
        if (typeof key !== 'string') {
            throw new Error('Invalid Key.');
        }

        if (typeof action !== 'function' || typeof next !== 'function') {
            throw new Error('Action and Next should be typeof function');
        }

        ttl = ttl || defaults.ttl;

        store.get(key, intercept.bind(this, key, next, action, ttl));
    },
    remove = function(key) {
        store.remove(key);
    },
    clear = function() {
        store.delete();
    },
    intercept = function(key, next, action, ttl, err, result) {
        if (!err && result) {
            next.apply(null, result);
        } else if (queues[key]) {
            queues[key].push(next);
        } else {
            queues[key] = [next];

            action(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                store.set(key, args, ttl);

                queues[key].forEach(function(next) {
                    next.apply(null, args);
                });

                delete queues[key];
            });

        }

    };


exports.init = init;
exports.get = get;
exports.remove = remove;
exports.clear = clear;
