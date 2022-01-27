"""
File Name:    array_programming_style.py
Description:  This term frequency program is to read a text file.
              From there, it is to convert all words into
              leetspeak. Once complete, it is to print the five most
              frequently occurring 2-grams. This program is to adhere to the
              following conditions:
                 1. Implement the program using the array programming style
                    as much as possible
"""


#!/usr/bin/env python
import numpy as np
import sys, nltk, collections

nltk.download('punkt')

from nltk.util import bigrams


# Splits file of words into individual characters with
# spaces added to the beginning and end
characters = np.array(list(open(sys.argv[1]).read()))


# Replaces non-alphanumeric characters with whitespace and
# converts all letters to lowercase form
characters[~np.char.isalnum(characters)] = ' '
characters = np.char.lower(characters)


# Joins the array of characters into a single string and then
# separates each word in the string into an array
words = ''.join(list(characters))
words = np.array(nltk.word_tokenize(words))


# Converts the words into leetspeak by replacing the appropriate characters
leetwords = np.char.replace(words, 'a', '4')
leetwords = np.char.replace(leetwords, 'b', '6')
leetwords = np.char.replace(leetwords, 'e', '3')
leetwords = np.char.replace(leetwords, 'g', '9')
leetwords = np.char.replace(leetwords, 'i', '1')
leetwords = np.char.replace(leetwords, 'o', '0')
leetwords = np.char.replace(leetwords, 's', '5')
leetwords = np.char.replace(leetwords, 't', '7')
leetwords = np.char.replace(leetwords, 'z', '2')

# Converts the words into 2-grams and calculates
# the five most frequently occurring 2-grams
twograms = bigrams(leetwords)
frequencies = collections.Counter(twograms)
topfrequencies = frequencies.most_common(5)

# Prints the five most frequenly occurring 2-grams
print(str(topfrequencies[0][0]) + '  -  ' + str(topfrequencies[0][1]))
print(str(topfrequencies[1][0]) + '  -  ' + str(topfrequencies[1][1]))
print(str(topfrequencies[2][0]) + '  -  ' + str(topfrequencies[2][1]))
print(str(topfrequencies[3][0]) + '  -  ' + str(topfrequencies[3][1]))
print(str(topfrequencies[4][0]) + '  -  ' + str(topfrequencies[4][1]))