const { Schema, model } = require("mongoose");

//set up schema
const CommentSchema = new Schema({
  writtenBy: {
    // this is the "col name"
    type: String, // These are the field params
    required: true,
  },
  commentBody: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//actually make the comment obj
const Comment = model("Comment", CommentSchema);

module.exports = Comment;
