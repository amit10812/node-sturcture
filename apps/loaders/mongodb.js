function connect(){
    return new Promise(resolve => {
        let { 
            DB1_DRIVER,DB1_HOST,DB1_PORT,DB1_USER,DB1_PASS,DB1_NAME,DB1_IDENTIFIER
        } = process.env;

        dbClient = {};
        dbList = {};
        modelList = {};

        Promise.all([
            initClientDbConnection(DB1_DRIVER, DB1_HOST, DB1_PORT, DB1_USER, DB1_PASS, DB1_NAME, DB1_IDENTIFIER),
        ]).then(function (){
            masterDB = db('DB1','admin');
            resolve("Database Connected....");
        }).catch(err=>{
            console.log(' Database Connection Error: ',err)
        })
    })
}

function db(dbIdentifier, dbName){
    if(dbList[dbIdentifier + '_' + dbName]) {
        // console.log("db Loaded from memory");
        return dbList[dbIdentifier + '_' + dbName];
    } else {
        let dbObj = dbClient[dbIdentifier].useDb(dbName, { useCache: true, useFindAndModify: false, useCreateIndex: true });
        dbList[dbIdentifier + '_' + dbName] = dbObj
        return dbObj;
    }
    return dbClient[dbIdentifier].useDb(dbName, { useCache: true, useFindAndModify: false, useCreateIndex: true });
}

function model(db, schema) {
    if(modelList[db.name + '_' + schema]) {
        return modelList[db.name + '_' + schema];
    } else {
        let modelObj = db.model(schema, dbSchemas[schema], schema);
        delete db.models[schema]
        delete db.collections[schema];
        //delete db.base.modelSchemas[schema];
        modelList[db.name + '_' + schema] = modelObj
        return modelObj;
    }
}

function initClientDbConnection(DB_DRIVER, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, DB_IDENTIFIER) {
    return new Promise(resolve => {
        let connectionString = `${DB_DRIVER}://${DB_USER && DB_PASS ? DB_USER + ":" + DB_PASS + "@" : ""}${DB_HOST}${DB_DRIVER == 'mongodb' ? ':' + DB_PORT : ''}`
        // console.log("process.env : ", process.env)
        // console.log("connectionString : ", connectionString)
        dbClient[DB_IDENTIFIER] = mongoose.createConnection(connectionString, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false,
            // poolSize: 50,
        });
        
        dbClient[DB_IDENTIFIER].on("error", (err) => {
            console.error("MongoDB Connection Error>> : ", err, connectionString);
        });

        dbClient[DB_IDENTIFIER].on("close", () => {
            console.error("Remove All listeners on MongoDB");
            dbClient[DB_IDENTIFIER].removeAllListeners()
        });
        
        dbClient[DB_IDENTIFIER].once("open", function() {
            console.log("MongoDB connected to ",connectionString);
            resolve(dbClient[DB_IDENTIFIER]);
        });
    });
}

module.exports = {
    connect,
    db,
    model,
    // model_new
}