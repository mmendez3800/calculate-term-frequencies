/******************************************************************************
File Name:    no_style.js
Description:  This term frequency program is to read a text file. From there,
              it is to count the frequency of each term in the file while
              taking into consideration the predeterminded list of stop words
              established.
******************************************************************************/


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


//Reads text file specified from command line and checks if an error is thrown from reading the file
var fs = require('fs');
var file = __dirname + '/' + process.argv[2];
fs.readFile(file, 'utf8', function (err, data) { 
    if (err) {
        throw err;
    }
    
    
    //Sorts words from text file into an array of Objects where the highest frequency words appear first
    var wordsArray = splitWords(data);
    var wordsObject = createWordsObject(wordsArray);
    var sortedWordsArray = sortWordsObject(wordsObject);
    
    var i = 0;
    
    
    //Prints all words from text file by highest frequency if number of words is less than 25
    if (sortedWordsArray.length < 25) {
        for (i; i < sortedWordsArray.length; i++) {
            console.log(sortedWordsArray[i].word + "  -  " + sortedWordsArray[i].frequency);
        }
    }
    
    
    //Prints the 25 highest frequency words from text file
    else {
        for (i; i < 25; i++) {
            console.log(sortedWordsArray[i].word + "  -  " + sortedWordsArray[i].frequency);
            }
        }
    });


/******************************************************************************
Function Name:  splitWords
Purpose:        This function splits a text file by words into an array
Description:    This function reads the text file specified by the user from
                the command line. It then converts all characters to lower case
                and replaces all non-alphanumeric characters with a space. The
                text is then split by whitespace characters.
Input:          textfile  - the text file specified by the user
Result:         An array of all words contained within the text file
******************************************************************************/
function splitWords (textFile) {
    var wordsArray = [];
    wordsArray = textFile.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/);
    return wordsArray;
}


/******************************************************************************
Function Name:  createWordsObject
Purpose:        This function creates an Object to store the valid words and
                their frequency in an unformatted manner from an array
Description:    This function first reads the list of stop words specified for
                the exercise and stores them into an array. From there, an
                Object is created to store each unique word and its frequency
                from a given array, ensuring that the word is not a stop word.
Input:          wordsArray  - the array of all words found within the text file
Result:         An Object containing the list of valid words and their
                frequencies from an array
******************************************************************************/
function createWordsObject (wordsArray) {
    
    
    //Reads the list of stop words associated to exercise and splits them into an array
    var fs = require('fs');
    var stopWordsFile = __dirname + '/stop_words.txt';
    var readStopWordsFile = [];
    readStopWordsFile = fs.readFileSync(stopWordsFile, 'utf8');
    var splitStopWords = [];
    splitStopWords = readStopWordsFile.split(',');
    
    
    var wordsObject = {};
    
    
    /*
     * Loops through each elemant in the words array and checks to see if the word is not a stop word
     * In addition, it checks to see if the word is not the string "s"
     * The second condition is used to cover the manner in which words originally containing the text "'s" were split
     * Examples of these words include "Bennet's", "Elizabeth's", and "Jame's"
     */
    wordsArray.forEach(function (arrayElement) {
        if (!splitStopWords.includes(arrayElement) && arrayElement !== 's') {
            
            
            /*
             * Checks to see if the Object has a property containing a specific word
             * If it does, the frequency of that property is increated
             * If not, the frequency of that property is set to 1
             */
            if (wordsObject.hasOwnProperty(arrayElement)) {
                wordsObject[arrayElement]++;
            }
            else {
                wordsObject[arrayElement] = 1;
            }
        }
    });
    
    
    return wordsObject;
}


/******************************************************************************
Function Name:  sortWordsObject
Purpose:        This function creates an array of Objects and sorts the Objects
                by the words with the highest frequencies
Description:    This function first creates an array to store the Objects. It
                then formats the Objects in a way to better understand what
                information is being stored into the array. Finally, the array
                is sorted by highest frequency.
Input:          wordsObject  - the Object containing the terms and their
                              frequencies in an unformatted manner
Result:         An array of Objects sorted by the highest frequency words
******************************************************************************/
function sortWordsObject (wordsObject) {
    var sortedWordsArray = [];
    
    
    /*
     * Creates an array of the names of each property within the Object
     * In this case, the names of each property is our valid word from the text file
     * From there, the array is reformatted where the results sort the word and it's frequeny into an understandable interpretation
     */
    sortedWordsArray = Object.keys(wordsObject).map(function (element) {
        return {
            word: element,
            frequency: wordsObject[element]
        };
    });
    
    
    //Sorts the array by the highest frequency words
    sortedWordsArray.sort( function (a, b) {
        return b.frequency - a.frequency;
    });
    
    
    return sortedWordsArray;
}