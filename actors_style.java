/******************************************************************************
File Name:    actors_style.java
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established. This program is
              to adhere to the following conditions:
                 1. Implement the program using the Actors style
                 2. Utilize only three Actors plus the main thread
******************************************************************************/


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.Map.Entry;
import java.util.regex.Pattern;

public class actors_style {
    
    
    /******************************************************************************
    Class:          activeWFObject
    Description:    An abstraction that implements the generic behavior of our
                    active objects (our Actors)
    Data Fields:    objectName  - The name of the active object
                    objectQueue  - The queue associated to the active object
                    stopFlag  - Flag to indicate when the thread is to stop
    Functions:      activeWFObject  - Constructor that defines the abstraction
                    run  - Takes messages from the queue and dispatches them
                    dispatch  - Abstract method with no implementation (will be
                                defined within the subclass)
    ******************************************************************************/
    static abstract class activeWFObject extends Thread {
        
        
        //Instance variables
    	private String objectName;
    	private Queue<List<Object>> objectQueue;
    	public boolean stopFlag;
    	
    	
    	public activeWFObject() {
    		objectName = getClass().getSimpleName();
    		objectQueue = new LinkedBlockingQueue<List<Object>>();
    		stopFlag = false;
    		start();
    	}
    	
    	public void run() {
    		while (!stopFlag){
    			List<Object> message = objectQueue.poll();
    			try {
    				if (message != null) {
    					dispatch(message);
    					if (message.get(0).equals("die")) {
    					    stopFlag = true;
					    }
    				}
    			}
    			catch (IOException e) {
    			    e.printStackTrace();
    			}
    		}
    	}
    	
    	
    	//Method that will be overriden from subclass
    	public abstract void dispatch(List<Object> message) throws IOException;
    }
    
    
    /******************************************************************************
    Function Name:  send
    Purpose:        This function places a message within the queue of the receiver
    Input:          receiver  - The abstraction that is receiving the message
                    message  - The message that is being sent
    Result:         Places the message within the queue of the listed receiver
    ******************************************************************************/
    public static void send(activeWFObject receiver, List<Object> message) {
		receiver.objectQueue.offer(message);
	}
    
    
    /******************************************************************************
    Class:          dataStoreageManager
    Description:    An abstraction that stores and processes the contents of a file
                    (specifically, the text file specified by the user)
    Data Fields:    stop_word_manager  - The abstraction associated to the
                                         stopWordManager class
                    contents  - The text within the file specified by the user
    Functions:      dispatch  - Reads the contents of the message and delegates
                                what to do based on the contents
                    init  - Initializes the abstraction by reading the contents of
                            the file and parsing the contents into a string
                    processWords  - Splits the contents of the string into an
                                    array and sends messages to the queues of its
                                    receivers in order to process the contents of
                                    the array
    ******************************************************************************/
    static class dataStorageManager extends activeWFObject {
        
        
        //Instance variables
    	private stopWordManager stop_word_manager;
    	private String contents;
    	
    	
    	@Override
    	public void dispatch(List<Object> message) throws IOException {
    		if (message.get(0).equals("init"))
    			init(message.subList(1, message.size()));
    		else if (message.get(0).equals("send_word_freqs"))
    			processWords(message.subList(1, message.size()));
    		else
    			send(stop_word_manager, message);
    	}
    	
    	public void init(List<Object> message) throws IOException {		
    		String path = (String) message.get(0);
    		contents = new String(Files.readAllBytes(Paths.get(path))).toLowerCase();
    		contents = Pattern.compile("[^a-zA-Z]").matcher(contents).replaceAll(" ");
    		stop_word_manager = (stopWordManager) message.get(1);
    	}
    	
    	public void processWords(List<Object> message) {
    		String[] words = contents.split(" ");
            wordFrequencyManager recipient = (wordFrequencyManager)message.get(0);
    		for (int i = 0; i < words.length; i++) {
    		    
    		    
    		    //Covers the edge cases such as the single 's' and whitespace characters
    		    if (words[i].length() < 2)
    		        continue;
		        
		        
    		    send(stop_word_manager, new ArrayList<Object>(Arrays.asList("filter", words[i])));
    		}
    		send(stop_word_manager, new ArrayList<Object>(Arrays.asList("top25", recipient)));
    	}
    }
    
    
    /******************************************************************************
    Class:          stopWordManager
    Description:    An abstraction that stores and processes the contents of a file
                    containing the list of stop words
    Data Fields:    word_frequency_manager  - The abstraction associated to the
                                              wordFrequencyManager class
                    stopWords  - The list of stop words obtained
    Functions:      dispatch  - Reads the contents of the message and delegates
                                what to do based on the contents
                    init  - Initializes the abstraction by reading the list of
                            stop words
                    filter  - Sends messages to the queues of its receivers in
                              order to process the non-stop words
    ******************************************************************************/
    static class stopWordManager extends activeWFObject {
        
        
        //Instance variables
    	private wordFrequencyManager word_frequency_manager;
    	private Set<String> stopWords = new HashSet<String>();
    	
    	
    	@Override
    	public void dispatch(List<Object> message) throws IOException {
    		if (message.get(0).equals("init"))
    			init(message.subList(1, message.size()));
    		else if (message.get(0).equals("filter"))
    			filter(message.subList(1, message.size()));
    		else
    			send(word_frequency_manager, message);
    	}
    	
