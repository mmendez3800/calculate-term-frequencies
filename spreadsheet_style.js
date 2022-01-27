/******************************************************************************
File Name:    spreadsheet_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Spreadsheet style
******************************************************************************/


var fs = require('fs');
var _ = require('lodash');


//Array used to hold the list of all words associated to the read file
//The words are held within the first element of the array
var allWords = [ [], null ];


//Array used to hold the list of all stop words
//The words are held within the first element of the array
var stopWords = [ [], null ];


//Array used to hold the list of all words that are not stop words
//The words are held within the first element of the array
//The second element of the array is the function used to determine the non-stop words
var nonStopWords = [ [], function () {
                             return allWords[0].map( function (word) {
                                                         if(!stopWords[0].includes(word)) { return word; }
                                                         else { return ''; } } ) } ];


//Array used to hold the list of unique words from the list of non-stop words
//The words are held within the first element of the array
//The second element of the array is the function used to determine the unique words
var uniqueWords = [ [], function () { return _.uniq( _.without(nonStopWords[0], '') ); } ];
 
 
//Array used to hold the list of frequencies associated to each unique word
//The frequencies are held within the first element of the array
//The second element of the array is the function used to count the frequencies of each unique word
var frequencies = [ [], function () {
                            var freq = _.countBy(nonStopWords[0]);
                            var array = [];
                            
                            uniqueWords[0].forEach( function (element) {
                                                        if(freq.hasOwnProperty(element)) {
                                                            array.push(freq[element]); } } );
                            return array; } ];


//Array used to hold the list of unique words and their corresponding frequencies
//Each word and corresonding frequency is held within the first element of the array
//The second element of the array arranges the unique words by the most frequencies present
var sortedWords = [ [], function () {
                            return _.zip(uniqueWords[0], frequencies[0]).sort( function (a, b) {
                                                                                   return b[1] - a[1];
                                                                               } ); } ];


//Array used to represent our spreadsheet concept through columns
var allColumns = [allWords, stopWords, nonStopWords, uniqueWords, frequencies, sortedWords];


/******************************************************************************
Function Name:  update
Purpose:        This function loops through each column within our
                "spreadsheet" and executes the function corresponding to the
                spreadsheet column (if one exists)
Result:         For each column that has a function, executes that function
                and enters the results into the first element
******************************************************************************/
function update() {
    for (var column of allColumns) {
        if (column[1] !== null) {
            column[0] = column[1]();
        }
    }
}


//Updates the contents of the two specified arrays as needed
allWords[0] = fs.readFileSync(__dirname + '/' + process.argv[2], 'utf8').replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase().split(/\s+/);
stopWords[0] = _.concat( fs.readFileSync( __dirname + '/stop_words.txt', 'utf8' ).split(','), 's' );


//Updates the rest of our columns based on their specified functions
update();


//Prints the 25 most frequent terms
sortedWords[0] = sortedWords[0].splice(0, 25);
for(var i = 0; i < sortedWords[0].length; i++) {
    console.log(sortedWords[0][i][0] + '  -  ' + sortedWords[0][i][1]);
}