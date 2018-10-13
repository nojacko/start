# [start.nojacko.com](https://start.nojacko.com)

Start is a simple homepage that shows the date, time and background images from [/r/EarthPorn](https://reddit.com/r/EarthPorn) (or any other subreddit).

It was hacked together in early 2016. As such, it's not my best code and everything was done just to get it working quickly. Since then, I've used it every day and it often makes me smile thanks to the amazing pictures.

## Features

* Displays time, date, day and time of day.
* Uses images from [/r/EarthPorn](https://reddit.com/r/EarthPorn) by default. This can be changed using the settings icon.
* Last seen background is saved in local storage so after the first load the initial picture loads instantly thanks to browser caching.
* Stores settings in local storage.

## Development

### Requirements

* node (v6 works)
* npm
* bower (RIP bower. Should switch for yarn and get rid of npm & bower)
* broccoli
* make (not sure why I used make but... whatever... YOLO and all that)

### Setup and Build

* Run `make` for commands.
* Outputs JS/CSS to `/docs/app/` to make use of Github pages.

## Known Issues

* Uses bootstrap and jQuery... there's really no need.
* Only works with imgur hosted images.
* Probably other things...
