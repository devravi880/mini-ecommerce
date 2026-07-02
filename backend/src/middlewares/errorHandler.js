import config from '../config/index.js';
import { sendError } from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'MulterError') {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File size too large. Maximum 5MB allowed'
        : 'File upload failed';
  }

  if (config.nodeEnv === 'development') {
    console.error(err);
  }

  sendError(res, {
    statusCode,
    message,
    error: err.isOperational
      ? err.message
      : config.nodeEnv === 'development'
        ? err.stack
        : 'SERVER_ERROR',
  });
};

export default errorHandler;
