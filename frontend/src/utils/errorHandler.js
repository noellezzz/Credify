// Error handling utility for API responses
export const formatErrorMessage = (error) => {
    if (!error) return 'An unexpected error occurred';

    // Handle different error formats
    if (typeof error === 'string') {
        return error;
    }

    if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        if (status === 404) {
            return 'The requested resource was not found';
        }

        if (status === 401) {
            return 'You are not authorized to perform this action';
        }

        if (status === 403) {
            return 'Access forbidden. Please check your permissions';
        }

        if (status === 422) {
            return 'Please check your input and try again';
        }

        if (status >= 500) {
            return 'Server error. Please try again later';
        }

        // Handle HTML responses (like the DOCTYPE error)
        if (typeof data === 'string' && data.includes('<!DOCTYPE html>')) {
            return 'Server returned an invalid response. Please try again.';
        }

        // Handle structured error responses
        if (data && typeof data === 'object') {
            if (data.message) return data.message;
            if (data.error) return data.error;
            if (data.detail) return data.detail;
        }

        return `Request failed with status ${status}`;
    }

    if (error.request) {
        // Network error
        return 'Network error. Please check your connection and try again';
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

// Error types for different scenarios
export const ErrorTypes = {
    NETWORK: 'network',
    AUTH: 'auth',
    VALIDATION: 'validation',
    SERVER: 'server',
    UNKNOWN: 'unknown'
};

// Categorize error types
export const getErrorType = (error) => {
    if (!error) return ErrorTypes.UNKNOWN;

    if (error.response) {
        const { status } = error.response;

        if (status === 401 || status === 403) {
            return ErrorTypes.AUTH;
        }

        if (status === 422) {
            return ErrorTypes.VALIDATION;
        }

        if (status >= 500) {
            return ErrorTypes.SERVER;
        }
    }

    if (error.request) {
        return ErrorTypes.NETWORK;
    }

    return ErrorTypes.UNKNOWN;
};

// Get appropriate icon for error type
export const getErrorIcon = (errorType) => {
    switch (errorType) {
        case ErrorTypes.NETWORK:
            return '🌐';
        case ErrorTypes.AUTH:
            return '🔒';
        case ErrorTypes.VALIDATION:
            return '⚠️';
        case ErrorTypes.SERVER:
            return '🔧';
        default:
            return '❌';
    }
};

// Get appropriate color class for error type
export const getErrorColorClass = (errorType) => {
    switch (errorType) {
        case ErrorTypes.NETWORK:
            return 'bg-blue-50 border-blue-200 text-blue-800';
        case ErrorTypes.AUTH:
            return 'bg-red-50 border-red-200 text-red-800';
        case ErrorTypes.VALIDATION:
            return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case ErrorTypes.SERVER:
            return 'bg-red-50 border-red-200 text-red-800';
        default:
            return 'bg-gray-50 border-gray-200 text-gray-800';
    }
}; 