const { Schema, model, Types } = require("mongoose");
//getter for date formating
const dateFormat = require("../utils/dateFormat");
// you can have multiple schemas in the same object file
//schema for the replies
const ReplySchema = new Schema(
  {
    //setup custom id to avoid confusin with parent comment id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
    },
    writtenBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true, // Tell mongoose to use the getters we specify
    },
    id: false, // doesnt need id
  }
);
//set up schema
const CommentSchema = new Schema(
  {
    writtenBy: {
      // this is the "col name"
      type: String, // These are the field params
    },
    commentBody: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    replies: [ReplySchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true, // Tell mongoose to use the getters we specify
    },
    id: false, // doesnt need id
  }
);
CommentSchema.virtual("replyCount").get(function () {
  // we need function not => so we get "this" context
  return this.replies.length;
});
//actually make the comment obj
const Comment = model("Comment", CommentSchema);

module.exports = Comment;
