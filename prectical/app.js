
require('./modules')();

require('./loaders/express')();

require('./routes')(app);

Promise.all([
    dbOps.connect(),
]).then(async()=>{

    let port  = 3000;
    
    /** Server listening on port number 3000 */
    app.listen(3000,function(){
        console.log('Server listening to the port', port)
    })
})