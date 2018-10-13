import BackgroundPost from 'BackgroundPost';
import QueryParams from 'helpers/QueryParams';
import shuffle from 'helpers/shuffle';
import Settings from 'Settings';
import Subreddit from 'Subreddit';

var HomePage = function()
{
    var _this           = this;
    this.loopTimeout    = null;
    this.bag            = new window.Bag();
    this.settings       = new Settings(this.bag);
    this.subreddit      = new Subreddit(this.bag);

    // Dom Element Caches
    this.$elemBackground        = jQuery('#background');
    this.$elemBackground2       = jQuery('#background_2');
    this.$elemBackgroundSource  = jQuery('#background-source');
    this.$elemGreeting          = jQuery('#greeting');
    this.$elemTime              = jQuery('#time');
    this.$elemDate              = jQuery('#date');

    // Time
    this.date       = null;
    this.lastSec    = -1;
    this.lastMin    = -1;
    this.lastHour   = -1;
    this.lastDate   = -1;

    // Images
    this.possibleBackgrounds = [];

    // Settings
    this.changeImageFadeTime        = 1 * 1000;
    this.delayNextBackgroundUpdate  = false;
}

HomePage.prototype.start = function ()
{
    var _this = this;
    this.settings.init(function() {
        _this.initBackgrounds();
        _this.subreddit.load(
            _this.settings.get('source'),
            _this.settings.get('cacheTime'),
            function(children) {
                _this.getBackgroundsFromChildren(children);
            }
        );

        _this.loop();
    });
}

HomePage.prototype.loop = function()
{
    this.date = new Date();

    // Update
    var sec = this.date.getSeconds();
    if (sec !== this.lastSec) {
        this.updateTime();
        this.lastSec = sec;

        var min = this.date.getMinutes();
        if (min !== this.lastMin) {
            this.lastMin = min;

            var date = this.date.getDate();
            if (date !== this.lastDate) {
                this.updateDate();
                this.lastDate = date;
            }

            var hour = this.date.getUTCHours();
            if (hour !== this.lastHour) {
                this.updateGreeting();
                this.lastHour = hour;
            }
        }
    }

    // Loop
    var _this = this;
    this.loopTimeout = window.setTimeout(function() { _this.loop(); }, 500);
}

HomePage.prototype.updateTime = function()
{
    var now         = moment(),
        hoursMins   = now.format('h:mm'),
        secs        = now.format(':ss'),
        suffix      = now.format('a');

    this.$elemTime.html(hoursMins + '<small>' + secs + '<br />' + suffix + '</small>');
}

HomePage.prototype.updateDate = function() {
    this.$elemDate.text(moment().format('D MMMM YYYY'));
}

HomePage.prototype.updateGreeting = function() {
    var now         = moment(),
        day         = now.format('dddd'),
        hour        = parseInt(now.format('H')),
        timeOfDay   = 'Morning';

    if (hour >= 17) {
        timeOfDay = 'Evening';
    } else if (hour >= 12) {
        timeOfDay = 'Afternoon';
    }

    this.$elemGreeting.text(day + ' ' + timeOfDay);
}

HomePage.prototype.initBackgrounds = function()
{
    var _this = this;

    this.bag.get('last_background', function(error, data) {
        if (error) { return; }

        var backgroundPost = BackgroundPost.createFromJson(data);
        _this.possibleBackgrounds.push(backgroundPost);
        _this.updateBackground();
        _this.delayNextBackgroundUpdate = true;
    });
}

HomePage.prototype.updateBackground = function()
{
    if (this.delayNextBackgroundUpdate) {
        this.delayNextBackgroundUpdate = false;
        return;
    }

    var _this = this;

    if (this.possibleBackgrounds.length > 0) {
        var backgroundPost = this.possibleBackgrounds.shift();
        backgroundPost.loadImage(
            function(backgroundPost) {
                // Cache background
                _this.bag.set('last_background', backgroundPost.toJson());

                // Requeue
                _this.possibleBackgrounds.push(backgroundPost);

                // Replace Background
                _this.$elemBackground2.css('background-image', 'url("' + backgroundPost.url + '")');

                // Fadeout
                _this.$elemBackground.animate({
                    opacity: 0,
                }, _this.changeImageFadeTime, function() {
                    // Hide image link (it'll already be hidden but we want it to fade in)
                    _this.$elemBackgroundSource
                        .css('opacity', 0);

                    // Reset the image and opacity
                    _this.$elemBackground
                        .css('background-image', 'url("' + backgroundPost.url + '")')
                        .css('opacity', 1);

                    // Update Link & fade in
                    _this.$elemBackgroundSource
                        .find('a')
                        .attr('href', 'https://reddit.com' + backgroundPost.post.permalink)
                        .text(backgroundPost.post.title);
                    _this.$elemBackgroundSource
                        .animate({
                            opacity: 1,
                        }, _this.changeImageFadeTime/2);
                });

                // Change Image, if there's more than one in total. Requeue current.
                if (_this.possibleBackgrounds.length > 0) {
                    setTimeout(function() { _this.updateBackground(); }, _this.settings.get('rotate'));
                }
            },
            function(backgroundPost) {
                _this.updateBackground();
            }
        )
    }
}

HomePage.prototype.getBackgroundsFromChildren = function(children)
{
    this.possibleBackgrounds = [];

    if (children) {
        var possibleBackgrounds = [];
        // Loop Posts
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (child.kind == 't3') {
                var backgroundPost = new BackgroundPost(child.data);
                if (backgroundPost.isSuitable()) {
                    possibleBackgrounds.push(backgroundPost);
                }
            }
        }

        if (possibleBackgrounds.length > 1) {
            this.possibleBackgrounds = possibleBackgrounds;
            this.possibleBackgrounds = shuffle(this.possibleBackgrounds);
            this.updateBackground();
        }
    }
}

export default HomePage;
