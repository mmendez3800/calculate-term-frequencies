/******************************************************************************
File Name:    lazy_rivers_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Lazy Rivers style
******************************************************************************/


var fs = require('fs');
var _ = require('lodash');


/******************************************************************************
Function Name:  characters
Purpose:        This generator function reads a file, splits the contents of
                the file into lines, and returns a Generator object which
                represents a single character within the file
Input:          fileName  - The name of the file containing our contents
Result:         Returns a Generator object which repersents a character within
                the file specified
******************************************************************************/
function* characters(fileName) {
    var file = fs.readFileSync(__dirname + '/' + fileName, 'utf8');
    var lines = file.split('\r\n');
    
    for(var text of lines) {
        for(var character of text) {
            yield character;
        }
    }
}


/******************************************************************************
Function Name:  allWords
Purpose:        This generator function iterates through the generator function
                'characters' using a specified file, checks that each Generator
                object is alphanumeric, and returns a Generator object which
                represents an entire word
Input:          fileName  - The name of the file containing our contents
Result:         Returns a Generator object which repersents a full word within
                the file specified
******************************************************************************/
function* allWords(fileName) {
    var startingChar = true;
    var word = '';
    
    for(var char of characters(fileName)) {
        
        if(startingChar) {
            if(/[a-zA-Z0-9]/.test(char)) {
                word = char.toLowerCase();
                startingChar = false;
            }
        }
        
        else {
            if(/[a-zA-Z0-9]/.test(char)) {
                word = word.concat(char.toLowerCase());
            }
            else {
                startingChar = true;
                yield word;
            }
        }
    }
}


/******************************************************************************
Function Name:  nonStopWords
Purpose:        This generator function iterates through the generator function
                'allWords' using a specified file, checks that each Generator
                object is not a stop word, and returns a Generator object which
                represents the non-stop word
Input:          fileName  - The name of the file containing our contents
Result:         Returns a Generator object which repersents a non-stop word
                within the file specified
******************************************************************************/
function* nonStopWords (fileName) {
    var stopWords = _.concat(fs.readFileSync(__dirname + '/stop_words.txt', 'utf8').split(','), 's');
    
    for(var word of allWords(fileName)) {
        if(!stopWords.includes(word)) {
            yield word;
        }
    }
}


/******************************************************************************
Function Name:  countAndSort
Purpose:        This generator function iterates through the generator function
                'nonStopWords' using a specified file, checks that each
                Generator object is added to our local Object, calculates the
                frequency of the non-stop word, and returns a Generator object
                which each non-stop word with their corresponding frequency
                (where the words are sorted by hightest frequency)
Input:          fileName  - The name of the file containing our contents
Result:         Returns a Generator object which repersents each non-stop word
                and their corresponding frequency (sorted by highest frequency)
                within the file specified
******************************************************************************/
function* countAndSort (fileName) {
    var frequencies = {};
    var i = 1;
    
    for(var word of nonStopWords(fileName)) {
        if(frequencies.hasOwnProperty(word)) {
            frequencies[word]++;
        }
        else {
            frequencies[word] = 1;
        }
        
        if(i % 5000 == 0) {
            yield _.toPairs(frequencies).sort(function (a, b) { return b[1] - a[1]; });
        }
        i++;
    }
    
    yield _.toPairs(frequencies).sort(function (a, b) { return b[1] - a[1]; });
}


//The main function which prints the top 25 most frequent non-stop words
var finalWordFrequencies = [];
for(var wordFrequencies of countAndSort(process.argv[2])) {
    finalWordFrequencies = wordFrequencies.splice(0, 25);
}
for(var i = 0; i < finalWordFrequencies.length; i++) {
    console.log(finalWordFrequencies[i][0] + '  -  ' + finalWordFrequencies[i][1]);
}