/******************************************************************************
File Name:    closed_maps_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Closed Maps style
                 2. Implement a method "top25" to a specified object
                    dynamically, not by implementing it within the definition
                    of the object
                 3. Implement the term "me" as a way for objects to
                    self-reference themselves
******************************************************************************/


var fs = require('fs');
var _ = require('lodash');


/******************************************************************************
Function Name:  loadReadWords
Purpose:        This function reads the text file entered by the user and
                splits the contents of the file into an array
Input:          object  - object used to store contents into
                file  - file used to read the contents from
Result:         Stores the contents of the file into an Object's property
******************************************************************************/
function loadReadWords(object, file) {
    var fileContents = __dirname + '/' + file;
    object.fileContents = fs.readFileSync(fileContents, 'utf8');
    object.fileContents = object.fileContents.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/);
}


/******************************************************************************
Function Name:  loadStopReadWords
Purpose:        This function reads the text file 'stop_words.txt' from parent
                directory and splits the contents of the file into an array
Input:          object  - object used to store contents into
Result:         Stores the contents of the file into an Object's property
******************************************************************************/
function loadStopWords(object) {
    var fileContents = __dirname + '/stop_words.txt';
    object.fileContents = fs.readFileSync(fileContents, 'utf8');
    object.fileContents = _.concat(object.fileContents.split(','), 's');
}


/******************************************************************************
Function Name:  increaseCount
Purpose:        This function records the frequencies of each word read and
                stores them into an Object
Input:          object  - object used to store contents into
                word  - the word provided that is being reviewed for frequency
Result:         Calculates the frequency of the word and stores it into the
                Object
******************************************************************************/
function increaseCount(object, word) {
    if (object.wordFrequencies.hasOwnProperty(word)) {
            object.wordFrequencies[word]++;
        }
        else {
            object.wordFrequencies[word] = 1;
        }
}


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


var readWordsObj = {
    fileContents: [],
    initialize: function (file) {
        var me = readWordsObj;
        return loadReadWords(me, file);
    },
    readWords: function () {
        var me = readWordsObj;
        return me.fileContents;
    }
};

var stopWordsObj = {
    fileContents: [],
    initialize: function () {
        var me = stopWordsObj;
        return loadStopWords(me);
    },
    isStopWord: function (word) {
        var me = stopWordsObj
        return me.fileContents.includes(word);
    }
};

var wordFrequenciesObj = {
    wordFrequencies: {},
    increaseCount: function (word) {
        var me = wordFrequenciesObj;
        return increaseCount(me, word);
    },
    sort: function() {
        var me = wordFrequenciesObj;
        return _.toPairs(me.wordFrequencies).sort(function (a, b) {
            return b[1] - a[1];
        });
    },
};


//Initializes the objects associated to the stop words and the words provided by the user
readWordsObj.initialize(process.argv[2]);
stopWordsObj.initialize();


//Counts the frequencies of non-stop words
readWordsObj.readWords().forEach(function (word) {
    if (!stopWordsObj.isStopWord(word)) {
        wordFrequenciesObj.increaseCount(word);
    }
});


//"top25" method that has been dynamically added to wordFrequenciesObj
//Prints out the top 25 most frequent words
wordFrequenciesObj.top25 = function (array) {
    array.forEach(function (index) {
        console.log(index[0] + "  -  " + index[1]);
    });
};


wordFrequenciesObj.top25( wordFrequenciesObj.sort().slice(0, 25) );