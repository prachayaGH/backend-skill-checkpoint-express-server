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

export const validateAnswer = (req, res, next) => {
    const {content} = req.body
    if (!content) {
        return res.status(400).json({
            message: "Invalid request data.",
        })
    }
    if (content.length > 300) {
        return res.status(400).json({
            message: "Answer must be at least 300 characters long.",
        })
    }
    next()
}