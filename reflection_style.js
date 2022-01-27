/******************************************************************************
File Name:    reflection_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Use one of the previous implementations of term frequency
                 2. Call all methods/functions via reflection, instead of
                    calling them directly
                 3. Inspect the stack in at least one of the functions and add
                    a check
******************************************************************************/


/******************************************************************************
Function Name:  readFileImp
Purpose:        This function reads the text file entered by the user and
                outputs the contents of the file
Input:          txtfile  - the text file specified by the user
Result:         A string containing the contents of the text file
******************************************************************************/
function readFileImp (txtFile) {
    var fs = require('fs');
    var file = __dirname + '/' + txtFile;
    var readTXTFile = fs.readFileSync(file, 'utf8');
    
    var readWords = convertStringImp(readTXTFile);
    readWords = parseStringImp(readWords);
    
    return readWords;
}


/******************************************************************************
Function Name:  convertStringImp
Purpose:        This function converts all letters within a string to lowercase
                and replaces all non-alphanumeric values with whitespace
                characters if the 'readFileImp' function calls this function
Input:          stringWords  - a string containing the contents of the
                previously read file
Result:         A string with all lowercase letters and whitespace characters
                if the 'readFileImp' function is called, otherwise null
******************************************************************************/
function convertStringImp (stringWords) {
    
    
    //Check at the meta-level to confirm which function is calling convertStringImp
    if (convertStringImp.caller !== readFileImp) {
        return null;
    }
    
    
    var convertedString = stringWords.toLowerCase();
    convertedString = convertedString.replace(/[^a-zA-Z0-9]/g, ' ');
    return convertedString;
}


/******************************************************************************
Function Name:  parseStringImp
Purpose:        This function splits the string by the whitespace characters
                and places the split string parts into an array if the
                'readFileImp' function calls this function
Input:          stringWords  - a string containing the contents of the
                previously read file
Result:         An array of words split by the whitespace characters if the
                'readFileImp' function is called, otherwise null
******************************************************************************/
function parseStringImp (stringWords) {
    
    
    //Check at the meta-level to confirm which function is calling parseStringImp
    if (parseStringImp.caller !== readFileImp) {
        return null;
    }
    
    var parsedString = stringWords.split(/\s+/);
    return parsedString;
}


/******************************************************************************
Function Name:  modifyArrayImp
Purpose:        This function updates the given array and removes all stop
                words within it
Input:          wordsArray  - an array of words
Result:         An array where all stop words have been removed
******************************************************************************/
function modifyArrayImp (wordsArray) {
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
Function Name:  placeIntoObjectsImp
Purpose:        This function reviews the contents of the array and places them
                into an Object where the frequencies of each word is calculated
Input:          wordsArray  - an array of words
Result:         An Object containing each unique word in the array and the
                number of times that word appeared
******************************************************************************/
function placeIntoObjectsImp (wordsArray) {
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
Function Name:  placeIntoArrayImp
Purpose:        This function uses an Object and places the contents into an
                array, thus creating a two-dimensional array
Input:          wordsObject  - an Object containing a list of words and their
                frequencies
Result:         A two-dimensional array containing the word and its frequency
******************************************************************************/
function placeIntoArrayImp (wordsObject) {
    var wordsArray = [];
    for (var property in wordsObject) {
        wordsArray.push([property, wordsObject[property]]);
    }
    
    var sortedWordsArray = sortArrayImp(wordsArray);
    return sortedWordsArray;
}


/******************************************************************************
Function Name:  sortArrayImp
Purpose:        This function sorts a two-dimensional array by descending order
                based on the second value of each element if the
                'placeIntoArrayImp' function calls this function
Input:          wordsArray  - an array of words
Result:         A two-dimensional sorted in descending order by the second
                value of each element if the 'placeIntoArrayImp' function is
                called, otherwise null
******************************************************************************/
function sortArrayImp (wordsArray) {
    
    
    //Check at the meta-level to confirm which function is calling sortArrayImp
    if (sortArrayImp.caller !== placeIntoArrayImp) {
        return null;
    }
    
    
    var sortedArray = wordsArray.sort(function (a, b) {
       return b[1] - a[1];
    }); 
    return sortedArray;
}


/******************************************************************************
Function Name:  printArrayImp
Purpose:        This function prints the contents of a two-dimensional array
                in an indicated format
Input:          wordsArray  - an array of words
Result:         Prints the contents of a two-dimensional array in an indiated
                format
******************************************************************************/
function printArrayImp (wordsArray) {
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


/*
 * Meta-level definitions of functions are defined that call the base-level functions define previously
 * These anonymous functions are expressed as strings if the user provides an input file as an argument
 * If there is no input file provided as an argument, the functions will not do anything
*/ 
if (process.argv.length > 2) {
    var readFileFunct = "function (file) { return readFileImp(fileName); }";
    var modifyArrayFunct = "function (array) { return modifyArrayImp(array); }";
    var placeIntoObjectsFunct = "function (array) { return placeIntoObjectsImp(array); }";
    var placeIntoArrayFunct = "function (object) { return placeIntoArrayImp(object); }";
    var printArrayFunct = "function (array) { return printArrayImp(array); }";
    var fileName = process.argv[2];
}
else {
    var readFileFunct = "function (file) { return []; }";
    var modifyArrayFunct = "function (array) { return []; }";
    var placeIntoObjectsFunct = "function (array) { return []; }";
    var placeIntoArrayFunct = "function (object) { return []; }";
    var printArrayFunct = "function (array) { return []; }";
    var path = require('path');
    var fileName = path.basename(__filename);
}


//The meta-level functions are added dynamically to the base program
eval("var readFile = " + readFileFunct);
eval("var modifyArray = " + modifyArrayFunct);
eval("var placeIntoObjects = " + placeIntoObjectsFunct);
eval("var placeIntoArray = " + placeIntoArrayFunct);
eval("var printArray = " + printArrayFunct);


//The main function
printArray(placeIntoArray(placeIntoObjects(modifyArray(readFile(fileName)))));