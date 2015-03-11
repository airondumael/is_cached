is_cache
---
helper for caching in nodejs

    var is_cache = require('is_cache');
    //is_cache(<key>, <function to fetch data>, <function after fetching data>, <ttl>)
    is_cache('key', function(next) { someAsyncFunction(args..., next) }, function(err, result) {}, 2000);


