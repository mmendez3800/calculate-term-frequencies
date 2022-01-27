/******************************************************************************
File Name:    plugins_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Plugins style
******************************************************************************/


var words;
var frequencies;


/******************************************************************************
Function Name:  loadPlugins
Purpose:        This function loads the plugins specified within the
                config.json file in order to know what functions to utilize
Result:         Assigns global variables to the configuration variables
                specified within the config.json file
******************************************************************************/
function loadPlugins() {
    var config = require('./config.json');
    
    var wordsPlugin = config.words;
    var frequenciesPlugin = config.frequencies;
    
    words = require(wordsPlugin);
    frequencies = require(frequenciesPlugin);
}


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


loadPlugins();
var results = frequencies.top25Frequencies(words.nonStopWords(process.argv[2]));

for(var index = 0; index < results.length; index++) {
    console.log(results[index][0] + "  -  " + results[index][1]);
}