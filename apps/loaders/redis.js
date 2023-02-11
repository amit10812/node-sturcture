function connect() {
    console.log("redis connect called")

    // config set notify-keyspace-events KEg$lshzxe 

    return new Promise(resolve => {
        Promise.all([
            initRedisClient(process.env.REDIS_DB), 
            initScanRedisClient(process.env.REDIS_SCAN_DB), 
            initRedisPublisher(process.env.REDIS_DB),
            initRedisSubscriber(process.env.REDIS_DB)
        ]).then(function(values) {
            // console.log("All Redis connection has been done.")            
            resolve();
        }).catch(err => {
            // console.log("Redis Conection error : ", err);
        });
    });
}

module.exports = {
    connect
}

// function connect() {
//     console.log("redis connect called")

//     // config set notify-keyspace-events KEg$lshzxe 

//     return new Promise(resolve => {
//         Promise.all([
//             initRedisClient(process.env.REDIS_DB), 
//             initScanRedisClient(process.env.REDIS_SCAN_DB), 
//             initRedisPublisher(process.env.REDIS_DB),
//             initRedisSubscriber(process.env.REDIS_DB)
//         ]).then(function(values) {
//             // console.log("All Redis connection has been done.")            
//             resolve();
//         }).catch(err => {
//             // console.log("Redis Conection error : ", err);
//         });
//     });
// }

// async function setUserSession(userId, data) {
//     return await rClient.hmset(`SESSION:${userId}`, data);
// }

// async function getUserSession(userId, data) {
//     return await rClient.hgetall(`SESSION:${userId}`);
// }

// async function saveUserSocket(userId, socketId, dbId) {
//     if(!userId || !socketId) {
//         return // console.log("returning from saveUserSocket");
//     }
//     if(!dbId) {
//         dbId = 'NONE'
//     }
//     return await rScanClient.setex(`SOCKETS:${AppName}:${dbId}:${userId}:${socketId}`, 50, new Date());
// }

// async function saveAdminSocket(adminId, socketId) {
//     if(!adminId || !socketId) {
//         return // console.log("returning from saveUserSocket");
//     }
//     return await rClient.setex(`ADMINSOCKETS:${adminId}:${socketId}`, 50, new Date());
// }

// async function getUserSockets(userId, dbId = '*', appName = AppName) {
//     let keys = await rdsOps.redisKeys(`SOCKETS:${appName}:${dbId}:${userId}:*`);
//     // console.log("getUserSockets : keys : ", keys)
//     for(var i=keys.length - 1; i >= 0; i--) {
//         let splittedKey = keys[i].split(":");
//         keys[i] = splittedKey[splittedKey.length - 1];
//         if(!keys[i]) keys.splice(i, 1);
//     }
//     return keys;
// }

// async function saveElectronSockets(userId, socketId, dbId) {
//     if(!userId || !socketId || !dbId) {
//         return console.log("returning from saveUserSocket");
//     }
//     return await rScanClient.setex(`ELECTRONSOCKETS:${AppName}:${dbId}:${userId}:${socketId}`, 50, new Date());
// }

// async function getElectronAppSockets(userId, dbId = '*', appName = AppName) {
//     let keys = await rdsOps.redisKeys(`ELECTRONSOCKETS:${appName}:${dbId}:${userId}:*`);
//     for(var i=keys.length - 1; i >= 0; i--) {
//         let splittedKey = keys[i].split(":");
//         keys[i] = splittedKey[splittedKey.length - 1];
//         if(!keys[i]) keys.splice(i, 1);
//     }
//     return keys;
// }


// function initRedisConnection(dbIndex){
//     return new Promise(resolve => {
//         let redisClient = getRedisConnection(dbIndex);
//         redisClient.on("error", function(error) {
//             console.error("Redis Client error : ",error);
//         });

//         redisClient.on("ready", function() {
//             console.log("Redis Client connected ", new Date(), dbIndex)
//             resolve(redisClient);
//         });
//     })   
// }

// function initRedisClient(dbIndex){
//     return new Promise(resolve => {
//         rClient = getRedisConnection(dbIndex);
//         rClient.on("error", function(error) {
//             console.error("Redis Client error : ",error);
//         });

