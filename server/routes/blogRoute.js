const express = require("express")
const { authentication } = require("../middlewares/authMiddleware")
const { createBlog, fetchBlogDetails, deleteBlog, fetchAllBlogs, fetchCommentsOnBlog, postCommentOnBlog, addLikeOnComment, addDislikeOnComment, deleteCommentOnBlog } = require("../controllers/blogController")

const router = express.Router()

router.get("/all", fetchAllBlogs)

router.post("/create", authentication, createBlog)

router.get("/:id", authentication, fetchBlogDetails)

router.post("/:id/like", authentication)

router.delete("/:id", authentication, deleteBlog)

router.get("/:id/comments", authentication, fetchCommentsOnBlog)

router.post("/:id/comment", authentication, postCommentOnBlog)

router.post("/:blogId/comment/:commentId/like", authentication, addLikeOnComment)

router.post("/:blogId/comment/:commentId/dislike", authentication, addDislikeOnComment)

router.delete("/:blogId/comment/:commentId", authentication, deleteCommentOnBlog)

module.exports = router