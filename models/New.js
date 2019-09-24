const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

const New = mongoose.model('New', NewSchema);

module.exports = New;