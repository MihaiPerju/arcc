# ARCC

## Installing dependencies

In order to run the project, you need to have Node, Meteor, MongoDb and PyPdf installed. 

* Install Meteor here: https://www.meteor.com/install
* Install Node here: https://nodejs.org/en/download/
* Install MongoDb here: https://docs.mongodb.com/manual/installation/
* Install PyPDF here: https://pypi.org/project/pyPdf/

ARCC contains 2 applications - the app and the worker, which is a microservice. 
These are the steps to install the packages and run the project:

1) Make sure mongodb is running
2) `cd` to /app and run `meteor npm install`
3) `cd` to /worker and run `meteor npm install`
IMPORTANT: using `npm install` instead of `meteor npm install` can cause issues with dependencies
4) `cd` to every application and run `npm start`


## Documents

Official documentation - https://docs.google.com/document/d/1d6iB3vKQXrOSnXWmGpik0F31zmIpJrZgyLOEMsKaU_s/edit?ts=5b7c3d6d
