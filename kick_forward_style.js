/******************************************************************************
File Name:    kick_forward_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the kick forward style
******************************************************************************/


/******************************************************************************
Function Name:  readFile
Purpose:        This function reads the text file entered by the user, stores
                the contents into a string, and executes the function entered
                within the second parameter
Input:          txtfile  - the text file specified by the user
                funct  - a function
Result:         Executes a function using the read text file as a parameter
******************************************************************************/
function readFile (txtFile, funct) {
    var fs = require('fs');
    var file = __dirname + '/' + txtFile;
    var readTXTFile = fs.readFileSync(file, 'utf8');
    
    funct(readTXTFile, parseString);
}


/******************************************************************************
Function Name:  convertString
Purpose:        This function converts all letters within a string to
                lowercase, replaces all non-alphanumeric values withwhitespace
                characters, and executes the function entered within the second
                parameter
Input:          stringWords  - a string containing the contents of the
                previously read file
                funct  - a function
Result:         Executes a function using the converted string as a parameter
******************************************************************************/
function convertString (stringWords, funct) {
    var convertedString = stringWords.toLowerCase();
    convertedString = convertedString.replace(/[^a-zA-Z0-9]/g, ' ');
    
    funct(convertedString, modifyArray);
}


/******************************************************************************
Function Name:  parseString
Purpose:        This function splits the string by the whitespace characters,
                places the split string parts into an array, and executes the
                function entered within the second parameter
Input:          stringWords  - a string containing the contents of the
                previously read file
                funct  - a function
Result:         Executes a function using the parsed string as a parameter
******************************************************************************/
function parseString (stringWords, funct) {
    var parsedString = stringWords.split(/\s+/);
    
    funct(parsedString, placeIntoObjects);
}


/******************************************************************************
Function Name:  modifyArray
Purpose:        This function updates the given array, removes all stop
                words within it, and executes the function entered within the
                second parameter
Input:          wordsArray  - an array of words
                funct  - a function
Result:         Executes a function using the modified array as a parameter
******************************************************************************/
function modifyArray (wordsArray, funct) {
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
    
    funct(wordsArray, placeIntoArray);
}


/******************************************************************************
Function Name:  placeIntoObjects
Purpose:        This function reviews the contents of the array, places them
                into an Object where the frequencies of each word is
                calculated, and executes the function entered within the second
                parameter
Input:          wordsArray  - an array of words
                funct  - a function
Result:         Executes a function using the newly created Object as a
                parameter
******************************************************************************/
function placeIntoObjects (wordsArray, funct) {
    var wordsObject = {};
    wordsArray.forEach(function (arrayElement) {
        if (wordsObject.hasOwnProperty(arrayElement)) {
            wordsObject[arrayElement]++;
        }
        else {
            wordsObject[arrayElement] = 1;
        }
    });
    
    funct(wordsObject, sortArray);
}


/******************************************************************************
Function Name:  placeIntoArray
Purpose:        This function uses an Object, places the contents into a
                two-dimensional array, and executes the function entered within
                the second parameter
Input:          wordsObject  - an Object containing a list of words and their
                frequencies
                funct  - a function
Result:         Executes a function using the two-dimensional array as a
                parameter
******************************************************************************/
function placeIntoArray (wordsObject, funct) {
    var wordsArray = [];
    for (var property in wordsObject) {
        wordsArray.push([property, wordsObject[property]]);
    }
    
    funct(wordsArray, printArray);
}


/******************************************************************************
Function Name:  sortArray
Purpose:        This function sorts a two-dimensional array by descending order
                based on the second value of each element and executes the
                function entered within the second parameter
Input:          wordsArray  - an array of words
                funct  - a function
Result:         Executes a function using the sorted two-dimensional array as
                a parameter
******************************************************************************/
function sortArray (wordsArray, funct) {
    var sortedArray = wordsArray.sort(function (a, b) {
       return b[1] - a[1];
    });
    
    funct(sortedArray, noOperation);
}


/******************************************************************************
Function Name:  printArray
Purpose:        This function prints the contents of a two-dimensional array
                in an indicated format and executes the function entered within
                the second parameter
Input:          wordsArray  - an array of words
                funct  - a function
Result:         Executes a function using 'null' as a parameter
******************************************************************************/
function printArray (wordsArray, funct) {
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
    
    funct(null);
}

/******************************************************************************
Function Name:  noOperation
Purpose:        This function performs no operation and is intended to be used
                as the "stop" point for this term frequency program written in
                the kick forward style
Input:          funct  - a function
Result:         Performs no operation
******************************************************************************/
function noOperation(funct) {
    return;
}


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


//The main function
readFile(process.argv[2], convertString);