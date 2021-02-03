const router = require("express").Router();

const {
  addComment,
  removeComment,
} = require("../../controllers/comment-controller");

//add comment
//router.(addRoute).RequestType
router.route("/:pizzaId").post(addComment);
//remove comment
router.route("/:pizzaId/:commentId").delete(removeComment);
// passing remove comment tells it what to do when it recieves a request
module.exports = router;
