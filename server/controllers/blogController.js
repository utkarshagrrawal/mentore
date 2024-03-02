const { supabase } = require("../utility/dbConnection");

const getBlogs = async (req, res) => {
    const { data, error } = await supabase
        .from("blogs")
        .select()
        .eq("email", req.user.email);
    if (!error) {
        return res.json({ result: data });
    }
    return res.json({ error: error.message });
};

const getAllBlogs = async (req, res) => {
    const { data, error } = await supabase.from("blogs").select();
    if (!error) {
        return res.json({ result: data });
    }
    return res.json({ error: error.message });
};

const createBlog = async (req, res) => {
    const { title, content } = req.body;
    const { error } = await supabase.from("blogs").insert({
        title: title,
        content: content,
        email: req.user.email,
        name: req.user.name,
        likes: 0,
        comments: [],
    });
    if (!error) {
        return res.json({ success: "Blog created successfully!" });
    }
    return res.json({ error: error.message });
};

const getCurrentBlog = async (req, res) => {
    const { blogID } = req.body;
    const { data, error } = await supabase
        .from("blogs")
        .select()
        .eq("id", blogID);
    if (!error) {
        return res.json({ result: data[0] });
    }
    return res.json({ error: error.message });
};

const deleteBlog = async (req, res) => {
    const { id } = req.body;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (!error) {
        return res.json({ success: "Blog deleted successfully!" });
    } else {
        return res.json({ error: error.message });
    }
};

const getComments = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .rpc('get_comments_with_likes_dislikes', { blog_id: id })

    if (error) {
        return res.json({ error: error.message });
    }
    return res.json({ result: data })
}

const postComment = async (req, res) => {
    const { comment } = req.body;
    const { id } = req.params;
    const { error } = await supabase
        .from("blog_comments")
        .insert({ blog_id: id, comment: comment, user_email: req.user.email, user_name: req.user.name, time: new Date().toISOString(), gender: req.user.gender });

    if (error) {
        return res.json({ error: error.message });
    }
    return res.json({ success: "Comment added successfully!" });
}

const addCommentLike = async (req, res) => {
    const { commentID } = req.body;

    const { error: newError } = await supabase
        .from("blog_comment_dislikes")
        .delete()
        .eq("comment_id", commentID)
        .eq("user_email", req.user.email);

    if (newError) {
        return res.json({ error: newError.message });
    }

    const { data, error } = await supabase
        .from("blog_comment_likes")
        .select("")
        .eq("comment_id", commentID)
        .eq("user_email", req.user.email);

    if (error) {
        return res.json({ error: error.message });
    }
    if (data && data.length === 0) {
        const { error } = await supabase
            .from("blog_comment_likes")
            .insert({ comment_id: commentID, user_email: req.user.email })
        if (error) {
            return res.json({ error: error.message });
        }
        return res.json({ success: "Like added successfully!" });
    } else if (data && data.length > 0) {
        const { error } = await supabase
            .from("blog_comment_likes")
            .delete()
            .eq("comment_id", commentID)
            .eq("user_email", req.user.email);
        if (error) {
            return res.json({ error: error.message });
        }
        return res.json({ success: "Like removed successfully!" });
    }
}

const addCommentDislike = async (req, res) => {
    const { commentID } = req.body;

    const { error: newError } = await supabase
        .from("blog_comment_likes")
        .delete()
        .eq("comment_id", commentID)
        .eq("user_email", req.user.email);

    if (newError) {
        return res.json({ error: newError.message });
    }

    const { data, error } = await supabase
        .from("blog_comment_dislikes")
        .select("")
        .eq("comment_id", commentID)
        .eq("user_email", req.user.email);

    if (error) {
        return res.json({ error: error.message });
    }
    if (data && data.length === 0) {
        const { error } = await supabase
            .from("blog_comment_dislikes")
            .insert({ comment_id: commentID, user_email: req.user.email })
        if (error) {
            return res.json({ error: error.message });
        }
        return res.json({ success: "Dislike added successfully!" });
    } else if (data && data.length > 0) {
        const { error } = await supabase
            .from("blog_comment_dislikes")
            .delete()
            .eq("comment_id", commentID)
            .eq("user_email", req.user.email);
        if (error) {
            return res.json({ error: error.message });
        }
        return res.json({ success: "Dislike removed successfully!" });
    }
}

const addLike = async (req, res) => {
    const { blogID } = req.body;
    const { data, error } = await supabase
        .from("blogs")
        .select("likes")
        .eq("id", blogID);

    if (error) {
        return res.json({ error: error.message });
    }

    const { error: newError } = await supabase
        .from("blogs")
        .update({ likes: data[0].likes + 1 })
        .eq("id", blogID);

    if (!newError) {
        return res.json({ success: "Like added successfully!" });
    }
    return res.json({ error: newError.message });
};

module.exports = {
    getBlogs,
    getAllBlogs,
    createBlog,
    getCurrentBlog,
    deleteBlog,
    addLike,
    getComments,
    postComment,
    addCommentLike,
    addCommentDislike
};
