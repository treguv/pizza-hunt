const router = require("express").Router();

const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

//add comment
//router.(addRoute).RequestType
router.route("/:pizzaId").post(addComment);
//remove comment
router.route("/:pizzaId/:commentId").delete(removeComment).put(addReply); // you can chain them!
//remove a reply
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

// passing remove comment tells it what to do when it recieves a request
module.exports = router;
