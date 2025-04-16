export const validateQuestion = (req, res, next) => {
    const {title, description, category} = req.body
    if (!title || !description || !category) {
        return res.status(400).json({
            message: "Invalid request data.",
        })
    }

    const categories = ['technology', 'cuisine', 'travelling', 'science', 'literature', 'music', 'sports', 'movies', 'history', 'miscellaneous', 'Geography']
    if (!categories.includes(category)) {
        return res.status(400).json({
            message: "Category not found."
        })
    }

    next()
}
