const express = require("express");
const bodyParser = require("body-parser");
const { authentication } = require("../middlewares/authMiddleware");
const {
  createBlog,
  fetchBlogDetails,
  deleteBlog,
  fetchAllBlogs,
  fetchCommentsOnBlog,
  postCommentOnBlog,
  addLikeOnComment,
  addDislikeOnComment,
  deleteCommentOnBlog,
  addReplyOnComment,
  addLikeOnBlog,
  updateComment,
  fetchEditorKey,
} = require("../controllers/blogController");

const router = express.Router();

router.get("/editorkey", fetchEditorKey);
router.get("/all", fetchAllBlogs);
router.get("/:id/comments", authentication, fetchCommentsOnBlog);
router.get("/:id", authentication, fetchBlogDetails);

router.post("/:id/like", authentication, addLikeOnBlog);
router.post("/:id/comment", authentication, postCommentOnBlog);
router.post(
  "/:blogId/comment/:commentId/like",
  authentication,
  addLikeOnComment
);
router.post(
  "/:blogId/comment/:commentId/dislike",
  authentication,
  addDislikeOnComment
);
router.post(
  "/:blogId/comment/:commentId/reply",
  authentication,
  addReplyOnComment
);

router.put("/:blogId/comment/:commentId", authentication, updateComment);

router.delete("/:id", authentication, deleteBlog);
router.delete(
  "/:blogId/comment/:commentId",
  authentication,
  deleteCommentOnBlog
);

router.use(bodyParser.json({ limit: "50mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

router.post("/create", authentication, createBlog);

module.exports = router;
