module.exports = () => {

    express = require('express');
    mongoose = require('mongoose');
    http = require('http');
    dbOps = require('./loaders/mongodb');


    dbSchemas = require('./models').schemas;
    dbModels = require('./models').models;
}   