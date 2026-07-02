import { sendError } from '../utils/apiResponse.js';

const notFound = (req, res) => {
  sendError(res, {
    statusCode: 404,
    message: `Route not found: ${req.originalUrl}`,
    error: 'NOT_FOUND',
  });
};

export default notFound;
