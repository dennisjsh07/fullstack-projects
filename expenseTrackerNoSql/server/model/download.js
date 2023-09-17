const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DownloadSchema = new Schema({
    fileurl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})
module.exports = mongoose.model('download', DownloadSchema);
 