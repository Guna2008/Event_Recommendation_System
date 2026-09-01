const searchHistory = [];

const saveSearch = (req, res) => {
    const { userId, query } = req.body;

    if (!userId || !query) {
        return res.status(400).json({
            success: false,
            message: "userId and query are required"
        });
    }

    const search = {
        id: searchHistory.length + 1,
        userId,
        query,
        createdAt: new Date()
    };

    searchHistory.push(search);

    res.status(201).json({
        success: true,
        data: search
    });
};

const getSearchHistory = (req, res) => {
    const userId = Number(req.params.userId);

    const searches = searchHistory.filter(
        (search) => search.userId === userId
    );

    res.json({
        success: true,
        count: searches.length,
        data: searches
    });
};

module.exports = {
    saveSearch,
    getSearchHistory
};