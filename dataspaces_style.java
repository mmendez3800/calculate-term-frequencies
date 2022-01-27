/******************************************************************************
File Name:    dataspaces_style.java
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Dataspaces style
                 2. When implementing the phase of the program where the
                    merging of word frequencies occur, do this concurrently
                    by 5 threads
******************************************************************************/


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.Map.Entry;
import java.util.regex.Pattern;

public class dataspaces_style {
    
    
    //Instance variables
    private static ConcurrentLinkedQueue<String> wordSpace = new ConcurrentLinkedQueue<String>();
    private static ConcurrentLinkedQueue<Map<String, Integer>> frequencySpace = new ConcurrentLinkedQueue<Map<String, Integer>>();
    private static Set<String> stopWords = new HashSet<String>();
    private static Map<String, Integer> wordFrequencies = new HashMap<String, Integer>();
    
    
    /******************************************************************************
    Class:          Worker
    Description:    An abstraction that is used to process the frequencies of terms
                    (this will be done through 5 different threads later on)
    Functions:      run  - Executes the processWords function
    ******************************************************************************/
    static class Worker extends Thread {
    	public void run() {
    		processWords();
    	}
    }
    
    
    /******************************************************************************
    Class:          Frequency
    Description:    An abstraction that is used to merge the frequencies of terms
                    (this will be done through 5 different threads later on)
    Data Fields:    lowerBound  - Indicates the lower bound of which terms to merge
                                  based on the first character of the term
                    upperBound  - Indicates the upper bound of which terms to merge
                                  based on the first character of the term
    Functions:      Frequency  - Constructor that defines the abstraction
                    run  - Executes the mergeFrequencies function
    ******************************************************************************/
    static class Frequency extends Thread {
        
        
        //Instance variables
        private char lowerBound;
        private char upperBound;
        
        
        public Frequency(char lower, char upper) {
            lowerBound = lower;
            upperBound = upper;
        }
        
        public void run() {
    		mergeFrequencies(lowerBound, upperBound);
    	}
    }
    
    
    /******************************************************************************
    Function Name:  readFile
    Purpose:        This function reads the contents of a text file, updates the
                    text so that it is all lowercase, and places these words into
                    a queue
    Input:          path  - The path to the text file specified
    Result:         Parses the text file and places the terms into a queue
    ******************************************************************************/
    public static void readFile(String path) throws IOException {
        String contents = new String(Files.readAllBytes(Paths.get(path))).toLowerCase();
    	contents = Pattern.compile("[^a-zA-Z]").matcher(contents).replaceAll(" ");
    	String[] words = contents.split(" ");
    	
    	for (int i = 0; i < words.length; i++) {
    	    
    	    
    	   //Covers the edge cases such as the single 's' and whitespace characters
    	   if (words[i].length() < 2)
    	       continue;
    	   
    	   wordSpace.offer(words[i]);
    	}
    }
    
    
    /******************************************************************************
    Function Name:  readStopWords
    Purpose:        This function reads the list of stop words from a text file and
                    places these words into a queue
    Result:         Parses the text file and places the stop words into a queue
    ******************************************************************************/
    public static void readStopWords() throws IOException {
        String[] words = new String(Files.readAllBytes(Paths.get("stop_words.txt"))).split(",");
        for (int i = 0; i < words.length; i++)
            stopWords.add(words[i]);
    }
    
    
    /******************************************************************************
    Function Name:  processWords
    Purpose:        This function checks each word to see if it is not a stop word
                    and, if it is not, calculates the frequency of the term
    Result:         Calculates the frequencies of the non-stop words
    ******************************************************************************/
    public static void processWords() {
        Map<String, Integer> word_frequencies = new HashMap<String, Integer>();
        String word;
        
        while ((word = wordSpace.poll()) != null) {
            if (!stopWords.contains(word)) {
                if (word_frequencies.containsKey(word))
                    word_frequencies.put(word, word_frequencies.get(word) + 1);
                else
                    word_frequencies.put(word, 1);
            }
        }
        
        frequencySpace.offer(word_frequencies);
    }
    
    
    /******************************************************************************
    Function Name:  mergeFrequencies
    Purpose:        This function will review the frequencies of terms, based on
                    the bounds specified, so that they can be merged into a queue
    Input:          lowerBound  - Indicates the lower bound of which terms to merge
                                  based on the first character of the term
                    upperBound  - Indicates the upper bound of which terms to merge
                                  based on the first character of the term
    Result:         Merge the frequencies of the terms into a queue
    ******************************************************************************/
    public static void mergeFrequencies(char lowerBound, char upperBound) {
        for (Map<String, Integer> element : frequencySpace) {
            for (String key : element.keySet()) {
                
                if (key.charAt(0) < lowerBound || key.charAt(0) > upperBound)
                    continue;
                    
                if (wordFrequencies.containsKey(key))
                    wordFrequencies.put(key, wordFrequencies.get(key) + element.get(key));
                    
                else
                    wordFrequencies.put(key, element.get(key));
            }
        }
    }
    
    
    /******************************************************************************
    Function Name:  top25
    Purpose:        This function will print out the top 25 terms and their
                    frequencies
    Result:         Prints out the top 25 terms and their frequencies
    ******************************************************************************/
    public static void top25() {
        List<Entry<String, Integer>> sortedFrequencies = new ArrayList<Entry<String, Integer>>();
        sortedFrequencies.addAll(wordFrequencies.entrySet());
        Collections.sort(sortedFrequencies, (word1, word2) -> word2.getValue() - word1.getValue());
        
        for (int i = 0; i < 25; i++) {
            Entry<String, Integer> p = sortedFrequencies.get(i);
            System.out.println(p.getKey() + "  -  " + p.getValue());
        }
    }
    
    
    /******************************************************************************
    Function Name:  main
    Purpose:        This function executes our term frequency program by utilizing
                    various threads to call the functions used to count the terms
                    and their frequencies
    Input:          args  - An array of arguments
    Result:         Counts the frequency of each non-stop word and displays the
                    results into the terminal
    ******************************************************************************/
    public static void main(String[] args) {
        
        try {
            readFile(args[0]);
            readStopWords();
        }
        catch(IOException e) {
            e.printStackTrace();
        }
        
        
        //The workers which will be tasked to process the terms through five threads
        Worker[] workers = new Worker[5];
        
        
        for (int i = 0; i < workers.length; i++) {
            workers[i] = new Worker();
            workers[i].start();
        }
        
        for (int i = 0; i < workers.length; i++) {
            try {
                workers[i].join();
            }
            catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        
        //The threads which will be responsible for merging the frequencies of the terms
        Frequency[] frequencies = new Frequency[5];
        frequencies[0] = new Frequency('a', 'e');
        frequencies[1] = new Frequency('f', 'j');
        frequencies[2] = new Frequency('k', 'o');
        frequencies[3] = new Frequency('p', 't');
        frequencies[4] = new Frequency('u', 'z');
        
        
        for (int i = 0; i < frequencies.length; i++) {
            frequencies[i].start();
        }
        
        for (int i = 0; i < frequencies.length; i++) {
            try {
                frequencies[i].join();
            }
            catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        top25();
    }
}