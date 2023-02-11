function connect(){
    return new Promise((resolve, reject)=>{
        try{    

            let DB_DIVER = 'mongodb';
            let DB_HOST = '127.0.0.1';
            let DB_PORT = 27017;
            let DB_NAME = 'admin';
            let DB_USER = '';
            let DB_PASS = '';


            let connectionString = `${DB_DIVER}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
            
            let masterDB = mongoose.createConnection(connectionString,{});

            masterDB.on('error', (err)=>{
                console.log('MongoDB Connection eroor : ', err);
            })

            masterDB.on('close', ()=>{
                console.log('MongoDB Close Connection');
            })

            masterDB.on('open', ()=>{
                console.log('MongoDB Connected to', connectionString);
            })
            
            resolve(masterDB);
        } catch(err){
            console.log(err);
            reject(err);
        }
    })
}

module.exports =  {
    connect
}