//         rClient.on("ready", function() {
//             console.log("Redis Client connected ", new Date(), dbIndex)
//             resolve();
//         });
//     })   
// }

// function initScanRedisClient(dbIndex){
//     return new Promise(resolve => {
//         rScanClient = getRedisConnection(dbIndex);
//         rScanClient.on("error", function(error) {
//             console.error("Redis Scanner Client error : ",error);
//         });

//         rScanClient.on("ready", function() {
//             console.log("Redis Scanner Client connected ", new Date(), dbIndex)
//             resolve();
//         });
//     })   
// }

// function initRedisPublisher(dbIndex){
//     return new Promise(resolve => {
//         rPub = getRedisConnection(dbIndex);
//         rPub.on("error", function(error) {
//             console.error("Redis Publisher error : ",error);
//         });

//         rPub.on("ready", function() {
//             console.log("Redis Publisher connected ", new Date(), dbIndex)
//             resolve();
//         });
//     })   
// }

// function initRedisSubscriber(dbIndex){
//     return new Promise(resolve => {
//         rSub = getRedisConnection(dbIndex);
//         rSub.on("error", function(error) {
//             console.error("Redis Subscriber error : ",error);
//         });

//         rSub.on("ready", function() {
//             console.log("Redis Subscriber connected ", new Date(), dbIndex)
//             resolve();

//             rSub.psubscribe(`${AppName}.other.*`,`${AppName}.user.*`, `${AppName}.room.*`, 'user.*', 'room.*', `__keyevent@${process.env.REDIS_DB}__:expired`, function (err, count) {
//                 // console.log("psubscribe : err : ", err)
//                 // console.log("psubscribe : count : ", count)
//             });

//             rSub.on("pmessage", function (pattern, channel, msg) {

//                 if (!process.env.EXPRESS_SERVER) return;
//                 // console.log("psubscribe : pattern : ", pattern)
//                 // console.log("psubscribe : channel : ", channel)
//                 // console.log("psubscribe : msg : before : ", msg)

//                 if(channel == `__keyevent@${process.env.REDIS_DB}__:expired`) {
//                     return handleExpiredERedisKeys(msg);
//                 }

//                 let message = commonService.parseJSON(msg)

//                 if(!message) {
//                     return // console.log("missing message data")
//                 }

//                 if(ServerId == message.ServerId) {
//                     return // console.log("same server detected");
//                 }

//                 // console.log("Handle redis published message")

//                 let { event, data, statusCode } = message;

//                 if(!event || !data) {
//                     return // console.log("missing some data", event, data)
//                 }

//                 switch(pattern) {
//                     case `${AppName}.user.*`:
//                     case 'user.*':
//                         let user = channel.replace(pattern == 'user.*' ? 'user.' : `${AppName}.user.`, '');
//                         let client = io.of('/').sockets.get(user);
//                         if(client) {
//                             commonService.SendData(client, event, data, statusCode, '', true)
//                         }
//                         break;
//                     case `${AppName}.room.*`:
//                     case 'room.*':
//                         let room = channel.replace(pattern == 'room.*' ? 'room.' : `${AppName}.room.`, '');
//                         commonService.PublishDataToRoom(room, event, data, '', true)
//                         break;

//                     case `${AppName}.other.*`:
//                     case 'other.*':
//                         switch(event) {
//                             case 'updatetOnlineUserCount':
//                                 commonService.updatetOnlineUserCount({ appName: AppName, published: true });
//                                 break;
                            
//                             // case 'executeWriteProfile':
//                             //     heapProfilerService.executeWriteProfile({ published: true });
//                             //     break;
//                         }
//                         break;
                    
//                 }

//                 // console.log("psubscribe : message : after : ", message)
//             });
//         });
//     })   
// }

// async function handleExpiredERedisKeys(key) {
//     // console.log("handleExpiredERedisKeys : key : ", key);
//     return;

//     if(key.indexOf(`ACTIVE:${AppName}:`) != -1) {
//         return;
//         // console.log(`handleExpiredERedisKeys : 'ACTIVE:${AppName}:' found...`);
//         key = key.replace(`ACTIVE:${AppName}:`, '');
//         // console.log("handleExpiredERedisKeys : key : after : ", key);

