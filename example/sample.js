'use strict';
var is_cached = require('../lib/is_cached'),
    /**
     * function that accepts data and callback
     * all it does is call the callback passing the
     * recieved data as second argument
     **/
    fakeAsync = function(data, next) {
        process.nextTick(function() {
            next(null, data);
        });
    };

is_cached.init().get('1',
    function(next) {
        fakeAsync({
            data: 123
        }, function(err, result) {
            next(null, result);
        });
    },
    function(err, result) {
        console.log(1, result);
    },
    2000);


is_cached.init().get('1',
    function(next) {
        fakeAsync({
            data: 123
        }, function(err, result) {
            next(null, result);
        });
    },
    function(err, result) {
        console.log(1, result);
    },
    2000);


is_cached.get('2',
    function(next) {
        fakeAsync({
            data: 345
        }, function(err, result) {
            next(null, result);
        });
    },
    function(err, result) {
        console.log(2, result);
    },
    2000);

// retrieve cache with key 1 after 2.5seconds (cache expires after 2secs) so this should accept new data.
setTimeout(function() {
    is_cached.get('1',
        function(next) {
            fakeAsync({
                data: 345
            }, function(err, result) {
                next(null, result);
            });
        },
        function(err, result) {
            console.log('after 2500ms', 1, result);
        },
        2000);
}, 2500);
