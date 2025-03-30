const apiResponse = {
    success: (res, message, data = {}) => {
        res.status(200).json({
            success: true,
            message,
            data,
        });
    },

    created: (res, message, data = {}) => {
        res.status(201).json({
            success: true,
            message,
            data,
        });
    },

    badRequest: (res, message) => {
        res.status(400).json({
            success: false,
            message,
        });
    },

    unauthorized: (res, message = "Unauthorized") => {
        res.status(401).json({
            success: false,
            message,
        });
    },

    forbidden: (res, message = "Forbidden") => {
        res.status(403).json({
            success: false,
            message,
        });
    },

    notFound: (res, message = "Not Found") => {
        res.status(404).json({
            success: false,
            message,
        });
    },

    serverError: (res, message = "Internal Server Error") => {
        res.status(500).json({
            success: false,
            message,
        });
    },
};

export default apiResponse;
