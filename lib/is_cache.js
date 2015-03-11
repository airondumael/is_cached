'use strict';
var _ = require('lodash'),
    store = null,
    queues = {},
    default_settings = {
        ttl: 60000
    },
    settings = {},
    /**
     * Initialize is_cache
     **/
    init = function(options, cacheStore) {
        options = options = {};
        // if no store is define use memory
        store = cacheStore || require('./store/memory');

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
    remove = function(key) {
        store.remove(key);
    },
    /**
     * Clear all cache
     **/
    clear = function() {
        store.clear();
    },
    /**
     * Intercept function that deals with
     * checking if cache exist
     * setting it if it is not
     * and invoking the action after fetching or setting the cache
     **/
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
