var _ = require('lodash');


/******************************************************************************
Function Name:  top25Frequencies
Purpose:        This function reads the contents of an array and returns the
                25 most frequent elements in that array
Input:          words  - an array of words
Result:         Returns a two-dimensional array which contains the information
                of the top 25 most frequent words and their correpsonding
                frequencies
******************************************************************************/
function top25Frequencies(words) {
    
    
    //Calculates the frequency of each element in the array and stores the information into an object
    var wordFrequencies = _.countBy(words);
    
    
    //Converts the object into a sorted two-dimensional array and returns the first 25 elements
    var wordFrequencyArray = _.toPairs(wordFrequencies).sort(function (a, b) { return b[1] - a[1]; }).splice(0, 25);
    
    
    return wordFrequencyArray;
}


//Exports the function from the file so that other files can access it
module.exports = {
    top25Frequencies: top25Frequencies
}