async function rSet(key,value, args1, ttl)
{
    let result = args1 && ttl ? await rClient.set(key,value, args1, ttl) : await rClient.set(key,value);
    return (result) ? result : null;
}

async function rSetEX(key,value, args1, args2, ttl)
{
    let result = await rClient.set(key,value, args1,args2,ttl);
    return (result) ? result : null;
}

async function rGet(key)
{
    if(typeof key == "object") key = key.join(":");
    let result = await rClient.get(key);
    return (result) ? (result) : null;
}

async function rDel(key)
{
    let result = await rClient.del(key);
    return (result) ? result : null;
}

async function rHmset(key, value)
{
    let result = await rClient.hmset(key, value);
    return (result) ? result : null;
}

async function rHgetall(key)
{
    let result = await rClient.hgetall(key);
    return (result) ? result : null;
}

async function rGetPipeline()
{
    return rClient.pipeline();
}

async function rZadd(key, args1, args2)
{
    return await rClient.zadd(key, args1, args2);
}

async function rZscan(key, args1, args2, args3)
{
    return rClient.zscan(key, args1, args2, args3);
}

async function rIncrBy(key, value)
{
    return await rClient.incrby(key, value);
}

async function rZincrBy(key, args1, args2)
{
    return await rClient.zincrby(key, args1, args2);
}

async function rKeys(key)
{
    return await rClient.keys(`*${key}*`);
}

async function rSadd(key,values= [])
{
    return await rClient.sadd([key, ...values]);
}

async function rSrem(key,values= [])
{
    return await rClient.srem([key, ...values]);
}

async function rSmembers(key)
{
    return await rClient.smembers(key);
}

async function hSet(hash, key, value) {
    return rClient.hset(hash, key, typeof value === "object" ? JSON.stringify(value) : value);
}

async function hDel(hash, key) {
    return rClient.hdel(hash, key);
}

async function hGetAll(hash) {
    return await rClient.hgetall(hash);
}

async function keys(pattern) {
    return await rClient.keys(pattern);
}

module.exports = { rSetEX, rZadd, rZincrBy, rZscan, rIncrBy, rDel, rGetPipeline, rSet, rGet, rHgetall, rHmset, rKeys, rSadd, rSrem, rSmembers, hSet, hDel, hGetAll, keys }