//         let spKey = key.split(":")
//         // console.log("handleExpiredERedisKeys : spKey : ", spKey);
//         let tenantDB = await dbOps.model(masterDB, 'tenant_dbs').findOne({ _id: spKey[0] }, "dbIdentifier dbName").lean();
//         if(tenantDB) {
//             let client = {
//                 userId: spKey[1],
//                 dbId: tenantDB._id.toString(),
//                 dbName: tenantDB.dbName,
//                 dbIdentifier: tenantDB.dbIdentifier
//             }
//             chatService.updateOnlineStatus(client, 2);            
//         } else {
//             // console.log("No tenantDB found for user : ", spKey[0]);
//         }
//     } else if(key.indexOf(`SOCKETS:${AppName}:`) != -1) {
//         return;
//         // console.log("handleExpiredERedisKeys : 'SOCKETS:${AppName}:' found...");
//         key = key.replace(`SOCKETS:${AppName}:`, '');
//         // console.log("handleExpiredERedisKeys : key : after : ", key);

//         let spKey = key.split(":")
//         // console.log("handleExpiredERedisKeys : spKey : ", spKey);
//         let tenantDB = await dbOps.model(masterDB, 'tenant_dbs').findOne({ _id: spKey[0] }, "dbIdentifier dbName").lean();
//         if(tenantDB) {
//             let client = {
//                 userId: spKey[1],
//                 dbId: tenantDB._id.toString(),
//                 dbName: tenantDB.dbName,
//                 dbIdentifier: tenantDB.dbIdentifier
//             }
//             chatService.updateOnlineStatus(client, 0);            
//         } else {
//             // console.log("No tenantDB found for user : ", spKey[0]);
//         }
//     } else if(key.indexOf(`ALERT:${AppName}:`) != -1) {
//         return;
//         // console.log("handleExpiredERedisKeys : sendMessageAlert : 'ALERT:${AppName}:' found...");
//         key = key.replace(`ALERT:${AppName}:`, '');
//         // console.log("handleExpiredERedisKeys : sendMessageAlert : key : after : ", key);

//         let spKey = key.split(":")
//         // console.log("handleExpiredERedisKeys : sendMessageAlert : spKey : ", spKey);
//         let { db, dbInfo } = await tenantService.getTenantDB({ dbId: spKey[0] });
//         if(dbInfo) {
//             chatService.sendMessageAlert({ userId: spKey[1], ...dbInfo }, spKey[2], spKey[3], db);            
//         } else {
//             // console.log("No tenantDB found for user : ", spKey[0]);
//         }
//     }
// }

// function getRedisConnection(dbIndex) {
//     let { REDIS_HOST, REDIS_PORT, REDIS_AUTH, REDIS_DB } = process.env;

//     let DB = dbIndex != null && !isNaN(dbIndex) ? dbIndex : REDIS_DB

//     return new redis({
//         host: REDIS_HOST,
//         port: REDIS_PORT,
//         password: REDIS_AUTH,
//         db: DB
//     });
// }

// async function redisKeys(pattern) {
//     try {
//         if(process.env.FETCH_REDIS_KEYS == 'keys') {
//             return await rScanClient.keys(pattern);
//         }
//         return await redisScan(0, pattern, []);
//     } catch(err) {
//         console.log("redisKeys err : ", err);
//         return [];
//     }
// }

// async function redisScan(cursor, pattern, results) {
//     try {
//         let reply = await rScanClient.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
//         // console.log("reply : ", reply)
//         if(!reply) {
//             return results;
//         }

//         let keys = reply[1]
//         keys.forEach(function(key) {
//             results.push(key)
//         })

//         cursor = reply[0]
//         if(cursor === '0') {
//             return results;
//         } else {
//             return redisScan(cursor, pattern, results)
//         }

//     } catch(err) {
//         console.log("redisScan err : ", err);
//         return [];
//     }
// }





// module.exports = {
//     connect,
//     setUserSession,
//     getUserSession,
//     saveUserSocket,
//     getUserSockets,
//     saveAdminSocket,
//     saveElectronSockets,
//     getElectronAppSockets,
//     redisScan,
//     redisKeys,
//     initRedisConnection,
// }