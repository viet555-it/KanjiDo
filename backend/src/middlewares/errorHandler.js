export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    // Log stack trace only in development
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    
    // Friendly database error messages
    let message = err.message || 'Internal Server Error';
    if (err.code === 'ER_DUP_ENTRY') {
        message = 'Duplicate entry found in the database.';
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        message = 'Foreign key constraint failed. Related record not found.';
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};
