const schema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        default : '',
    },
    price : {
        type : Number, 
        default : 0,
    },
    parent : {
        type : String,
        default : null,
    }
},{ timestamps: { createdAt: true, updatedAt: true } })

module.exports = schema;