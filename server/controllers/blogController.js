const { supabase } = require("../utility/dbConnection")

const getBlogs = async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select()
        .eq('email', req.user.email)
    if (!error) {
        return res.json({ result: data })
    }
    return res.json({ error: error.message })
}

const getAllBlogs = async (req, res) => {
    const { data, error } = await supabase
        .from('blogs')
        .select()
    if (!error) {
        return res.json({ result: data })
    }
    return res.json({ error: error.message })
}

const createBlog = async (req, res) => {
    const { title, content } = req.body;
    const { error } = await supabase
        .from('blogs')
        .insert({
            title: title,
            content: content,
            email: req.user.email,
            name: req.user.name
        })
    if (!error) {
        return res.json({ success: 'Blog created successfully!' })
    }
    return res.json({ error: error.message })
}

const getCurrentBlog = async (req, res) => {
    const { blogID } = req.body;
    const { data, error } = await supabase
        .from('blogs')
        .select()
        .eq('id', blogID)
    if (!error) {
        return res.json({ result: data[0] })
    }
    return res.json({ error: error.message })
}

const deleteBlog = async (req, res) => {
    const { id } = req.body;
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)
    if (!error) {
        return res.json({ success: 'Blog deleted successfully!' })
    } else {
        return res.json({ error: error.message })
    }
}

module.exports = {
    getBlogs,
    getAllBlogs,
    createBlog,
    getCurrentBlog,
    deleteBlog
}