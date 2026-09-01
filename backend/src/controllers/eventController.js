const events = [
    {
        id: 1,
        title: "AI Hackathon 2026",
        category: "Hackathon",
        location: "Chennai",
        mode: "Offline",
        skills: ["Python", "Machine Learning", "AI"],
        interests: ["AI", "Hackathons"]
    },
    {
        id: 2,
        title: "Web Development Challenge",
        category: "Competition",
        location: "Online",
        mode: "Online",
        skills: ["JavaScript", "React", "Node.js"],
        interests: ["Web Development"]
    },
    {
        id: 3,
        title: "Data Science Workshop",
        category: "Workshop",
        location: "Bangalore",
        mode: "Offline",
        skills: ["Python", "SQL", "Data Science"],
        interests: ["Data Science", "AI"]
    }
];

const getAllEvents = (req, res) => {
    res.json({
        success: true,
        count: events.length,
        data: events
    });
};

const getEventById = (req, res) => {
    const id = Number(req.params.id);

    const event = events.find((event) => event.id === id);

    if (!event) {
        return res.status(404).json({
            success: false,
            message: "Event not found"
        });
    }

    res.json({
        success: true,
        data: event
    });
};

const searchEvents = (req, res) => {
    const query = req.query.query?.toLowerCase();

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Search query is required"
        });
    }

    const results = events.filter((event) => {
        return (
            event.title.toLowerCase().includes(query) ||
            event.category.toLowerCase().includes(query) ||
            event.skills.some((skill) =>
                skill.toLowerCase().includes(query)
            )
        );
    });

    res.json({
        success: true,
        count: results.length,
        data: results
    });
};

const getEventsByCategory = (req, res) => {
    const category = req.params.category.toLowerCase();

    const results = events.filter(
        (event) => event.category.toLowerCase() === category
    );

    res.json({
        success: true,
        count: results.length,
        data: results
    });
};

module.exports = {
    getAllEvents,
    getEventById,
    searchEvents,
    getEventsByCategory
};