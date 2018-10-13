var Settings = function(bag) {
    this.bag = bag;

    this.reset();

    this.$elemSettings      = jQuery('#settings');
    this.$elemSettingsIcon  = jQuery('#settings-icon');
}

Settings.prototype.init = function(callback) {
    var _this = this;

    this.$elemSettingsIcon.click(function() { _this.toggle(); });
    $('#settings_save').click(function() { _this.save(); });
    $('#settings_reset').click(function() { _this.reset(); _this.save(); });

    // Load it via cache or JSONP
    this.bag.get('settings', function(err, data) {
        if (!err) {
            _this.settings = JSON.parse(data);
            _this.update();
        }
        callback();
    });
};

Settings.prototype.update = function()
{
    $('#settings_subreddit').val(this.settings.source);
    $('#settings_timing').val(this.settings.rotate);
}

Settings.prototype.reset = function() {
    this.settings = {
        source      : 'EarthPorn',
        rotate      : 15 * 1000,
        cacheTime   : 60 * 60,
    };

    this.update();
}

Settings.prototype.save = function() {
    this.toggle();
    this.settings = {
        source      : $('#settings_subreddit').val(),
        rotate      : $('#settings_timing').val(),
        cacheTime   : 60 * 60,
    };

    this._save();
}

Settings.prototype._save = function() {
    this.bag.remove('last_background');
    this.bag.set(
        'settings',
        JSON.stringify(this.settings),
        function() {
            window.location.reload();
        }
    );
}

Settings.prototype.toggle = function() {
    this.$elemSettings.toggle();
}

Settings.prototype.get = function(setting) {
    return (typeof this.settings[setting] === 'undefined') ? null : this.settings[setting];
}

Settings.prototype.set = function(setting, value) {
    this.settings[setting] = value;
}

export default Settings;
