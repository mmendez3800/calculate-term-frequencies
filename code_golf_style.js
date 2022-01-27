/******************************************************************************
File Name:    code_golf_style.js
Description:  This term frequency program is to read a text file. From there,
              it is to count the frequency of each term in the file while
              taking into consideration the predeterminded list of stop words
              established. This program is to adhere to the following
              conditions:
                 1. Implement the program using the code golf style
******************************************************************************/


//Utilize the fs library and lodash library
var fs = require('fs');
var _ = require('lodash');

//Reads the list of stop words, adds the string 's' to cover edge case, and splits it into an array
var stopWords = _.concat( fs.readFileSync( __dirname + '/stop_words.txt', 'utf8' ).split(','), 's' );

//Reads the text file, converts all letters to lowercase, converts all non-alphanumeric characters to a white space, and splits it into an array 
var readWords = fs.readFileSync(__dirname + '/' + process.argv[2], 'utf8').toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/);

//Updates the array to remove stop words, counts the frequency of each word, and places the words into an array (by decreasing frequency)
var wordsAndFrequencies = _.toPairs( _.countBy ( _.difference (readWords, stopWords) ) ).sort(function (a, b) { return b[1] - a[1]; });


for (var index = 0; index < 25; index++) { console.log(wordsAndFrequencies[index][0] + "  -  " + wordsAndFrequencies[index][1]); }