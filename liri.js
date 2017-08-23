var Twitter = require('twitter');
var keys = require('./key.js');

var request = require('request');
var fs = require('fs')

var searchInfo = process.argv
var searchThis = '';

for (var i = 3; i < searchInfo.length; i++) {
    if (i > 3 && i < searchInfo.length) {
        searchThis = searchThis + '+' + searchInfo[i]
    }
    //if movie|song name only contain one word
    else {
        searchThis += searchInfo[i];
    }
}



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
                fs.appendFile('logInfo.txt', i + 1 + ') ' + tweets[i].text + '\nCreated at: ' + tweets[i].created_at + '\n\n---------------------------------\n\n', function (err) {
                    if (err) throw err;
                });
            }
        }
        else {
            console.log(error);
        }
    });
};


//spotify-this-song function

function getSpotify() {
    var Spotify = require('node-spotify-api');
    var request = require('request');
    var spotify = new Spotify(keys.spotifyKeys);

    // var songArr = process.argv;
    // var songName = '';

    if (searchThis === '') {
        spotify
            .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                console.log('\nSong Name: ' + data.name)
                console.log("Artist Name: " + data.artists[0].name);
                console.log("Album Name: " + data.album.name);
                console.log('Preview Link: ' + data.preview_url + '\n')
                fs.appendFile('logInfo.txt', 'Song Name: ' + data.name + '\nArtist Name: ' + data.artists[0].name + '\nAlbum Name: ' + data.album.name + '\nPreview Link: ' + data.preview_url + '\n\n---------------------------------\n\n', function (err) {
                    if (err) throw err;
                });
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    }
    else {
        // to get detail for specific song by certain artist just put song name and flow with artist name
        //for example numb by linkin park:  node liri.js spotify-this-song numb linkin park 
        //without artist name it may print differnt song also called numb
        spotify.search({ type: 'track', query: searchThis }, function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log('\nSong Name: ' + data.tracks.items[0].name)
            console.log('Artist Name: ' + data.tracks.items[0].artists[0].name);
            console.log('Album Name: ' + data.tracks.items[0].album.name);
            console.log('Preview Link: ' + data.tracks.items[0].preview_url + '\n')
            fs.appendFile('logInfo.txt', 'Song Name: ' + data.tracks.items[0].name + '\nArtist Name: ' + data.tracks.items[0].artists[0].name + '\nAlbum Name: ' + data.tracks.items[0].album.name + '\nPreview Link: ' + data.tracks.items[0].preview_url + '\n\n---------------------------------\n\n', function (err) {
                if (err) throw err;
            });

        });
    }

}

//omdb movie function
function getMovie() {

    var request = require('request');
    // var movieArr = process.argv;
    // var movieName = '';

    //if user dont type in any movie name, the program will output data for the movie 'Mr. Nobody.'
    if (searchThis === '') {
        searchThis = 'Mr. Nobody'
    }

    // if user type in some moview name

    var queryUrl = "http://www.omdbapi.com/?t=" + searchThis + "&y=&plot=short&apikey=40e9cece";
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

            fs.appendFile('logInfo.txt', 'Title: ' + JSON.parse(body).Title + '\nRelease Year: ' + JSON.parse(body).Year + '\nIMDB Rating: ' + JSON.parse(body).imdbRating + '\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value + '\nCountry: ' + JSON.parse(body).Country + '\nLanguage: ' + JSON.parse(body).Language + 'Plot: ' + JSON.parse(body).Plot + '\nPlot: ' + JSON.parse(body).Plot+ '\nActors: ' + JSON.parse(body).Actors + '\n\n---------------------------------\n\n', function (err) {
                if (err) throw err;
            });
            
        }
    });
};

///do what it say function
function doIt() {
    var fs = require('fs');

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        console.log(dataArr)
        var songAction = dataArr[0];
        var movieAction = dataArr[2];
        var tweetAction = dataArr[4];


        // if(dataArr.length > 1) {
        // 	searchThis = dataArr[1];
        // }

        // switch(action) {
        // 	case "my-tweets":
        // 		getTwitter();
        // 		break;
        // 	case "spotify-this-song":
        // 		getSpotify();
        // 		break;
        // 	case "movie-this":
        // 		getMovie();
        // 		break;
        // }



        if (songAction === 'spotify-this-song') {
            searchThis = dataArr[1];
            getSpotify();
            
        }

        if (movieAction === 'movie-this') {
            searchThis = dataArr[3];
            getMovie();

        }

        if (tweetAction === 'my-tweets') {
            searchThis = dataArr[5];
            getTwitter();
        }

        // for (var i = 0; i < dataArr.length; i++) {
        //     var myAction = dataArr[i++]
        //     searchThis = dataArr[i]
        //     getSpotify();

        //     console.log(searchThis)
        //     console.log(myAction)

        // }

    });
}

