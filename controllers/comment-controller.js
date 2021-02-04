const { Comment, Pizza } = require("../models");

const commentController = {
  //add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        // make the comment and get the id

        //add comment to the pizza

        return Pizza.findOneAndUpdate(
          // the $ symbol is preface for the mongodb based function
          { _id: params.pizzaId },
          { $push: { comments: _id } }, //$push adds data to the array
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          // no pizza found
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }

        //return the pizza
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  //add a reply to a comment
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }

        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } }, // pull out the array a specific reply
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => err.json(err));
  },
  //remove the comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId }) // delete comment
      .then((deletedComment) => {
        if (!deletedComment) {
          return res
            .status(404)
            .json({ message: "No comment found with this id" });
        }
        return Pizza.findOneAndUpdate(
          // remove the comment from the post
          { _id: params.pizzaId }, //find pizza with this i d
          { $pull: { comments: params.commentId } }, // remove the comment with this id
          { new: true } //return new
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          // no pizza found
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        //return the pizza data
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
