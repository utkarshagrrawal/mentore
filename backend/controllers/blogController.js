const { createBlogLogic, fetchBlogDetailsLogic, deleteBlogLogic, fetchAllBlogsLogic, fetchCommentsOnBlogLogic, postCommentOnBlogLogic, addLikeOnCommentLogic, addDislikeOnCommentLogic, deleteCommentOnBlogLogic, addLikeOnBlogLogic, addReplyOnCommentLogic, updateCommentLogic } = require("../logic/blogLogic");

require('dotenv').config();

const fetchAllBlogs = async (req, res) => {
    const response = await fetchAllBlogsLogic();
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
};

const createBlog = async (req, res) => {
    const response = await createBlogLogic(req.body, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
};

const fetchBlogDetails = async (req, res) => {
    const response = await fetchBlogDetailsLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
};

const deleteBlog = async (req, res) => {
    const response = await deleteBlogLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
};

const fetchCommentsOnBlog = async (req, res) => {
    const response = await fetchCommentsOnBlogLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ result: response.success })
}

const postCommentOnBlog = async (req, res) => {
    const response = await postCommentOnBlogLogic(req.user, req.params, req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const addLikeOnComment = async (req, res) => {
    const response = await addLikeOnCommentLogic(req.user, req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const addDislikeOnComment = async (req, res) => {
    const response = await addDislikeOnCommentLogic(req.user, req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const addLikeOnBlog = async (req, res) => {
    const response = await addLikeOnBlogLogic(req.params, req.user);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const deleteCommentOnBlog = async (req, res) => {
    const response = await deleteCommentOnBlogLogic(req.params);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const addReplyOnComment = async (req, res) => {
    const response = await addReplyOnCommentLogic(req.params, req.user, req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const updateComment = async (req, res) => {
    const response = await updateCommentLogic(req.params, req.user, req.body);
    if (response.error) {
        return res.json({ error: response.error })
    }
    return res.json({ success: response.success })
}

const fetchEditorKey = async (req, res) => {
    return res.json({ key: process.env.TINY_MCE_API_KEY })
}

module.exports = {
    fetchAllBlogs,
    createBlog,
    fetchBlogDetails,
    deleteBlog,
    addLikeOnBlog,
    fetchCommentsOnBlog,
    postCommentOnBlog,
    addLikeOnComment,
    addDislikeOnComment,
    deleteCommentOnBlog,
    addReplyOnComment,
    updateComment,
    fetchEditorKey
};
