let schemas = {
    categories : require('./categories'),
}
let models = {}
for (let key in schemas) {
    models[key] = mongoose.model(key, schemas[key], key);
}

module.exports = { schemas, models };