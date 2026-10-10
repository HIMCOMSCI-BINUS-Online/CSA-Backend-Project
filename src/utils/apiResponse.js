function successResponse(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    })
}

function errorResponse(res, message, statusCode = 500, errors = null) {
    return {
        success: false,
        message,
        errors
    }
}

    module.exports = { successResponse, errorResponse }