// async function find(model,{query, options = {}}, limit = 0)
// {
//     let result = await model.find(query, options).limit(limit).lean();
//     return (result) ? result : null;
//     // console.log(models.countDocuments({}));
// }

const { ObjectId } = require("mongoose/lib/drivers/node-mongodb-native");
//const { isDefined, matchAndMerge } = require("../services/common");
// async function findTwo(db,{collection, query, options }, limit = 0)
// {
//     let result = await dbOps.model(db, collection).find(query, options).limit(limit).lean();
//     return (result) ? result : null;
// }

// async function findThree({db, collection, query, options}, limit = 0)
// {
//     let result = await dbOps.model(dbOps.db('DB1', db),collection).find(query, options).limit(limit).lean();
//     return (result) ? result : null;
// }

/**
 *
 * @param db
 * @param collection
 * @param query
 * @param options
 * @param project
 * @param limit
 * @param skip
 * @param sort
 * @param populate
 * @param hint
 * @returns {Promise<[]>}
 */
async function find({
  db,
  collection,
  query,
  options,
  project,
  limit,
  skip,
  sort,
  populate,
  hint
}) {

  let result = await dbOps
    .model(db, collection)
    .find(query, project, options)
    .populate(populate)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .hint(hint ? hint : {})
    .lean()
    .exec();
  return result ? result : null;
}

/**
 *
 * @param db
 * @param collection
 * @param query
 * @param project
 * @param sort
 * @param populate
 * @param hint
 * @returns {Promise<Object|null>}
 */
async function findOne({ db, collection, query, project, sort, populate, hint }) {
  let result = await dbOps
    .model(db, collection)
    .findOne(query, project)
    .sort(sort)
    .hint(hint ? hint : {})
    .populate(populate)
    .lean()
    .exec();
  return result ? result : null;
}

/**
 * @method insertOne
 * @param db {object|db}
 * @param collection {string}
 * @param document {object}
 * @param options {object}
 * @returns {Promise<*>}
 */
async function insertOne({ db, collection, document, options }) {
  let result = await dbOps.model(db, collection).create(document, options);
  return result && result.toObject ? result.toObject() : result;
}

async function insertMany({ db, collection, documents, options }) {
  let result = await dbOps.model(db, collection).insertMany(documents, options);
  result = result.map(e => {
    return e && e.toObject ? e.toObject() : e;
  })
  return result ? result : null;
}

async function updateOne({ db, collection, query, update, options }) {
  let result = await dbOps
    .model(db, collection)
    .updateOne(query, update, options)
    .lean();
  return result ? result : null;
}

async function updateMany({ db, collection, query, update, options }) {
  let result = await dbOps
    .model(db, collection)
    .updateMany(query, update, options)
    .lean();
  return result ? result : null;
}

async function deleteOne({ db, collection, query, options }) {
  let result = await dbOps.model(db, collection).deleteOne(query, options);
  return result ? result : null;
}

async function deleteMany({ db, collection, query, options }) {
  let result = await dbOps.model(db, collection).deleteMany(query, options);
  return result ? result : null;
}

/**
 * @method distinct
 * @param db
 * @param collection
 * @param field
 * @param query
 * @returns {Promise<[]>}
 */
async function distinct({ db, collection, field, query }) {
  let result = await dbOps.model(db, collection).distinct(field, query);
  return result ? result : null;
}

async function aggregate({ db, collection, pipeline, options, readPreference }) {
  let result = await dbOps.model(db, collection, options).aggregate(pipeline).read(readPreference ? readPreference : "primaryPreferred").allowDiskUse(true).collation({ locale: 'en' }).exec();
  return result ? result : null;
}

/**
 *
 * @param db
 * @param collection
 * @param query
 * @param project
 * @param data
 * @param keys
 * @param as
 * @param options
 * @returns {Promise<[]>}
 */
async function customAggregate({ db, collection, query, project, data = [], keys = {}, as = 'something', options = { allowNull: true } }) {
  let result = await find({ db, collection, query, project });

  return await matchAndMerge({
    sourceData: result,
    targetData: data,
    keys,
    as,
    options
  });
}

/**
 *
 * @param db
 * @param collection
 * @param query
 * @returns {Promise<Number>}
 */
async function countDocuments({ db, collection, query }) {
  let result = await dbOps.model(db, collection).countDocuments(query).lean();
  return result ? result : 0;
}

async function findByIdAndUpdate({ db, collection, query, update, options }) {
  let result = await dbOps
    .model(db, collection)
    .findByIdAndUpdate({ _id: ObjectId(query) }, update, options)
    .lean();
  return result ? result : null;
}

async function save({ db, collection, document, options }) {
  let result = await document.save({ lean: true });
  // let result = await dbOps.model(db, collection).create(document, options);
  return result && result.toObject ? result.toObject() : result;
}

async function findByIdAndDelete({ db, collection, id, options }) {
  let result = await dbOps
    .model(db, collection)
    .deleteOne({ _id: ObjectId(id) }, options);
  return result ? result : null;
}

async function findOneAndUpdate({ db, collection, query, update, options }) {
  let result = await dbOps
    .model(db, collection)
    .findOneAndUpdate(query, update, options)
    .lean();
  return result && result.toObject ? result.toObject : result;
}

async function findOneAndDelete({ db, collection, query, options }) {
  let result = await dbOps
    .model(db, collection)
    .findOneAndDelete(query, options);
  return result ? result : null;
}

/**
 *
 * @param db
 * @param collection
 * @param object
 * @returns {Object}
 */
function createDocument({ db, collection, object }) {
  return dbOps.model(db, collection)(object);
}

function dropCollection({ db, collection }) {
  return dbOps.model(db, collection).collection.drop();
}


async function bulkWrite({ db, collection, documents }) {
  let result = await dbOps
    .model(db, collection)
    .bulkWrite(documents);
  return result ? result : null;
}

module.exports = {
  find,
  findOne,
  save,
  updateOne,
  updateMany,
  insertOne,
  insertMany,
  deleteOne,
  deleteMany,
  findByIdAndUpdate,
  findOneAndDelete,
  countDocuments,
  distinct,
  aggregate,
  findOneAndUpdate,
  createDocument,
  dropCollection,
  customAggregate,
  bulkWrite
};
