/******************************************************************************
File Name:    bulletin_board_style.js
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Bulletin Board style
                 2. Count the number of non-stop words containing the letter z
******************************************************************************/


var fs  = require('fs');
var _ = require('lodash');


/******************************************************************************
Class:          eventManager
Description:    An abstraction that implements the generic bulletin board
                concept used for this programming style
Data Fields:    subscriptions  - An object used to hold the list of
                                 subscriptions added
Functions:      constructor  - Defines the abstraction created
                subscribe  - Adds an event type and handler to the
                             subscriptions object
                publish  - Takes an event and executes all handlers associated
                           to that event
******************************************************************************/
class eventManager {
    constructor() {
        this.subscriptions = {};
    }
    
    subscribe(eventType, handler) {
        if (this.subscriptions.hasOwnProperty(eventType)) {
            this.subscriptions[eventType].push(handler);
        }
        else {
            this.subscriptions[eventType] = [handler];
        }
    }
    
    publish(event) {
        var eventType = event[0];
        if (this.subscriptions.hasOwnProperty(eventType)) {
            for (var i = 0; i < this.subscriptions[eventType].length; i++) {
                var h = this.subscriptions[eventType][i];
                h(event);
            }
        }
    }
}


/******************************************************************************
Class:          readWords
Description:    An entity used to manage the events of loading a file and
                reading the contents of the file
Data Fields:    wordsArray  - An array used to hold the list of words
                              associated to the file
                eventManager  - Links the entity to our event manager abstract,
                                allowing for event types to be subscribed and
                                events to be published
Functions:      constructor  - Defines the abstraction created
                load  - Loads the file and parses the contents into an array
                readWords - Add each word as an event and publishes it to our
                            bulletin board
******************************************************************************/
class readWords {
    constructor(eventManager) {
        this.wordsArray = [];
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('start', this.readWords.bind(this));
    }
    
    load(event) {
        var file = event[1];
        var wordsString = fs.readFileSync(file, 'utf8');
        this.wordsArray = wordsString.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/);
    }
    
    readWords(event) {
        for (var i = 0; i < this.wordsArray.length; i++) {
            var w = this.wordsArray[i];
            this.eventManager.publish(['word', w]);
        }
        this.eventManager.publish(['endOfFile', null]);
    }
}


/******************************************************************************
Class:          stopWords
Description:    An entity used to manage the events of loading a file and
                checking if a stop word has been referenced
Data Fields:    wordsArray  - An array used to hold the list of words
                              associated to the file
                eventManager  - Links the entity to our event manager abstract,
                                allowing for event types to be subscribed and
                                events to be published
Functions:      constructor  - Defines the abstraction created
                load  - Loads the file and parses the contents into an array
                isStopWords - Checks if a word is a stop word and, if not,
                              publishes it to our bulletin board
******************************************************************************/
class stopWords {
    constructor(eventManager) {
        this.wordsArray = [];
        this.eventManager = eventManager;
        this.eventManager.subscribe('load', this.load.bind(this));
        this.eventManager.subscribe('word', this.isStopWord.bind(this));
    }
    
    load(event) {
        var file = __dirname + '/stop_words.txt';
        var wordsString = fs.readFileSync(file, 'utf8');
        this.wordsArray = _.concat(wordsString.split(','), 's');
    }
    
    isStopWord(event) {
        var word = event[1];
        if (!this.wordsArray.includes(word)) {
            this.eventManager.publish(['validWord', word]);
        }
    }
}


/******************************************************************************
Class:          wordFrequencyCount
Description:    An entity used to manage the events of tracking the number of
                non-stop words, recording their frequencies, and printing the
                top 25 most frequent words
Data Fields:    wordsFrequencies  - An object used to hold each non-stop word
                                    and their frequencies
                eventManager  - Links the entity to our event manager abstract,
                                allowing for event types to be subscribed and
                                events to be published
Functions:      constructor  - Defines the abstraction created
                increaseCount  - Records each non-stop word and the number of
                                 times it has appeared
                printFrequencies - Prints the top 25 most frequent words
******************************************************************************/
class wordFrequencyCount {
    constructor(eventManager) {
        this.wordFrequencies = {};
        this.eventManager = eventManager;
        this.eventManager.subscribe('validWord', this.increaseCount.bind(this));
        this.eventManager.subscribe('print', this.printFrequencies.bind(this));
    }
    
