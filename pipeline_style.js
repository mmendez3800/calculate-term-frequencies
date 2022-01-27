/******************************************************************************
File Name:    pipeline_style.js
Description:  This term frequency program is to read a text file. From there,
              it is to count the frequency of each term in the file while
              taking into consideration the predeterminded list of stop words
              established. This program is to adhere to two conditions:
                 1. Implement the program using the pipeline style
                 2. Allow the user to input the stop words file as a second
                    argument when running the program
******************************************************************************/


/******************************************************************************
Function Name:  readFile
Purpose:        This function reads the text file entered by the user and
                outputs the contents of the file
Input:          txtfile  - the text file specified by the user
Result:         A string containing the contents of the text file
******************************************************************************/
function readFile (txtFile) {
    var fs = require('fs');
    var file = __dirname + '/' + txtFile;
    var readTXTFile = fs.readFileSync(file, 'utf8');    
    return readTXTFile;
}


/******************************************************************************
Function Name:  convertString
Purpose:        This function converts all letters within a string to lowercase
                and replaces all non-alphanumeric values with whitespace
                characters
Input:          stringWords  - a string containing the contents of the
                previously read file
Result:         A string with all lowercase letters and whitespace characters
******************************************************************************/
function convertString (stringWords) {
    var convertedString = stringWords.toLowerCase();
    convertedString = convertedString.replace(/[^a-zA-Z0-9]/g, ' ');
    return convertedString;
}


/******************************************************************************
Function Name:  parseString
Purpose:        This function splits the string by the whitespace characters
                and places the split string parts into an array
Input:          stringWords  - a string containing the contents of the
                previously read file
Result:         An array of words split by the whitespace characters
******************************************************************************/
function parseString (stringWords) {
    var parsedString = stringWords.split(/\s+/);
    return parsedString;
}


/******************************************************************************
Function Name:  modifyArray
Purpose:        This function updates the given array and removes all stop
                words within it
Input:          wordsArray  - an array of words
Result:         An array where all stop words have been removed
******************************************************************************/
function modifyArray (wordsArray) {
    var fs = require('fs');
    var file = __dirname + '/stop_words.txt';
    var stopWords = fs.readFileSync(file, 'utf8');
    var splitStopWords = stopWords.split(',');
    
    
    /*
     * This addition of 's' is used to cover the manner in which words originally containing the text "'s" were split
     * Examples of these words include "Bennet's", "Elizabeth's", and "Jame's"
     */
    splitStopWords.push('s');
    
    
    wordsArray = wordsArray.filter(function (arrayElement) {
        return !splitStopWords.includes(arrayElement); 
    });
    return wordsArray;
}


/******************************************************************************
Function Name:  placeIntoObjects
Purpose:        This function reviews the contents of the array and places them
                into an Object where the frequencies of each word is calculated
Input:          wordsArray  - an array of words
Result:         An Object containing each unique word in the array and the
                number of times that word appeared
******************************************************************************/
function placeIntoObjects (wordsArray) {
    var wordsObject = {};
    wordsArray.forEach(function (arrayElement) {
        if (wordsObject.hasOwnProperty(arrayElement)) {
            wordsObject[arrayElement]++;
        }
        else {
            wordsObject[arrayElement] = 1;
        }
    });
    return wordsObject;
}


/******************************************************************************
Function Name:  placeIntoArray
Purpose:        This function uses an Object and places the contents into an
                array, thus creating a two-dimensional array
Input:          wordsObject  - an Object containing a list of words and their
                frequencies
Result:         A two-dimensional array containing the word and its frequency
******************************************************************************/
function placeIntoArray (wordsObject) {
    var wordsArray = [];
    for (var property in wordsObject) {
        wordsArray.push([property, wordsObject[property]]);
    }
    return wordsArray;
}


/******************************************************************************
Function Name:  sortArray
Purpose:        This function sorts a two-dimensional array by descending order
                based on the second value of each element
Input:          wordsArray  - an array of words
Result:         A two-dimensional sorted in descending order by the second
                value of each element
******************************************************************************/
function sortArray (wordsArray) {
    var sortedArray = wordsArray.sort(function (a, b) {
       return b[1] - a[1];
    }); 
    return sortedArray;
}


/******************************************************************************
Function Name:  printArray
Purpose:        This function prints the contents of a two-dimensional array
                in an indicated format
Input:          wordsArray  - an array of words
Result:         Prints the contents of a two-dimensional array in an indiated
                format
******************************************************************************/
function printArray (wordsArray) {
    var index = 0;
    if (wordsArray.length < 25) {
        for (index; index < wordsArray.length; index++) {
            console.log(wordsArray[index][0] + '  -  ' + wordsArray[index][1]);
        }
    }
    else {
        for (index; index < 25; index++) {
            console.log(wordsArray[index][0] + "  -  " + wordsArray[index][1]);
        }
    }
}


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


//The main function
printArray(sortArray(placeIntoArray(placeIntoObjects(modifyArray(parseString(convertString(readFile(process.argv[2]))))))));