var Subreddit = function(bag) {
    this.bag = bag;
}

Subreddit.prototype.load = function(subreddit, cacheTime, callback) {
    var _this = this,
        url = 'https://www.reddit.com/r/' + subreddit + '.json?limit=100';

    // Load it via cache or JSONP
    this.bag.get(url, function(err, data) {
        // Error = no cache
        if (err) {
            // Make JSONP Request
            $.ajax({
                url: url,
                jsonp: 'jsonp',
                dataType: 'jsonp',
                data: data,
                success: function(data) {
                    // Cache
                    _this.bag.set(url, data, cacheTime);

                    // Parse
                    _this.handleResponse(data, callback);
                },
                complete: function() {}
            });
        } else {
            // Cached!
            _this.handleResponse(data, callback);
        }
    });
}

Subreddit.prototype.handleResponse = function(data, callback) {
    var _this       = this,
        isListing   = (data.kind && data.kind === 'Listing'),
        hasData     = (typeof data.data === 'object'),
        hasChildren = (typeof data.data.children === 'object'),
        children    = null;

    if (isListing && hasData && hasChildren) {
        children = data.data.children;
    }

    callback(children);
}

export default Subreddit;
