var BackgroundPost = function(post) {
    this.post = post;
    this.url = this.post.url;
    this.thumbnailUrl = null;
    this.image = new Image();
}

BackgroundPost.createFromJson = function(json) {
    var obj = JSON.parse(json);
    var backgroundPost = new BackgroundPost(obj.post)
    backgroundPost.post = JSON.parse(obj.post);
    backgroundPost.url = obj.url;
    backgroundPost.thumbnailUrl = obj.thumbnailUrl;
    return backgroundPost;
};

BackgroundPost.prototype.toJson = function() {
    return JSON.stringify({
        post: JSON.stringify(this.post),
        url: this.url,
        thumbnailUrl: this.thumbnailUrl,
    });
};

BackgroundPost.prototype.post = null;

BackgroundPost.prototype.isSuitable = function () {
    var url = new window.URI(this.url);

    // We want DIRECT Imgur images
    if (url.hostname().search(/i\.imgur\.com/) > -1) {
        var suffix = url.suffix();
        if (suffix === 'gifv') {
            url.suffix('gif');
            this.url = url.toString();
            return true;
        }

        if (suffix === 'jpg' || suffix === 'gif' || suffix === 'png') {
            return true;
        }
    }

    return false;
}

BackgroundPost.prototype.loadImage = function (success, failure) {
    var _this = this;
    this.image.onload = function() {
        // Is it the removed image?
        if (_this.image.height === 81 && _this.image.width === 161) {
            console.log('Error loading image (removed)', _this.url);
            if (failure) {
                failure(_this);
            }
            return;
        }

        console.log('Success loading image', _this.url);
        if (success) {
            success(_this);
        }
    };
    this.image.onerror = function() {
        console.log('Error loading image (error)', _this.url);
        if (failure) {
            failure(_this);
        }
    }
    this.image.src = this.url;
}

export default BackgroundPost;
