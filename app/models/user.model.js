// module.exports = mongoose => {
//     const User = mongoose.model(
//         "user",
//         mongoose.Schema(
//             {
//                 username: String,
//             },
//             { timestamps: true }
//         )
//     );
//     return User;    
// }

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'users'
})

module.exports = mongoose.model('User', userSchema);