    	public void init(List<Object> message) throws IOException {
    		String[] words = new String(Files.readAllBytes(Paths.get("stop_words.txt"))).split(",");
    		for (int i = 0; i < words.length; i++)
    		    stopWords.add(words[i]);
    		word_frequency_manager = (wordFrequencyManager) message.get(0);
    	}
    	
    	public void filter(List<Object> message) {
    		String word = (String) message.get(0);
    		if (!stopWords.contains(word))
    			send(word_frequency_manager, new ArrayList<Object>(Arrays.asList("word", word)));
    	}
    }
    
    
    /******************************************************************************
    Class:          wordFrequencyManager
    Description:    An abstraction that maintains the frequency of all non-stop
                    words
    Data Fields:    data_storage_manager  - The abstraction associated to the
                                            dataStorageManager class
                    wordFrequencies  - A map to contain the list of non-stop words
                                       and their frequencies
    Functions:      dispatch  - Reads the contents of the message and delegates
                                what to do based on the contents
                    incrementCount  - Keeps track of the non-stop words within the
                                      Map and increases frequency of each word when
                                      needed
                    top25  - Prints out the top 25 most frequent terms
                    run  - Sends messages from the queue with the necessary
                           information in order trigger the processWords function
    ******************************************************************************/
    static class wordFrequencyManager extends activeWFObject {
        
        
        //Instance variables
        private dataStorageManager data_storage_manager;
    	private Map<String, Integer> wordFrequencies = new HashMap<String, Integer>();
    	
    	
    	@Override
    	public void dispatch(List<Object> message) {
    		if (message.get(0).equals("word"))
    			incrementCount(message.subList(1, message.size()));
    		else if (message.get(0).equals("top25"))
    			top25(message.subList(1, message.size()));
    		else if (message.get(0).equals("run"))
    		    run(message.subList(1, message.size()));
    		    
    	}
    	
    	public void incrementCount(List<Object> message) {
    		String word = (String) message.get(0);
    		if (wordFrequencies.containsKey(word))
    			wordFrequencies.put(word, wordFrequencies.get(word) + 1);
    		else
    			wordFrequencies.put(word, 1);
    	}
    	
    	public void top25(List<Object> message) {
    	    List<Entry<String, Integer>> sortedFrequencies = new ArrayList<Entry<String, Integer>>();
    	    sortedFrequencies.addAll(wordFrequencies.entrySet());
    	    Collections.sort(sortedFrequencies, (word1, word2) -> word2.getValue() - word1.getValue());
    	    
    	    for (int i = 0; i < 25; i++) {
    	    	Entry<String, Integer> p = sortedFrequencies.get(i);
    	    	System.out.println(p.getKey() + "  -  " + p.getValue());
    	    }
    	    
    	    send(data_storage_manager,  new ArrayList<Object>(Arrays.asList("die")));
    	    stopFlag = true;
    	}
    	
    	public void run(List<Object> message) {
    		data_storage_manager = (dataStorageManager) message.get(0);
    		send(data_storage_manager, new ArrayList<Object>(Arrays.asList("send_word_freqs", this)));
    	}
    }
	
	
	/******************************************************************************
    Function Name:  main
    Purpose:        This function executes our term frequency program by calling
                    our active objects defined above and initiating their messages
                    to each other
    Input:          args  - An array of arguments
    Result:         Counts the frequency of each non-stop word and displays the
                    results into the terminal
    ******************************************************************************/
    public static void main(String args[]) {
        wordFrequencyManager word_frequency_manager = new wordFrequencyManager();
		
		stopWordManager stop_word_manager = new stopWordManager();
		send(stop_word_manager, new ArrayList<Object>(Arrays.asList("init", word_frequency_manager)));
		
		dataStorageManager data_storage_manager = new dataStorageManager();
		send(data_storage_manager, new ArrayList<Object>(Arrays.asList("init", args[0], stop_word_manager)));
		
		send(word_frequency_manager, new ArrayList<Object>(Arrays.asList("run", data_storage_manager)));
		
		try {
		    word_frequency_manager.join();
			stop_word_manager.join();
			data_storage_manager.join();
        }
        catch (InterruptedException e) {
            e.printStackTrace();
		}
    }
}