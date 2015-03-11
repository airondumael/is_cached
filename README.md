is_cached
---
helper for caching in nodejs

    var is_cached = require('is_cached');
    //is_cached(<key>, <function to fetch data>, <function after fetching data>, <ttl>)
    is_cached('key', function(next) { someAsyncFunction(args..., next) }, function(err, result) {}, 2000);


