module.exports = () => {
    // Defaults Module
    path = require('path');
    dotenv = require('dotenv')
    dotenv.config({ path: path.join(__dirname, "./.env") });

    express = require('express');
    mongoose = require('mongoose');
    http = require('http');
    https = require('https');
    fs = require('fs');
    socketIO = require('socket.io');
    // APP  
    AppName = 'SYSTEM';

    // Custom Modules
    dbSchemas = require('./models').schemas;
    dbModels = require('./models').models;

    // Loaders
    dbOps = require("./loaders/mongodb");
    rdsOps = require("./loaders/redis");

    Mongo = require('./utils/mgs');

    // Functionality Services
    adminServices = require('./services/admin');
    systemServices = require('./services/system');

    rootServices = [].concat(adminServices,systemServices).reduce((acc,next)=>{
        acc[next.name] = next;
        return acc;
    },{})
}