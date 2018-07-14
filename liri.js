
require("dotenv").config();
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var cmd = process.argv;
var searchTerm = [];
var newRequest = "";

for (var i = 3; i < cmd.length; i++) {
    searchTerm.push(cmd[i]);
}

var params = {
    screen_name: 'LucasCondon1',
    count: 10,
    trim_user: true
}

var divider = "\n------------------------------------------------------------\n\n";

function returnTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error.message);
        }
        var arr = [];
        for (var i = 0; i < tweets.length; i++) {
            console.log(`${tweets[i].text} : ${tweets[i].created_at}`);
            var tweet = `${tweets[i].text} : ${tweets[i].created_at}`;
            arr.push(tweet);
        }
        fs.appendFile("log.txt", arr.join("\n\n") + divider, function(err) {
            if (err) throw err;
          });
    });
}

function returnSong(search) {
    spotify.search({ type: 'track', query: search.join(" ") }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var arr =[
        `Title: ${data.tracks.items[0].name}`,
        `Artist: ${data.tracks.items[0].artists[0].name}`,
        `Album: ${data.tracks.items[0].album.name}`,
        `Preview URL: ${data.tracks.items[0].preview_url}`
        ];
        fs.appendFile("log.txt", arr.join("\n\n") + divider, function(err) {
            if (err) throw err;
          });
        console.log(`Title: ${data.tracks.items[0].name}`);
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
        console.log(`Preview URL: ${data.tracks.items[0].preview_url}`);
    });
}

function returnMovie(search) {
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + search.join("+"), function (error, response, body) {
        if (error) {
            console.log('error:', error);
        };
        var res = JSON.parse(body);
        var arr =[
            `Title: ${res.Title}`,
            `Year: ${res.Year}`];
        for (var i = 0; i < res.Ratings.length; i++){
            arr.push(res.Ratings[i].Source + ": " + res.Ratings[i].Value)
        }
        arr.push(`Country: ${res.Country}`);
        arr.push(`Language: ${res.Language}`);
        arr.push(`Summary: ${res.Plot}`);
        arr.push(`Actors: ${res.Actors}`);
        fs.appendFile("log.txt", arr.join("\n\n") + divider, function(err) {
            if (err) throw err;
          });
        for (var i = 0; i<arr.length;i++){
            console.log(arr[i]);
        }
    });
}

function returnRandom() {
    var arr = [];
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err.message);
        }
        arr = data.split(",");
        var arr2 = arr[1].split(" ");
        switch (arr[0]) {
            case 'my-tweets':
                returnTweets();
                break;
            case 'spotify-this-song':
                returnSong(arr2);
                break;
            case 'movie-this':
                returnMovie(arr2);
                break;
            }
    });
}

switch (cmd[2]) {
    case 'my-tweets':
        returnTweets();
        break;
    case 'spotify-this-song':
        returnSong(searchTerm);
        break;
    case 'movie-this':
        returnMovie(searchTerm);
        break;
    case 'do-what-it-says':
        returnRandom();
        break;
}