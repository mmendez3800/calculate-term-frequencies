var fs = require('fs');


/******************************************************************************
Function Name:  nonStopWords
Purpose:        This function reads the text file, looks as the contents of the
                file, and returns all words that are not stop words
Input:          file  - file used to read the contents from
Result:         Returns an array of non-stop words that came from the text file
******************************************************************************/
function nonStopWords(file) {
    
    
    //Reads contents from file, modifieds contents as needed, and places them into an array
    var readFile = __dirname + '/../' + file;
    var readWords = fs.readFileSync(readFile, 'utf8');
    readWords = readWords.replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase();
    var readWordsArray = readWords.split(/\s+/);
    
    
    //Reads contents from 'stop_words.txt' file, places stop words into an array, and adds 's' to cover corner case
    var stopFile = __dirname + '/../stop_words.txt';
    var stopWords = fs.readFileSync(stopFile, 'utf8');
    var stopWordsArray = stopWords.split(',');
    stopWordsArray.push('s');

    
    //Returns the list of words from text file that are not stop words
    var validWords = readWordsArray.filter(function (arrayElement) {
        return !stopWordsArray.includes(arrayElement); 
    });
    return validWords;
}


//Exports the function from the file so that other files can access it
module.exports = {
    nonStopWords: nonStopWords
}