const searchMentorsLogic = async (params) => {
    const { search_query } = params;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const response = await fetch("https://mentore-api.onrender.com/recommend?input=" + search_query, options)
    const result = await response.json();

    if (result.Error) {
        return { error: result.error };
    }
    return { success: result.response };
}


module.exports = {
    searchMentorsLogic,
}