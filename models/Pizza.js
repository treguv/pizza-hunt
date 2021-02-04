const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    // making the schema model
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal), //getter to format date
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [], // [] signifies an array. Can also use Array keyword
    comments: [
      // add link to the comments
      {
        type: Schema.Types.ObjectId, //tell it to expect an object id
        ref: "Comment", // search and find the comment
      },
    ],
  },
  {
    toJSON: {
      // tell mongoose it can use virtuals
      virtuals: true,
      getters: true, // Tell mongoose to use the getters we specify
    },
    id: false, // doesnt need id
  }
);
//create the virtual "calculated" value
//get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  // create virtyal val named commentCount
  //give it value of comments.length
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
