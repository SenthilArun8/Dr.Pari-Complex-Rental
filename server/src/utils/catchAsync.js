// src/utils/catchAsync.js
// A wrapper to handle async errors and pass them to the Express error middleware
export const catchAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};