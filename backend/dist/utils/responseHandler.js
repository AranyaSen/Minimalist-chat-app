"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = (res, message, statusCode = 200, data = null) => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        statusCode,
        message,
        data,
    });
};
exports.responseHandler = responseHandler;