    increaseCount(event) {
        var word = event[1];
        if (this.wordFrequencies.hasOwnProperty(word)) {
            this.wordFrequencies[word]++;
        }
        else {
            this.wordFrequencies[word] = 1;
        }
    }
    
    printFrequencies(event) {
        var wordFrequencies = _.toPairs(this.wordFrequencies).sort(function (a, b) {
            return b[1] - a[1];
        });
        wordFrequencies = wordFrequencies.slice(0, 25);
        for (var index = 0; index < wordFrequencies.length; index++) {
            console.log(wordFrequencies[index][0] + "  -  " + wordFrequencies[index][1]);
        }
    }
}


/******************************************************************************
Class:          zWordFrequencyCount
Description:    An entity used to manage the events of tracking the number of
                non-stop words with the letter z and printing out the result
Data Fields:    wordsArray  - An array used to hold the list of unique non-stop
                              words with the letter z
                countAll  - A number used to keep track of the number of all 
                            non-stop words with the letter z
                countUnique  - A number used to keep track of the number of
                               unique non-stop words with the letter z
                eventManager  - Links the entity to our event manager abstract,
                                allowing for event types to be subscribed and
                                events to be published
Functions:      constructor  - Defines the abstraction created
                increaseZCount  - Records each non-stop word and the number of
                                  times it has appeared
                printZFrequencies - Prints the number of non-stop words with
                                    the letter z
******************************************************************************/
class zWordFrequencyCount {
    constructor(eventManager) {
        this.wordsArray = [];
        this.countAll = 0;
        this.countUnique = 0;
        this.eventManager = eventManager;
        this.eventManager.subscribe('validWord', this.increaseZCount.bind(this));
        this.eventManager.subscribe('print', this.printZFrequencies.bind(this));
    }
    
    increaseZCount(event) {
        var word = event[1];
        if (word.includes('z')) {
            this.countAll = this.countAll + 1;
            if (!this.wordsArray.includes(word)) {
                this.wordsArray.push(word);
                this.countUnique = this.countUnique + 1;
            }
        }
    }
    
    printZFrequencies(event) {
        console.log("The number of all non-stop words with the letter z is " + this.countAll);
        console.log("The number of unique non-stop words with the letter z is " + this.countUnique);
    }
}


/******************************************************************************
Class:          wordFrequencyApply
Description:    An entity used to manage the events of starting and stopping
                the term frequency program
Data Fields:    eventManager  - Links the entity to our event manager abstract,
                                allowing for event types to be subscribed and
                                events to be published
Functions:      constructor  - Defines the abstraction created
                run  - Loads the file specified and starts the program
                stop  - Prints the results of the program
******************************************************************************/
class wordFrequencyApply {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.eventManager.subscribe('run', this.run.bind(this));
        this.eventManager.subscribe('endOfFile', this.stop.bind(this));
    }
    
    run(event) {
        var file = __dirname + '/' + event[1];
        this.eventManager.publish(['load', file]);
        this.eventManager.publish(['start', null]);
    }
    
    stop(event) {
        this.eventManager.publish(['print', null]);
    }
}


//Reviewes the input from the command line and checks for the correct number of arguments
if (process.argv.length < 3) {
    console.log('Unable to execute term frequency program successfully' + '\n' +
    'Please enter the appropriate arguments in order to run');
    process.exit(1);
}


//The main function
var em = new eventManager();
var rw = new readWords(em);
var sw = new stopWords(em);
var wfc = new wordFrequencyCount(em);
var zwfc = new zWordFrequencyCount(em);
var wfa = new wordFrequencyApply(em);
em.publish(['run', process.argv[2]]);