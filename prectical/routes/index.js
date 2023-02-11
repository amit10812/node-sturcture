const categories = require('./categories');

module.exports = function(app, err) {
    app.use(express.json());
    app.get("/", (req,res)=>{ res.send("Welcome") });
    app.use('/api/categories', categories);
}