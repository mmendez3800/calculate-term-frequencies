"""
File Name:   no_style.py
    
Description: This program takes one text file as an argument and ouputs the frequencies of valid tokens it contains.
             Valid tokens are considered as a sequence of alphanumeric characters along with a few special characters [a-zA-Z0-9@#*&'].
             The tokens are then reduced to their lowercase form where their frequencies can be computed and shown to the user.
             These alphanumeric sequencies must have a length of at least 2 to be considered valid (i.e., len(token) >= 2).
"""
#!/usr/bin/env python3

import re
import string
import sys

from collections import Counter
from os import path

class Tokenizer:
    """
    The Tokenizer object allows us to compute the frequencies of the tokens within the text file
    
    Attributes:
        tokens (list): Stores all tokens present within the file
        frequencies (Counter): Dictionary subclass that stores the frequency of tokens
        file (str): Stores the name of the file and its location
    """
    def __init__(self, textFile):
        self.tokens = []
        self.frequencies = Counter()
        self.file = textFile
    
    def readChunk(self, fileObject):
        """
        The readChunk method reads a file object in sections of 4096 bytes and returns a generator of the text
        contained wthin this section size
        
        Args:
            fileObject (file object): A file object of the text file being read
        
        Returns:
            A generator for the text equal to the size of the bytes indicated to read
        """
        while True:
            chunk = fileObject.read(4096)
            if not chunk:
                break
            yield chunk
        
    def tokenize(self):
        """
        The tokenize method reads the text file provided and adds each valid token into the 'tokens' attribute
        
        Note:
            The runtime for this method is O(n) where n is the number characters in the text file.
            This is because the method grabs each line in the file and converts all uppercase characters to lowercase.
            From there, it uses a regex expression to find all valid tokens in the file.
            This requires us to parse through each character in the file to grab the list of valid tokens.
            
        Raises:
            OSError: If file cannot be opened
        """
        # Checks that the text file provided can be opened
        try:
            file = open(self.file, encoding='utf-8', errors='replace')
        
        # Displays the error that arose if the file could not be opened
        except OSError as error:
            print(error)
            
        # Performs our tokenization if the file can be opened
        else:
            
            # Creates a regular expression in order to tokenize the file
            pattern = re.compile('\w+')
            
            # Creates a set of characters used for token pattern determination
            charList = list(string.ascii_letters) + list(string.digits) + ['_']
            charSet = set(charList)
            
            # Variables to be used for retaining information on characters and tokens found
            firstChar = ''
            lastChar = ''
            lastToken = ''
            
            # Iterates through each chunk in the file
            for chunk in self.readChunk(file):
                
                # Saves the first character in the chunk and finds all valid tokens through the regular expression created
                firstChar = chunk[0]
                validTokens = pattern.findall(chunk.lower())
                
                # Checks if the first character in current chunk should be part of the last token determined in previous chunk
                # If true, combines last token with first token in current chunk
                # Otherwise, adds last token to list of valid tokens found
                if lastChar in charSet and firstChar in charSet:
                    validTokens[0] = lastToken + validTokens[0]
                elif lastToken:
                    self.tokens.append(lastToken)
                
                # Pops the last valid token found and adds the list of valid tokens to the 'tokens' attribute
                # Saves the last character in the chunk to be used for reference for next chunk to be read
                lastToken = validTokens.pop()
                self.tokens.extend(validTokens)
                lastChar = chunk[-1]
            
            # Adds last token to list of valid characters found
            self.tokens.append(lastToken)
        
        # Closes the file regardless of whether or not an error was thrown
        finally:
            file.close()
        
    def computeWordFrequencies(self):
        """
        The computeWordFrequencies method checks the list of tokens and computes the frequences of each one into the 'frequencies'
        attribute of the object
        
        Note:
            The runtime for this method is O(m) where n is the number of items in the 'tokens' attribute.
            This is because the method grabs each valid token that was in the file.
            From there, the token is added to the dictionary subclass and assigned a value of 1.
            If the token is already present in the datatype, its value is increased by 1.
            
            Counter datatype information: https://docs.python.org/3.6/library/collections.html#collections.Counter
        """
        self.frequencies = Counter(self.tokens)
        
    def print(self):
        """
        The print method displays the list of tokens and their frequencies to the user
        
        Note:
            The runtime for this method is O(p log p) where p is the number of key:value pairs in the 'frequencies' attribute.
            This is because our method grabs each pairing in the dictionary subclass.
            From there, it prints the key as well as its associated value for the user to view through the terminal.
            The pairs are presented in sorted order based on the frequency of the token.
        """
        with open('stop_words.txt') as file:
            stop_words = set(re.split(',', file.read()))
            stop_words.add('s')
        
        count = 0
        for (token, frequency) in self.frequencies.most_common():
            if count >= 25:
                break
            if not token in stop_words:
                print(token + ' - ' + str(frequency))
                count += 1
        
def main():
    """
    The main function runs the tokenizer program and displays the frequencies of each token within the text file
    
    Raises:
        SystemExit: If improper arguments are provided to run the program
    """
    # Checks that the user provides the valid number of arguments and a valid text file to run the program
    if (len(sys.argv) != 2):
        sys.exit('Invalid arguments provided\nPlease provide valid arguments in order to run tokenizer')
    elif (not path.isfile(sys.argv[1]) or sys.argv[1][-4:] != '.txt'):
        sys.exit('Argument provided is not a valid text file\nPlease provide a valid text file in order to run tokenizer')
        
    # Creates a Tokenizer object based on text file given and computes the frequencies of tokens within then file
    tkzr = Tokenizer(sys.argv[1])
    tkzr.tokenize()
    tkzr.computeWordFrequencies()
    tkzr.print()

if __name__ == "__main__":
    main()
