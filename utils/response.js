function successResponse(message, data) {
    return {
        success: true,
        message,
        data
    }
}

function failedResponse(message, data) {
    return {
        success: false,
        message,
        data
    }
}

module.exports = successResponse, failedResponse