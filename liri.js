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

//omdb movie function 
function getMovie() {

    var request = require('request');
    var movieArr = process.argv;
    var movieName = '';

    //if user dont type in any movie name, the program will output data for the movie 'Mr. Nobody.'
    if (process.argv[3] === undefined) {
        movieName = 'Mr. Nobody'
    }

    // if user type in some moview name
    else {
        for (var i = 3; i < movieArr.length; i++) {
            //if the movie has more than 1 words
            if (i > 3 && i < movieArr.length) {
                movieName = movieName + ' ' + movieArr[i]
            }
            //if the movie contains only one word
            else {
                movieName += movieArr[i];
            }
        }

    }



    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    //console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //console.log(JSON.parse(body));
            console.log('\nTitle: ' + JSON.parse(body).Title);
            console.log('Release Year: ' + JSON.parse(body).Year);
            console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
            if (JSON.parse(body).Ratings[1] === undefined) {
                console.log('There is no Rotten Tomatoes Rating for this movie!')
            }
            else {
                console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
            }
            console.log('Country: ' + JSON.parse(body).Country);
            console.log('Language: ' + JSON.parse(body).Language);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Actors: ' + JSON.parse(body).Actors + '\n');
        }
    });
};

