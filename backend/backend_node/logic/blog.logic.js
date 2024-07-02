const { supabase } = require("../utility/database.connection");

const createBlogLogic = async (body, user) => {
  const { title, content } = body;
  const { email, name } = user;

  const { error } = await supabase.from("blogs").insert({
    title: title,
    content: content,
    email: email,
    name: name,
    likes: 0,
  });

  if (!error) {
    return { success: "Blog created successfully!" };
  }

  return { error: error.message };
};

const fetchBlogDetailsLogic = async (params) => {
  const { id } = params;

  const { data, error } = await supabase.from("blogs").select().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: data[0] };
};

const deleteBlogLogic = async (params) => {
  const { id } = params;

  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (!error) {
    return { success: "Blog deleted successfully!" };
  }

  return { error: error.message };
};

const fetchAllBlogsLogic = async () => {
  const { data, error } = await supabase.rpc("get_blogs_with_likes");

  if (!error) {
    return { success: data };
  }

  return { error: error.message };
};

const fetchCommentsOnBlogLogic = async (params) => {
  const { id } = params;

  const { data, error } = await supabase.rpc(
    "get_comments_with_likes_dislikes",
    { blog_id: id }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: data };
};

const postCommentOnBlogLogic = async (user, params, body) => {
  const { email, name, gender } = user;
  const { id } = params;
  const { comment } = body;

  const { error } = await supabase.from("blog_comments").insert({
    blog_id: id,
    comment: comment,
    user_email: email,
    user_name: name,
    gender: gender,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Comment added successfully!" };
};

const addLikeOnCommentLogic = async (user, params) => {
  const { email } = user;
  const { commentId } = params;

  const { error: removeDislikeError } = await supabase
    .from("blog_comment_dislikes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_email", email);

  if (removeDislikeError) {
    return { error: removeDislikeError.message };
  }

  const { data, error } = await supabase
    .from("blog_comment_likes")
    .select("")
    .eq("comment_id", commentId)
    .eq("user_email", email);

  if (error) {
    return { error: error.message };
  }

  if (data.length === 0) {
    const { error } = await supabase
      .from("blog_comment_likes")
      .insert({ comment_id: commentId, user_email: email });

    if (error) {
      return { error: error.message };
    }

    return { success: "Like added successfully!" };
  } else {
    const { error } = await supabase
      .from("blog_comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_email", email);

    if (error) {
      return { error: error.message };
    }

    return { success: "Like removed successfully!" };
  }
};

const addDislikeOnCommentLogic = async (user, params) => {
  const { commentId } = params;
  const { email } = user;

  const { error: removeLikeError } = await supabase
    .from("blog_comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_email", email);

  if (removeLikeError) {
    return { error: removeLikeError.message };
  }

  const { data, error } = await supabase
    .from("blog_comment_dislikes")
    .select("")
    .eq("comment_id", commentId)
    .eq("user_email", email);

  if (error) {
    return { error: error.message };
  }

  if (data.length === 0) {
    const { error } = await supabase
      .from("blog_comment_dislikes")
      .insert({ comment_id: commentId, user_email: email });

    if (error) {
      return { error: error.message };
    }

    return { success: "Dislike added successfully!" };
  } else {
    const { error } = await supabase
      .from("blog_comment_dislikes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_email", email);

    if (error) {
      return { error: error.message };
    }

    return { success: "Dislike removed successfully!" };
  }
};

const deleteCommentOnBlogLogic = async (params) => {
  const { commentId } = params;

  const { error } = await supabase
    .from("blog_comments")
    .delete()
    .eq("comment_id", commentId);

  if (error) {
    return { error: error.message };
  }

  return { success: "Comment deleted successfully!" };
};

const addLikeOnBlogLogic = async (params, user) => {
  const { id } = params;
  const { email } = user;

  const { data, error } = await supabase
    .from("blog_likes")
    .select("")
    .eq("blog_id", id)
    .eq("user_email", email);

  if (error) {
    return { error: error.message };
  } else if (data.length > 0) {
    const { error } = await supabase
      .from("blog_likes")
      .delete()
      .eq("blog_id", id)
      .eq("user_email", email);

    if (error) {
      return { error: error.message };
    }

    return { success: "Like removed successfully!" };
  } else {
    const { error } = await supabase
      .from("blog_likes")
      .insert({ blog_id: id, user_email: email });

    if (error) {
      return { error: error.message };
    }

    return { success: "Like added successfully!" };
  }
};

const addReplyOnCommentLogic = async (params, user, body) => {
  const { commentId, blogId } = params;
  const { email, name, gender } = user;
  const { reply } = body;

  const { error } = await supabase.from("blog_comments").insert({
    parent_comment_id: commentId,
    comment: reply,
    user_email: email,
    user_name: name,
    blog_id: blogId,
    gender: gender,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Reply added successfully!" };
};

const updateCommentLogic = async (params, user, body) => {
  const { commentId } = params;
  const { email } = user;
  const { comment } = body;

  const { error } = await supabase
    .from("blog_comments")
    .update({ comment: comment })
    .eq("comment_id", commentId)
    .eq("user_email", email);

  if (error) {
    return { error: error.message };
  }

  return { success: "Comment updated successfully!" };
};

module.exports = {
  createBlogLogic,
  fetchBlogDetailsLogic,
  deleteBlogLogic,
  fetchAllBlogsLogic,
  fetchCommentsOnBlogLogic,
  postCommentOnBlogLogic,
  addLikeOnCommentLogic,
  addDislikeOnCommentLogic,
  deleteCommentOnBlogLogic,
  addLikeOnBlogLogic,
  addReplyOnCommentLogic,
  updateCommentLogic,
};
