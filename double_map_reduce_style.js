/******************************************************************************
File Name:    double_map_reduce_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Double Map Reduce style
******************************************************************************/


var fs = require('fs');
var _ = require('lodash');
var xrange = require('xrange');


/******************************************************************************
Function Name:  partitionString
Purpose:        This function partitions a string (the contents of a file) and
                splits them in a specified number of lines
Input:          contents  - The string containing the contents of a file
                numberOfLines  - Specifies how to partition the string in X
                                 amount of lines
Result:         Returns an array of the partitioned string
******************************************************************************/
function partitionString(contents, numberOfLines) {
    var lines = contents.split('\r\n');
    var results = [];
    
    for (const i of xrange(0, lines.length, numberOfLines)) {
        results.push(lines.splice(i, i + numberOfLines).join('\n'));
    }
    
    return results;
}


/******************************************************************************
Function Name:  splitWords
Purpose:        This function reviews a string of non-stop words, creates an
                array of [wordN, 1] for each non-stop word N, and addes these
                arrays into a new array
Input:          contents  - The string of words provided
Result:         An array of the form [[word1, 1], [word2, 1], ..., [wordN, 1]]
                for each non-stop word found within the input provided is
                returned
******************************************************************************/
function splitWords(contents) {
    
    
    /******************************************************************************
    Function Name:  splitWords
    Purpose:        This function replaces all non-alphanumeric characters with a
                    whitespace, converts all characters to lowercase form, and
                    splits the string into an array by the whitespace character
    Input:          wordsString  - A string of words
    Result:         Returns an array of strings split into individual words
    ******************************************************************************/
    function scanWords(wordsString) {
        var modifiedWords = wordsString.replace(/[^a-zA-Z0-9]/g, ' ');
        return modifiedWords.toLowerCase().split(/\s+/);
    }
    
    
    /******************************************************************************
    Function Name:  removeStopWords
    Purpose:        This function reviews an array of words and returns all
                    all contents of the array that are not recognized as stop words
    Input:          wordsArray  - An array of words
    Result:         Returns a modified version of the inputted array where all
                    stop words have been removed
    ******************************************************************************/
    function removeStopWords(wordsArray) {
        var file = __dirname + '/stop_words.txt';
        var stopWords = fs.readFileSync(file, 'utf8');
        var splitStopWords = _.concat(stopWords.split(','), 's' );
        
        return _.difference(wordsArray, splitStopWords);
    }
    
    
    var results = [];
    var words = removeStopWords(scanWords(contents));
    for(var w of words) {
        results.push([w, 1]);
    }
    
    return results;
}


/******************************************************************************
Function Name:  regroupArray
Purpose:        This function receives as input an array in the form of
                [[[word1, 1], [word2, 1], ..., [wordN, 1]],
                 [[word1, 1], [word2, 1], ..., [wordN, 1]],
                 ...]
                and returns an Object mapping each unique word to the
                correspodning array of pairs to result in
                {word1: [[word1, 1], [word1, 1], ...],
                 word2: [[word2, 1], [word2, 1], ...],
                 ...}
Input:          arrayPairs  - An array containing pairs which correspond to
                each time a word was found through the above splitWords
                function
Result:         Returns an Object where each key is unique word found within
                the input and the correpsonding value is an array of each pair
                found containing that key
******************************************************************************/
function regroupArray(arrayPairs) {
    var mapping = {};
    
    for(var pair of arrayPairs) {    
        for(var p of pair) {
            
            if(mapping.hasOwnProperty(p[0])) {
                mapping[p[0]].push(p);
            }
            else {
                mapping[p[0]] = [p];
            }
            
        }
    }
    
    return mapping;
}


/******************************************************************************
Function Name:  countWords
Purpose:        This function takes an array of the form
                [word, [[word, 1], [word, 1], ...]] and returns an array of
                [word, frequency] where "frequency" is the number of times the
                word was reported to be found
Input:          mapping  - An array consisting of a word and each instance in
                which the word appeared
Result:         Returns returning the word and the number of times it appears
******************************************************************************/
function countWords(mapping) {
    
    var value = 0;
    for(var pair in mapping[1]) {
        value += mapping[1][pair][1];
    }
    
    return [mapping[0], value];
}


/******************************************************************************
Function Name:  readFile
Purpose:        This function reads the text file entered by the user and
                outputs the contents of the file
Input:          txtfile  - the text file specified by the user
Result:         Returns a string containing the contents of the text file
******************************************************************************/
function readFile(txtFile) {
    var file = __dirname + '/' + txtFile;
    var readTXTFile = fs.readFileSync(file, 'utf8');
    return readTXTFile;
}


/******************************************************************************
Function Name:  sortFrequencies
Purpose:        This function sorts a two-dimensional array by descending order
                based on the second value of each element
Input:          frequencies  - an array of words
Result:         Returns a sorted version of the input
******************************************************************************/
function sortFrequencies(frequencies) {
    var sortedArray = frequencies.sort(function (a, b) {
       return b[1] - a[1];
    });
    
    return sortedArray;
}


//The main function
var splits = partitionString(readFile(process.argv[2]), 200).map(splitWords);
var splitsPerWord = regroupArray(splits);
var wordFrequencies = sortFrequencies(Object.entries(splitsPerWord).map(countWords));

wordFrequencies = wordFrequencies.splice(0, 25);
for(var index = 0; index < wordFrequencies.length; index++) {
    console.log(wordFrequencies[index][0] + "  -  " + wordFrequencies[index][1]);
}