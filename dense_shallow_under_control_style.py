"""
File Name:    dense_shallow_under_control_style.py
Description:  This term frequency program is to read a text file.
              From there, it is to count the frequency of
              each term in the file while taking into consideration the
              predeterminded list of stop words established.
              
              For this exercise, we are to use the pre-existing file provided.
              The task of the exercises is to modify the file
              so that it does not crash while calculating the frequencies over
              the file 'pride-and-prejudice.txt'.
"""


from keras.models import Sequential, Model
from keras import layers
from keras import backend as K
import numpy as np
import re, sys, operator, string, pickle, os, math


"""
Function Name:  read_file
Purpose:        This function reads the contents of a file and
                returns the contents in question
Input:          file_name  - The name of the TXT file specified
                             by the user
Result:         Returns a string which is the contents of the file
"""
def read_file(file_name):
    with open(file_name) as file:
        contents = file.read()
    return contents


"""
Function Name:  count_words
Purpose:        This function reads a string of words and calculates
                the frequencies of the words through the creation and
                implementation of Neural Networks
Input:          contents  - A string of words
Result:         Returns a dictionary which holds the frequency of each
                word witin the provided string
"""
def count_words(contents):
    
    
    """
    Function Name:  scan_words
    Purpose:        This function reads a string, removes all
                    non-alphanumeric characters, replaces them with
                    a white space, and splits the contents of the string
                    by each white space
    Input:          string_contents  - A string of words
    Result:         Returns a list of alphanumeric words
    """
    def scan_words(string_contents):
        non_alphanumeric = re.compile('[\W_]+')
        contents = non_alphanumeric.sub(' ', string_contents).lower().split()
        return contents
    
    
    """
    Function Name:  remove_stop_words
    Purpose:        This function removes all stop words from the
                    designated list given
    Input:          all_words  - A list of words
    Result:         Returns the provided list, excluding stop words
    """
    def remove_stop_words(all_words):
        with open('stop_words.txt') as file:
            stop_words = file.read().split(',')
        stop_words.extend(list(string.ascii_lowercase))
        return [w for w in all_words if w not in stop_words]
    
    
    words = remove_stop_words(scan_words(contents))
    uniqs = [''] + list(set(words))
    uniqs_indices = dict((w, i) for i, w in enumerate(uniqs))
    indices = [uniqs_indices[w] for w in words]

    WORDS_SIZE = len(words)
    VOCAB_SIZE = len(uniqs)
    BIN_SIZE = math.ceil(math.log(VOCAB_SIZE, 2))

    def encode_binary(W):
        x = np.zeros((1, WORDS_SIZE, BIN_SIZE, 1))
        for i, w in enumerate(W):
            for n in range(BIN_SIZE): 
                n2 = pow(2, n)
                x[0, i, n, 0] = 1 if (w & n2) == n2 else 0
        return x

    def set_weights(clayer):
        wb = []
        b = np.zeros((VOCAB_SIZE), dtype=np.float32)
        w = np.zeros((1, BIN_SIZE, 1, VOCAB_SIZE), dtype=np.float32)
        for i in range(VOCAB_SIZE):
            for n in range(BIN_SIZE):
                n2 = pow(2, n)
                w[0][n][0][i] = 1 if (i & n2) == n2 else -1
        for i in range(VOCAB_SIZE):
            slice_1 = w[0, :, 0, i]
            n_ones = len(slice_1[ slice_1 == 1 ])
            if n_ones > 0: slice_1[ slice_1 == 1 ] = 1./n_ones 
            n_ones = len(slice_1[ slice_1 == -1 ])
            if n_ones > 0: slice_1[ slice_1 == -1 ] = -1./n_ones 

        wb.append(w)
        wb.append(b)
        clayer.set_weights(wb)

    def SumPooling2D(x):
        return K.sum(x, axis = 1) 

    def model_convnet2D():
        model = Sequential()
        model.add(layers.Conv2D(VOCAB_SIZE, (1, BIN_SIZE),  input_shape=(WORDS_SIZE, BIN_SIZE, 1)))
        set_weights(model.layers[0])
        model.add(layers.ReLU(threshold=1-1/BIN_SIZE))
        model.add(layers.Lambda(SumPooling2D))
        model.add(layers.Reshape((VOCAB_SIZE,)))

        return model, "words-nolearning-{}v-{}f".format(VOCAB_SIZE, BIN_SIZE)


    model, name = model_convnet2D()
    batch_x = encode_binary(indices)
    intermediate_model = Model(inputs=model.input, outputs=[l.output for l in model.layers])
    preds = intermediate_model.predict(batch_x)
    prediction = preds[-1][0]
    
    
    # Export list of unique words and their corresponding predicted frequency into a dictionary
    dictionary = {}
    for w, c in list(zip(uniqs, prediction)):
        dictionary[w] = int(c)
    return dictionary


"""
Function Name:  export_dictionary
Purpose:        This function exports the contents of a dictionary
                into an external file and ensures that any previous
                contents of the file are updated based on the
                dictionary being exported
Input:          word_frequencies  - A dictionary of words and
                                    frequencies
Result:         Generates a pickle file if file does not exist and
                updates contents of file based on the dictionary
                being added to the file
"""
def export_dictionary(word_frequencies):
    if(os.path.exists('dictionary.pickle')):
        pickle_file = open('dictionary.pickle', 'rb')
        current_dictionary = pickle.load(pickle_file)
        pickle_file.close()
        
        for key in word_frequencies.keys():
            if key in current_dictionary:
                current_dictionary[key] += word_frequencies[key]
            else:
                current_dictionary[key] = word_frequencies[key]
        
        pickle_file = open('dictionary.pickle', 'wb')
        pickle.dump(current_dictionary, pickle_file)
        pickle_file.close()
    
    else:
        pickle_file = open('dictionary.pickle', 'wb')
        pickle.dump(word_frequencies, pickle_file)
        pickle_file.close()


"""
Function Name:  print_frequencies
Purpose:        This function reads the contents of the pickle file and
                prints the top 25 most frequent words from within the file
Result:         Prints the top 25 most frequent words from the contents
                of the pickle file
"""
def print_frequencies():
    pickle_file = open('dictionary.pickle', 'rb')
    word_frequencies = pickle.load(pickle_file)
    pickle_file.close()
    os.remove('dictionary.pickle')
    
    for w, c in sorted(word_frequencies.items(), key = operator.itemgetter(1), reverse = True)[:25]:
        print(w + '  -  ' + str(c))

        
# Reads the conents of the file specified by the user
# Splits contents based on every newline character
contents = read_file(sys.argv[1]).split('\n')


# Partitions the contents based on every 200 lines within the file
# From there, counts the frequencies of each partition
# Finally, export the counted frequencies to be tallied in later partitions
for i in range(0, len(contents), 200):
    if i == 2000:
        print()
        print('Calculating Frequencies')
    partition = '\n'.join(contents[i: (i + 200)])
    frequencies = count_words(partition)
    export_dictionary(frequencies)

    
print()
print('RESULTS')
print()
print_frequencies()