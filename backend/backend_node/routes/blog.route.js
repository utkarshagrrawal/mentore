const express = require("express");
const bodyParser = require("body-parser");
const { authentication } = require("../middlewares/auth.middleware");
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
} = require("../controllers/blog.controller");

const router = express.Router();

router.get("/editorkey", fetchEditorKey);

router.get("/all", fetchAllBlogs);

router.get("/:id", authentication, fetchBlogDetails);

router.post("/:id/like", authentication, addLikeOnBlog);

router.delete("/:id", authentication, deleteBlog);

router.get("/:id/comments", authentication, fetchCommentsOnBlog);

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

router.delete(
  "/:blogId/comment/:commentId",
  authentication,
  deleteCommentOnBlog
);

router.put("/:blogId/comment/:commentId", authentication, updateComment);

router.post(
  "/:blogId/comment/:commentId/reply",
  authentication,
  addReplyOnComment
);

router.use(bodyParser.json({ limit: "10mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

router.post("/create", authentication, createBlog);

module.exports = router;
