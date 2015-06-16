var redis = require('redis');
    client = redis.createClient(),
    is_cached = require('../lib/is_cached'),
    cache = is_cached.init({ redisClient: client });

var x = function () {
    cache.get(
        'testairon',
        function (next) {
            next(null, 'pangits12345');
        },
        function (err, result) {
            if (err) {
                console.log('err');
                return console.log(err.toString());
            }
            console.log('success', result);

            cache.get(
                'testairon',
                function (next) {
                    next(null, 'pangits123');
                },
                function (err, result) {
                    if (err) {
                        console.log('err')
                        return console.log(err.toString());
                    }
                    console.log('success', result);
                }, 6000
            );

        }, 6000
    );
cache.get(
                'testairon',
                function (next) {
                    next(null, 'pangits123');
                },
                function (err, result) {
                    if (err) {
                        console.log('err')
                        return console.log(err.toString());
                    }
                    console.log('success', result);
                }, 6000
            );

    };



cache.clear(x);
