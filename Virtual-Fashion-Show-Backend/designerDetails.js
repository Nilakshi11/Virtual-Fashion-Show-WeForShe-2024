const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    email: { type: String, required: true }, // The email of the commenter
    text: { type: String, required: true }, // The comment text
    timestamp: { type: Date, default: Date.now }, // The time when the comment was made
});

const designSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
    category: { type: String, required: true },
    video: { type: String, required: true }, 
    price: { type: Number, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    comment: [commentSchema],
    orders: { type: String },
});

const designerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileno: { type: String, required: true },
    location: { type: String, required: true },
    photo: { type: String, required: true },
    designs: [designSchema],
    followers: { type: Number, default: 0 },
});

mongoose.model('DesignerInfo', designerSchema);