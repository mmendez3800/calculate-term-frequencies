var fs = require('fs');
var _ = require('lodash');


/******************************************************************************
Function Name:  nonStopWords
Purpose:        This function reads the text file, looks as the contents of the
                file, and returns all words that are not stop words
Input:          file  - file used to read the contents from
Result:         Returns an array of non-stop words that came from the text file
******************************************************************************/
function nonStopWords(file) {
    
    
    //Reads contents from file, modifieds contents as needed, and places them into an array
    var readWords = fs.readFileSync(__dirname + '/../' + file, 'utf8').toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/);
    
    
    //Reads contents from 'stop_words.txt' file, places stop words into an array, and adds 's' to cover corner case
    var stopWords = _.concat( fs.readFileSync( __dirname + '/../stop_words.txt', 'utf8' ).split(','), 's' );


    return _.difference(readWords, stopWords);
}


//Exports the function from the file so that other files can access it
module.exports = {
    nonStopWords: nonStopWords
}