from __future__ import division
import sys
import csv
import argparse
from collections import defaultdict

import numpy
import statistics
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.model_selection import cross_val_score
from sklearn.naive_bayes import BernoulliNB
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import RidgeCV
from sklearn.linear_model import ElasticNetCV
from sklearn import preprocessing
from sklearn import svm
import matplotlib.pyplot as plt
from sklearn.externals import joblib


def load_file(file_path, discrete_clf):
	successes = []
	feats = []
	with open(file_path, 'r', encoding='latin1') as file_reader:
		reader = csv.reader(file_reader, delimiter=',', quotechar='"')
		for row in reader:
			succ = (float(row[2]))
			#starts at 10
			feat = []

			#add total enrollment
			add_feat(row[7], feat)
			#add selected population
			for i in range(10, 23):
				add_feat(row[i], feat)
			#add race
			for i in range(33, 38):
				add_feat(row[i], feat)
			#add gender
			for i in range(38, 40):
				add_feat(row[i], feat)
			#add higher ed
			for i in range(42, 47):
				add_feat(row[i], feat)
			#add incidents
			for i in range(47, 51):
				add_feat(row[i], feat)
			#add year
			add_feat(row[1], feat)


			#add charter
			add_feat(row[56], feat)
			#add district
			add_feat(discrete_clf.predict(float(row[63]))[0], feat)

			#add teachers
			for i in range(27, 31):
				add_feat(row[i], feat)
			
			successes.append(succ)
			feats.append(feat)

	return (successes, feats)

def add_feat(toAdd, feat):
	if toAdd != "": 
		feat.append(float(toAdd))
	else:
		feat.append(-1)

def main():

	##### DO NOT MODIFY THESE OPTIONS ##########################
	parser = argparse.ArgumentParser()
	#parser.add_argument('-training', required=True, help='Path to training data')
	parser.add_argument('-test', required=True, help='Path to test data')
	opts = parser.parse_args()
	############################################################

	###### LOAD THE MODEL ##################################

	classifier = joblib.load('clf.pkl')
	scaler = joblib.load('scaler.pkl')
	discrete_clf = joblib.load('discrete_clf.pkl')

	###########################################################

	###### CALCULATE SCORE BASED ON TEST DATA #################

	# Test the classifier on the given test set
	# Load test labels and texts using load_file()
	(test_labels, test_ratios) = load_file(opts.test, discrete_clf)

	test_ratios = numpy.array(test_ratios)
	#test_ratios = test_ratios.reshape(-1, 1)

	# Extract test features using vectorizer.transform()
	test_features = scaler.transform(test_ratios)

	# Predict the labels for the test set
	predicted_labels = classifier.predict(test_features)
	
	#print('sklearn confusion matrix:', confusion_matrix(test_labels, predicted_labels))
	print('classifier score: ', classifier.score(test_features, test_labels))

	fig, ax = plt.subplots()
	ax.scatter(test_labels, predicted_labels, color='#d7a29e', s=3)
	ax.plot([0, 10], [0, 10], 'k--', lw=2, color='#595a6d')
	ax.set_xlabel('Measured')
	ax.set_ylabel('Predicted')
	plt.title('Overall Classifier Accuracy')
	plt.savefig('plot.png', dpi=300, size='xx-large')
	###########################################################

	###### PREDICT FROM NEW ##################################
	(feat_labels, feat_ratios) = load_file('feature.csv', discrete_clf)

	feat_ratios = numpy.array(feat_ratios)

	# Extract test features using vectorizer.transform()
	feat_features = scaler.transform(feat_ratios)

	# Predict the labels for the test set
	predicted_labels = classifier.predict(feat_features)
	print("predicted label is", predicted_labels)

	###########################################################

if __name__ == '__main__':
	main()