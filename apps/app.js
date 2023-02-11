process.on('unhandledRejection', (reason, p) => {
    console.error(new Date(), reason, '\n', 'Unhandled Rejection at Promise', '\n', p);
}).on('uncaughtException', err => {
    if(err.toString() == "TypeError: Cannot read property 'execute' of undefined") {
        return console.log("Uncaught Exception thrown ==> ", err.toString())
    }
    console.error(new Date(), 'Uncaught Exception thrown', '\n', err);
});

require('./modules')();

require('./loaders/express')();

require('./loaders/sockets')();

Promise.all([
    dbOps.connect(),
]).then(async()=>{
    let port = process.env[`${AppName}_PORT`] || 3001;

    server.listen(port, function() {
        console.log(AppName, "Server listening to the port", port, new Date())
    });
})