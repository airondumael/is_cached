'use strict';
var _ = require('lodash'),
    store = null,
    queues = {},
    default_settings = {
        ttl: 60000
    },
    settings = {},
    /**
     * Initialize is_cached
     **/
    init = function(options, cacheStore) {
        options = options || {};
        // if no store is define use memory
        store = cacheStore || require('./store/memory');

        if (options.redisClient) {
            store = require('./store/redis').init(options.redisClient);
        }
        settings = _.extend(default_settings, options);
        return this;
    },
    /**
     * Get or Set and then invoke callback
     **/
    get = function(key, action, next, ttl) {
        if (typeof key !== 'string') {
            throw new Error('Invalid Key.');
        }

        if (typeof action !== 'function' || typeof next !== 'function') {
            throw new Error('Action and Next should be typeof function');
        }

        // if ttl is undefined use default ttl (60000ms can be overriden by passing options in init)
        ttl = ttl || settings.ttl;

        store.get(key, intercept.bind(this, key, next, action, ttl));
    },
    /**
     * Remove cache with key
     **/
    remove = function(key, cb) {
        store.remove(key, cb);
    },
    /**
     * Clear all cache
     **/
    clear = function(cb) {
        store.clear(cb);
    },
    /**
     * Intercept function that deals with
     * checking if cache exist
     * setting it if it is not
     * and invoking the action after fetching or setting the cache
     **/
    intercept = function(key, next, action, ttl, err, result) {
        var args = arguments;

        if (!err && result) {
            next.call(null, null, result);
        } else if (queues[key]) {
            queues[key].push(next);
        } else {
            queues[key] = [next];
            action(function() {
                store.set(key, arguments[1], ttl);
                args = arguments;
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
