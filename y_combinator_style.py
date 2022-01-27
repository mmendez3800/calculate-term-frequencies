"""
File Name:    y_combinator_style.py
Description:  This term frequency program is to read a text file. From there, it
              is to count the frequency of each term in the file while taking
              into consideration the predeterminded list of stop words established.
              This program is to adhere to the following conditions:
                 1. Implement the program using a Y combinator to remove
                    explicit recursion
"""


#!/usr/bin/env python
import re, sys, operator


# Recursion limit placed in order for the program to not crash
# If progam still crases, lower the value as needed
recursionLimit = 5000
sys.setrecursionlimit(recursionLimit + 10)


# Our Y combinator
Y = (lambda h: lambda F: F(lambda x: h(h)(F)(x)))(lambda h: lambda F: F(lambda x: h(h)(F)(x)))


# Our implementation of the previous 'count' function through lambda calculus
# This type of recursion avoids explicit recursion
# It will be used at a later time in conjunction with the Y combinator
countFrequencies = lambda f: lambda x: lambda y: lambda z: None if len(x) == 0 else (f(x[1:])(y)(z) if z.update({x[0] if x[0] not in y else None: (z.get(x[0], 0) + 1)}) is None else None)


# Our implementation of the previous 'wf_print' function through lambda calculus
# This type of recursion avoids explicit recursion
# It will be used at a later time in conjunction with a Y combinator
printElements = lambda f: lambda x: None if len(x) == 0 else (f(x[1:]) if print(x[0][0] + '  -  ' + str(x[0][1])) is None else None)


# Creation of word list from text file specified by user, list of stop words, and empty dictionary
readWords = re.findall('[a-z]{2,}', open(sys.argv[1]).read().lower())
stopWords = open('stop_words.txt').read().split(',')
wordFrequencies = {}


# Main functions which allow for the term frequency program to run
for i in range(0, len(readWords), recursionLimit):
     Y(countFrequencies)(readWords[i:i + recursionLimit])(stopWords)(wordFrequencies)
Y(printElements)(sorted(wordFrequencies.items(), key=operator.itemgetter(1), reverse = True)[:25])