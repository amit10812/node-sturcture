let schema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    phone : {
        type : String,
    },
    phoneNumber : {
        type : String,
    },
    nationalFormat :{
        type : String,
    },
    // data : {
    //     type : mixed,
    // }
},{ timestamps: { createdAt: true, updatedAt: true } })


module.exports = schema;