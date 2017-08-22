var Twitter = require('twitter');
var keys = require('./key.js');

var request = require('request');
var fs = require('fs')

//user action: 'my-tweets' | 'spotify-this-song' | 'movie-this' | 'do-what-it-says'
var action = process.argv[2];

if (action === 'my-tweets') {
    getTwitter();
}
else if (action === 'spotify-this-song') {
    getSpotify();
}
else if (action === 'movie-this') {
    getMovie();
}
else if (action === 'do-what-it-says') {
    doIt();
}

//Twitter function
function getTwitter() {
    var client = new Twitter(keys.twitterKeys);

    var params = { screen_name: 'GameOfThrones' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log(i + 1 + ') ' + tweets[i].text);
                console.log('Created at: ' + tweets[i].created_at + '\n');
            }
        }
        else {
            console.log(error);
        }
    });
};